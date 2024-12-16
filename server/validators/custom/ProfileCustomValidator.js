import { check } from "express-validator"
import Users from "../../models/backend/Users.js"


export const afterValidate = (req,res,next) => {

    const username = req.body.username.split(" ").map(t=> t.toLowerCase()).join("")
    const profile = (req.files && req.files.length > 0) ? req.files[0].filename : (req.method == "PUT") ? req.body.profileOld : "default.jpg"
    const profileUrl = (req.files && req.files.length > 0) ? `${req.protocol}://${req.hostname}:8000/profile/${req.files[0].filename}` : (req.method == "PUT") ? req.body.profileUrlOld : "http://localhost:8000/profile/default.jpg"        
   
    const namaDepan = req.body.namaDepan.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
    const namaBelakang = req.body.namaBelakang.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
    req.body.username = username
    req.body.profile = profile
    req.body.profileUrl = profileUrl
    
    req.body.namaDepan = namaDepan
    req.body.namaBelakang = namaBelakang
    
    next()
}

export const rule = [
    check("namaDepan").trim().notEmpty().withMessage("Nama Depan tidak boleh kosong"),
    check("namaBelakang").trim().notEmpty().withMessage("Nama Belakang tidak boleh kosong"),
    check("username").trim().notEmpty().withMessage("Username tidak boleh kosong").custom( async (username,{ req }) => {
        const inDb = await Users.findOne({ where: { username: username }  })
        if(req.method == "PUT"){
            if(inDb && inDb.id != req.body.id) throw new Error(`Username ${ username } sudah di gunakan`)
            return
        }
        if(req.method == "POST"){
            if(inDb) throw new Error(`Username ${ username } sudah di gunakan`)
            return
        }
        throw new Error("Data dari inputan users tidak valid",400)
    }),
    check("email").trim().notEmpty().withMessage("Email tidak boleh kosong").custom( async (email,{ req }) => {
        const inDb = await Users.findOne({ where: { email: email }  })
        if(req.method == "PUT"){
            if(inDb && inDb.id != req.body.id) throw new Error(`Email ${ email } sudah di gunakan`)
            return
        }
        if(req.method == "POST"){
            if(inDb) throw new Error(`Email ${ email } sudah di gunakan`)
            return
        }
        throw new Error("Data dari inputan email tidak valid",400)
    }),
]

export const ruleUpdatePass = [
    check("passwordOld").trim().custom( async (password, { req }) => {
        if(password && password.length > 16) throw new Error("Passsword maksimal 16 karakter")
        if(password && password.length < 5) throw new Error("Password minimal 5 karakter")
    }),
    check("password").trim().custom( async (password, { req }) => {
        if(password && password.length > 16) throw new Error("Passsword maksimal 16 karakter")
        if(password && password.length < 5) throw new Error("Password minimal 5 karakter")
    }),
    check("konfirmasiPassword").trim().custom( async (password, { req }) => {
        if(password && password.length > 16) throw new Error("Passsword maksimal 16 karakter")
        if(password && password.length < 5) throw new Error("Password minimal 5 karakter")
        if(password != req.body.password) throw new Error("Password dan Konfirmasi Password tidak sama")
    }),
]