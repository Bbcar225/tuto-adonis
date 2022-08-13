import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController
{
  async index({ view }: HttpContextContract)
  {
    return view.render('auth.index')
  }

  async store({ request, auth, response, session }: HttpContextContract)
  {
    const email = request.input('email')

    const password = request.input('password')

    try
    {
      await auth.use('web').attempt(email, password)

      return response.redirect().toRoute('home')
    }
    catch
    {
      session.flash({
        'type-alert': 'danger',
        'alert-message': "Nous n'avons pas d'enregistrement correspond !"
      })

      return response.redirect().toRoute('auth.index')
    }
  }

  async logout({auth, response, session}: HttpContextContract)
  {
    await auth.use('web').logout()

    session.flash({
      'type-alert': 'success',
      'alert-message': "Vous vous êtes déconnecté à très bientôt !"
    })

    return response.redirect().toRoute('home')
  }
}
