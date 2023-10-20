import nodemailer from 'nodemailer'

const from = '"EvoTraining" <no-reply@evotraining.com>'

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: '04b8fbeb8b8a3a',
        pass: '9b0e597af392a2'
    }
})

type SendEmailProps = {
    to: string
    subject: string
    html: string
}

export function sendEmail({ to, subject, html }: SendEmailProps) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
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

