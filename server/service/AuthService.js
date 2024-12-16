import Users, { User_Role } from "../models/backend/Users.js"
import { CreateErrorMessage } from "../utils/CreateError.js"
import sequelize from "../config/Database.js"
import UsersDetails from "../models/backend/UsersDetails.js"

import env from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Role from "../models/backend/Roles.js"
import Shops from "../models/backend/Shops.js"
import { SeendEmail } from "../utils/SeendEmai.js"
import { transporter } from "../config/SeendEmail.js"

env.config()

export const login = async (req,res) => {
    const { email, password } = req.body
    const user = await Users.findOne({ 
        where:{ email: email },
        include: [{ 
            model: Role, attributes:["id","name","desk"], 
            through: { attributes:["RoleId","UserId"] }
        },{ 
            model: UsersDetails
        }] 
    })
    if(!user) throw CreateErrorMessage("Username tidak ditemukan, silahkan register",400)
    
    const match = await bcrypt.compare(password,user.password)
    if(!match) throw CreateErrorMessage("Username / Password anda salah",400)
    if(!user.isActive) throw CreateErrorMessage("Anda belum memverifikasi email",400)
    const roles = user.Roles
    const navigate = roles.map(t => (t.name.trim().toLowerCase().includes("admin","penjual")) ? "/api/dashboard" : "/")
    
    
    const accessToken = jwt.sign({ 
        id: user.id,
        username: user.username,
        namaDepan: user.namaDepan,
        namaBelakang: user.namaBelakang,
        email: user.email,
        roles: user.Roles,
        detailUsers: user.UsersDetail,
        navigate: navigate[0]
    },
        process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "30s"})

    const refreshToken = jwt.sign({ 
        id: user.id,
        username: user.username,
        namaDepan: user.namaDepan,
        namaBelakang: user.namaBelakang,
        email: user.email,
        roles: user.Roles,
        detailUsers: user.UsersDetail,
        navigate: navigate[0]
    },
        process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: "1d"})
    res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 60*60*24*1000})
    await user.update({token: refreshToken})

    return {
        status: 201,
        message: "Login berhasil",
        response: { accessToken }
    }
}

export const register = async (req,res) => {
    let { namaDepan, namaBelakang, username, email, password } = req.body
    username.toLowerCase()

    const saltRound = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password,saltRound)

    let users
    await sequelize.transaction(async transaction => {
        users = await Users.create({namaDepan, namaBelakang,email,username,password,token: ""},{ transaction })
        await User_Role.create({ RoleId: 3, UserId: users.id },{ transaction })
        await UsersDetails.create({ UserId: users.id,alamat: "" },{ transaction })
    })

    const accessToken = jwt.sign({ 
        id: users.id,
        username: users.username,
        namaDepan: users.namaDepan,
        namaBelakang: users.namaBelakang,
        email: users.email,
        roles: users.Roles,
        detailUsers: users.UsersDetail
    },
        process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "30s"})

    const refreshToken = jwt.sign({ 
        id: users.id,
        username: users.username,
        namaDepan: users.namaDepan,
        namaBelakang: users.namaBelakang,
        email: users.email,
        roles: users.Roles,
        detailUsers: users.UsersDetail
    },
        process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: "1d"})
    res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 60*60*24*1000})
    
    const token = jwt.sign({ userId: users.id, email: users.email, fullname: users.namaDepan + " " +users.namaBelakang, username: users.username },process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" } )
    const url = "http://localhost:5173/verify-email?token="+token
    
    const subject = "Verifikasi Email"
    const html = `Klik link <a href="${url}">ini</a> untuk memverifikasi akun anda.`
    await SeendEmail(transporter,users.email,subject,html)

    return {
        status: 201,
        message: "Daftar berhasil, silahkan verifikasi email anda",
        response: { accessToken, users }
    }
}

export const logout = async (req,res) => {
    const refreshToken = req.cookies.jwt
    if(!refreshToken) throw CreateErrorMessage("Tidak ditemukan data",401)
    const user = await Users.findOne({where: {token: refreshToken}})
    
    if(!user) throw CreateErrorMessage("Tidak ditemukan data",403)
    await user.update({token: ""})
    res.clearCookie("jwt")

    return {
        status: 200,
        message: "Logout berhasil",
        response: { user: user.username }
    }
}

export const forgotPassword = async req => {
    const { email } = req.body 
    const users = await Users.findOne({ where: { email } })
    if(!users) throw CreateErrorMessage("Email anda tidak ditemukan",404)
    
    const token = jwt.sign({ email },process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" } )
    const tokenExp = new Date(Date.now() + 3600000)
    await users.update({ resetToken: token, resetTokenExp: tokenExp })
    
    const url = "http://localhost:5173/reset-password?token="+token
    const subject = "Lupa Password"
    const html = `Klik link <a href="${url}">ini</a> untuk mereset password akun anda.`

    await SeendEmail(transporter,users.email,subject,html)
    return {
        status: 200,
        message: "Reset token dikirim ke email anda",
        response: { resetToken: token }
    }
}

export const newPassword = async req => {
    let { password, resetToken} = req.body
    const dataDecode = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET,(err,decode) => {
        if((err)) throw CreateErrorMessage("Reset Token tidak valid",400)
        return decode
    })
    const users = await Users.findOne({ where: { email: dataDecode.email, resetToken } })
    
    if(!users || users.resetTokenExp < new Date()) throw CreateErrorMessage("Reset token tidak valid",400) 
    const saltRound = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password,saltRound)

    await users.update({ password, resetToken: null, resetTokenExp: null }) 
    const subject = `Halo ${users.namaDepan} ${users.namaBelakang}, Password anda berhasil diubah!`
    const html = `Silahkan login menggunakan password yang baru`
    
    await SeendEmail(transporter,users.email,subject,html)
    return {
        status: 200,
        message: "Password anda berhasil diubah",
        response: { users }
    }
}

export const verifyEmail = async req => {
    let { token } = req.body
    const dataDecode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decode) => {
        if((err)) throw CreateErrorMessage("Token  Aktivasi tidak valid",400)
        return decode
    })
    const users = await Users.findOne({ where: { id: dataDecode.userId, email: dataDecode.email } })

    if(!users) throw CreateErrorMessage("Token Aktivasi tidak valid",400)    
    await users.update({ isActive: 1 })
    return {
        status: 200,
        message: "Email anda berhasil di verifikasi",
        response: { resetToken: token }
    }
}

