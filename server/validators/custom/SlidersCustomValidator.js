import { check } from "express-validator"
import Sliders from "../../models/backend/Slider.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"

export const validateDuplicate = (req,res,next) => {
    let { sliders } = req.body
    const uniqName = []    
    if(!sliders) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    sliders = sliders.map((e,i)=> {
        const image = (req.files && req.files.length > 0) ? req.files[i].filename : (req.method == "PUT") ? e.imageOld : "default.jpg"
        const title = e.title.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
        uniqName.push(title)

        const imageUrl = (req.files && req.files.length > 0) ? `${req.protocol}://${req.hostname}:8000/slider/${req.files[i].filename}` : (req.method == "PUT") ? e.imageUrlOld : "http://localhost:8000/slider/default.jpg"        
        return { ...e, title, image, imageUrl }
    })
    const uniqErr = []
    sliders.filter((e,i)=> {
        if(uniqName.indexOf(e.title) != i) uniqErr.push({
            "value": e.title,
            "msg": `Slider ( ${ e.title } ) sudah digunakan`,
            "param": `sliders[${i}].title`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.sliders = sliders
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { sliders } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    sliders = await Promise.all(sliders.map(async (e,i)=>{
        const nameInDb = await Sliders.findOne({ where: { title: e.title }, paranoid: false })
        if(nameInDb && nameInDb.id != e.sliders_id) namelErr.push({
            "value": e.title,
            "msg": `Slider (${ e.title }) sudah digunakan`,
            "param": `sliders[${i}].title`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.sliders = sliders

    next()   
}


export const rule = [
    check("sliders.*.title").trim().notEmpty().withMessage("Title tidak boleh kosong").custom( async (title,{ req }) => {
        const inDb = await Sliders.findOne({ where: { title: title }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`Slider ${ title } sudah di gunakan`)
            return
        }
    }),
    check("sliders.*.desk").trim().notEmpty().withMessage("Deskripsi tidak boleh kosong"),
]