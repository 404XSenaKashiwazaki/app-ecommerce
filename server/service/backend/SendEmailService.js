import { Op } from "sequelize"
import { ImageProducts, Orders, Products, Users } from "../../models/Index.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import env from "dotenv"
import nodemailer from "nodemailer"
//============================// 

env.config()

export const sendEmails = async (req) => {
    const { orders } = req.body
    const { email, first_name, last_name, username } = orders.customer_details
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_SERVER_USER,
        to: process.env.EMAIL_SERVER_USER_ADMIN,
        subject: `${ process.env.APP_NAME } - Order Sukses!`,
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <div>  
                        <h2>Order Sukses!</h2>
                        <p style="margin-top: 10px; margin-bottom: 15px;">Terima kasih telah melakukan pembelian ${ first_name } ${ last_name }. Pesanan Anda sedang diproses.</p>
                        <a href="http://localhost:5173/profile/${ username}?p=Dikemas" target="_blank" rel="noopener noreferrer">Lihat pesanan</a>
                    </div>
                </body>
                </html>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error)  throw CreateErrorMessage("Email gagal dikirim",500)
    })

    return { 
        status:  200,
        message: `Email berhasil dikirim`, 
        response: {   } 
    }
}

export const sendEmailsAfterSuccessTransaction = async data => {
    const { email,titleMessage, bodyMessage, products, totalPrice, transactionId} = data
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_SERVER_USER,
        to: email,
        subject: `${ process.env.APP_NAME } - Order Sukses!`,
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                    <style>
                        .product-box{
                            display: flex;
                            gap: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div>  
                        <h2>${ titleMessage }</h2>
                        <h4>Transaction ID #${transactionId} </h4>
                        <br>
                        <p style="margin-top: 10px; margin-bottom: 15px;">${ bodyMessage }</p>
                        ${ (products && products.length > 0) && products.map(e=> {
                            return `<div class="product-box">
                                <p>${ e.nama_produk }</p>
                            </div>`
                        }) }
                        <h3> Total : ${ totalPrice } </h3>
                    </div> 
                </body>
                </html>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error)  throw CreateErrorMessage("Email gagal dikirim",500)
    })
}