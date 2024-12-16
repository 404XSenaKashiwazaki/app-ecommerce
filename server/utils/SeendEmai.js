
import env from "dotenv"

env.config()

export const SeendEmail = async (transporter,email, subject, html) => {
    const mailOptions = {
        from: 
        process.env.EMAIL_SERVER_USER,
        to: email,
        subject: `${ process.env.APP_NAME } - ${ subject }!`,
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <div>  
                        <h2>${ subject }!</h2>
                        <p style="margin-top: 10px; margin-bottom: 15px;">${ html }</p>
                    </div>
                </body>
                </html>`
    }
    await transporter.sendMail(mailOptions)
}