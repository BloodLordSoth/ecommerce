import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export function sendMail(emailadd){
    const subject = 'Welcome to Fake Cemetary Crypt'
    const to = emailadd

    const mail = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SECRET_MAIL,
            pass: process.env.MAIL_KEY
        }
    })

    mail.sendMail({
        to: to,
        subject: subject,
        text: 'This is where further auth could come into play.'
    })

}