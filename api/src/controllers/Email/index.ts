import nodemailer from 'nodemailer'
import fs from 'fs'
import { join } from 'path'
import { Resend } from 'resend'

const from = 'evotraining@resend.dev'

type Template = 'reset-pass' | 'verify-email' | {
}

type SendEmailProps = {
    to: string
    subject: string
    html?: string
    template?: Template
    data: any
}

export default class EmailController {
    private resend: Resend

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY)
    }

    getTemplate(template: Template, data: { token: string, emailCode?: string }) {
        var htmlTemplate

        switch (template) {
            case 'reset-pass':
                const resetPassTemplate = fs.readFileSync(join(__dirname, '..', '..', '..', 'data', 'email', 'recoverypass_template.html'), 'utf-8')
                htmlTemplate = resetPassTemplate.replace('{{linkToReset}}', `https://evotraining.pt/redirect?tkn=${data.token}&ty=rkp`)
                break
            case 'verify-email':
                if (!data.emailCode) throw new Error("Email code is required in 'verify-email' template")

                const verifyEmailTemplate = fs.readFileSync(join(__dirname, '..', '..', '..', 'data', 'email', 'verifyemail_template.html'), 'utf-8')
                htmlTemplate = verifyEmailTemplate.replace('{{linkToVerify}}', `https://evotraining.pt/redirect?tkn=${data.token}&ty=ve`)
                htmlTemplate = verifyEmailTemplate.replace('{{code}}', data.emailCode)
                break
            default:
                return null
        }


        return htmlTemplate
    }

    send({ subject, to, template, html = '', data }: SendEmailProps) {
        return new Promise(async (resolve, reject) => {
            if (template) {
                if (!data) return reject('Required data')

                const templateHTML = this.getTemplate(template, data)

                if (templateHTML === null) return reject('Template not found')

                this.resend.emails.send({
                    from: 'evotraining@resend.dev',
                    to,
                    subject,
                    html: templateHTML
                })

                resolve(true)
                return
            }

            this.resend.emails.send({
                from,
                to,
                subject,
                html
            })
                .catch((err) => {
                    reject(err)
                })

            resolve(true)
        })
    }
}
