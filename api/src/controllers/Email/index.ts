import nodemailer from 'nodemailer'
import fs from  'fs'
import { join } from 'path'
import { generateLinkToken } from '../Tokens'

const from = '"EvoTraining" <no-reply@evotraining.com>'
const scheme = 'exp://dbjqgqg.abrocha.8081.exp.direct/--/'

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: '04b8fbeb8b8a3a',
        pass: '9b0e597af392a2'
    }
})

type Template = 'reset-pass' | 'verify-email'

type SendEmailProps = {
    to: string
    subject: string
    html?: string
    template?: Template
}

export function getTemplate(template: Template, token: string) {
    var htmlTemplate

    switch(template) {
        case 'reset-pass':
            const resetPassTemplate = fs.readFileSync(join(__dirname, '..', '..', '..', 'data', 'email', 'recoverypass_template.html'), 'utf-8')
            htmlTemplate = resetPassTemplate.replace('{{linkToReset}}', `${scheme}(auth)/recoverypass/${token}`)

            break
        case 'verify-email':
            const verifyEmailTemplate = fs.readFileSync(join(__dirname, '..', '..', '..', 'data', 'email', 'recoverypass_template.html'), 'utf-8')
            htmlTemplate = verifyEmailTemplate.replace('{{linkToVerify}}', `${scheme}(auth)/verifyemail/${token}`)
            break
        default:
            return null
    }


    return htmlTemplate
}

export function sendEmail({ to, subject, html, template }: SendEmailProps) {
    return new Promise(async (resolve, reject) => {
        if(template) {
            const token = await generateLinkToken(template)

            const templateHTML = getTemplate(template, token)
            
            if(templateHTML === null) return reject('Template not found')
            
            transporter.sendMail({
                from,
                to,
                subject,
                html: templateHTML
            })
            .catch((err) => {
                reject(err)
            })
    
            resolve(true)
            return
        }

        transporter.sendMail({
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

sendEmail({
    to: 'admin@evotraining.com',
    subject: 'Troque a sua senha.',
    template: 'reset-pass'
})