import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class RegistersController
{
  async index({ view }: HttpContextContract)
  {
    return view.render('register/index')
  }

  async store({ request, response, session, auth }: HttpContextContract)
  {
    const data = await request.validate({
      schema: schema.create({
        noms: schema.string({trim: true}, [
          rules.minLength(5),
          rules.maxLength(20)
        ]),

        email: schema.string({trim: true}, [
          rules.email(),
          rules.unique({table: 'users', column: 'email'})
        ]),

        password: schema.string([
          rules.confirmed()
        ])
      })
    })

    await User.create({
      full_name: data.noms,
      email: data.email,
      password: data.password
    })

    session.flash({
      'type-alert': 'success',
      'alert-message': "Inscription validée !!!"
    })

    return response.redirect().toRoute('home')
  }
}
