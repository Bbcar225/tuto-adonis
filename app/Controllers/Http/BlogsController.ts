import { string } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Post from 'App/Models/Post'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class BlogsController
{
  async index ({ view, request } : HttpContextContract)
  {
    const page = request.input('page', 1)

    const posts = await Database.from(Post.table).orderBy('id', 'desc').paginate(page, 4)

    return view.render('blog/index', {
      posts: posts,
      page: page,
    })
  }

  async create ({view}: HttpContextContract)
  {
    const post = new Post()

    const categories = await Category.all()

    return view.render('blog/create', {
      post      : post,
      categories: categories
    })
  }

  async store ({params, request, response, session, auth}: HttpContextContract)
  {
    await this.handle_request(params, request, undefined, auth)

    session.flash({
      'type-alert'   : 'success',
      'alert-message': "Création de l'article effectuée succès."
    })

    return response.redirect().toRoute('home')
  }

  async show ({ params, view }: HttpContextContract)
  {
    const post = await Post.query().preload('category').preload('user').where('id', params.id).firstOrFail()

    const categories = await Category.all()

    return view.render('blog/show', {
      post      : post,
      categories: categories
    })
  }

  async update ({params, request, response, session, bouncer}: HttpContextContract)
  {
    await this.handle_request(params, request, bouncer)

    session.flash({
      'type-alert'   : 'success',
      'alert-message': "Modification de l'article effectuée succès."
    })

    return response.redirect().toRoute('home')
  }

  private async handle_request (params: HttpContextContract['params'], request: HttpContextContract['request'], bouncer?: HttpContextContract['bouncer'], auth?: HttpContextContract['auth'])
  {
    const post = params.id ? await Post.findOrFail(params.id) : new Post()

    if (bouncer)
    {
      await bouncer.authorize('can-edit-post', post)
    }

    const data = await request.validate(UpdatePostValidator)

    const thumbnail = request.file('thumbnail')

    if (thumbnail)
    {
      if (post.thumbnail)
      {
        await Drive.delete(post.thumbnail)
      }

      const new_name = string.generateRandom(32) + '.' + thumbnail.extname

      await thumbnail.moveToDisk('./', {name: new_name})

      post.thumbnail = new_name
    }

    post.merge({title: data.title, category_id: data.category_id, content: data.content, online: data.online || false, user_id: auth?.user?.id}).save()
  }

  async destroy ({params, response, session, bouncer}: HttpContextContract)
  {
    const post = await Post.findOrFail(params.id)

    await bouncer.authorize('can-edit-post', post)

    if (post.thumbnail)
    {
      await Drive.delete(post.thumbnail)
    }

    await post.delete()

    session.flash({
      'type-alert'   : 'success',
      'alert-message': "Suppression de l'article effectuée avec succès."
    })

    return response.redirect().back()
  }
}
