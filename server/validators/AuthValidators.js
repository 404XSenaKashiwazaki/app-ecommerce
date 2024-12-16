import { check } from "express-validator"
import User from "../models/backend/Users.js"


export const username = (async (username, { req }) => {
    const inDb = await User.findOne({ where: { username: username }, paranoid: false  })
    if(inDb) throw new Error(`Username ${ username } sudah di gunakan`)
    return true
})

const valPasswordConf = (value,{ req }) => {
    if(value != req.body.password) throw new Error("Konfirmasi password / password tidak sama")
    return true
}

const valEmailAlreadyExits = async (value) => {
    const user = await User.findOne({ where: { email: value }, paranoid: false })
    if(user) throw new Error("Email sudah terdaftar")
    return true
}

const valUsernameAlreadyExits = async (value) => {
    const user = await User.findOne({ where: { username: value }, paranoid: false })
    if(user) throw new Error("Username sudah terdaftar")
    return true
}


export const ruleLogin = [
    // check("username").trim().notEmpty().withMessage("Username tidak boleh kosong"),
    check("email").trim().notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Email tidak valid"),
    check("password").trim().notEmpty().withMessage("Password tidak boleh kosong").isLength({ min: 5 }).withMessage("Password minimal 5 karakter")
]
export const ruleRegister = [
    check("namaDepan").trim().notEmpty().withMessage("Nama Depan tidak boleh kosong"),
    check("namaBelakang").trim().notEmpty().withMessage("Nama Belakang tidak boleh kosong"),
    check("username").trim().notEmpty().withMessage("Username tidak boleh kosong").custom(valUsernameAlreadyExits),
    check("email").trim().notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Email tidak valid").custom(valEmailAlreadyExits),
    check("password").trim().notEmpty().withMessage("Password tidak boleh kosong").isLength({ min: 5 }).withMessage("Password minimal 5 karakter"),
    check("konf_password").trim().notEmpty().withMessage("Konfirmasi Password tidak boleh kosong").isLength({ min: 5 }).withMessage("Konfirmasi password minimal 5 karakter").custom(valPasswordConf)
]

export const ruleForgotPassword = [
    check("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Email tidak valid")
]

export const ruleNewPassword = [ 
    check("password").trim().notEmpty().withMessage("Password tidak boleh kosong").isLength({ min: 5 }).withMessage("Password minimal 5 karakter"),
    check("konf_password").trim().notEmpty().withMessage("Konfirmasi Password tidak boleh kosong").isLength({ min: 5 }).withMessage("Konfirmasi password minimal 5 karakter").custom(valPasswordConf)
]

export const ruleToken = [
    check("token").notEmpty().withMessage("Token tidak ada"),
]