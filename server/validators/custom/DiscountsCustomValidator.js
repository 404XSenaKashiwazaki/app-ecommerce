import { check } from "express-validator"
import Roles from "../../models/backend/Roles.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import Diskon from "../../models/backend/Diskon.js"

export const validateDuplicate = (req,res,next) => {
    let { discounts } = req.body
    const uniqName = []    
    if(discounts.length == 0) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    discounts = discounts.map((e,i)=> {
        const diskon = e.diskon.split(" ").map(t=> t.toUpperCase()).join(" ")
        uniqName.push(diskon)
        return { ...e, diskon }
    })
    const uniqErr = []
    discounts.filter((e,i)=> {
        if(uniqName.indexOf(e.diskon) != i) uniqErr.push({
            "value": e.diskon,
            "msg": `Diskon ( ${ e.diskon } ) sudah digunakan`,
            "param": `discounts[${i}].diskon`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.discounts = discounts
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { discounts } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    discounts = await Promise.all(discounts.map(async (e,i)=>{
        const nameInDb = await Diskon.findOne({ where: { diskon: e.diskon }, paranoid: false })
        if(nameInDb && nameInDb.id != e.discounts_id) namelErr.push({
            "value": e.diskon,
            "msg": `Diskon (${ e.diskon }) sudah digunakan`,
            "param": `discounts[${i}].diskon`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.discounts = discounts

    next()   
}


export const rule = [
    check("discounts.*.diskon").trim().notEmpty().withMessage("Diskon tidak boleh kosong").custom( async (name,{ req }) => {
        const inDb = await Diskon.findOne({ where: { diskon: name }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`Diskon ${ name } sudah di gunakan`)
            return
        }
    }),
    check("discounts.*.tanggal_mulai").trim().optional(),
    check("discounts.*.tanggal_berakhir").optional(),
    check("discounts.*.deskripsi").trim().notEmpty().withMessage("Deskripsi tidak boleh kosong"),
]