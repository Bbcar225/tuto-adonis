import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Conctact from 'App/Models/Conctact'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class ConctactsController {
  async index({ view }: HttpContextContract) {
    return view.render('contact/index')
  }

  async store({ request, response, session }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        full_name: schema.string({ trim: true }, [
          rules.minLength(5),
          rules.maxLength(20)
        ]),

        email: schema.string({ trim: true }, [
          rules.email()
        ]),

        sujet: schema.string.nullable({ trim: true }),

        message: schema.string({ trim: true }, [
          rules.minLength(10),
        ])
      })
    })

    const contact = await Conctact.create({
      full_name: data.full_name,
      email: data.email,
      message: data.message,
      sujet: data.sujet || undefined
    })

    await Mail.send((message) => {
      message
        .from(contact.email)
        .to(Env.get('SMTP_EMAIL_FROM'))
        .subject(contact.sujet || 'Pas de sujet')
        .htmlView('contact/email', { contact: contact })
    })

    session.flash({
      'type-alert': 'success',
      'alert-message': "Votre message a été envoyé nous vous reviendrons !"
    })

    return response.redirect().toRoute('contact.index')
  }
}
