import express from "express"
import axios from "axios"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import env from "dotenv"
import { CreateResponse } from "../../utils/CreateResponse.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"


env.config()
const routes = express.Router()

routes.route("/ongkir/get-provinces").get(VerifyToken,async (req,res) => {
    try {
        const { data } = await axios.get(`${process.env.ONGKIR_URL}/province`,{
            headers: { key: process.env.ONGKIR_KEY },
        })
        CreateResponse(res,{ status: 200,message: "", response: { ...data.rajaongkir} })
    } catch (error) {
        
    }
})

routes.route("/ongkir/get-city/:provid").get(VerifyToken,async (req,res) => {
    try {
        const {  provid } = req.params
        const { data } = await axios.get(`${process.env.ONGKIR_URL}/city`,{
            headers: { key: process.env.ONGKIR_KEY },
            params: { province: provid }
        })
        CreateResponse(res,{ status: 200,message: "", response: { ...data.rajaongkir} })
    } catch (error) {
        
    }
})

routes.route("/ongkir/calculate-shipping-cost").post(VerifyToken,fileUploads("destination","","").any(),async (req,res) => {
    try {
        const {  destination, weight, courier } = req.body
        const { data } = await axios.post(`${process.env.ONGKIR_URL}/cost`,{
            origin: 211, // 252 majalengka
            destination: destination,
            weight: weight, 
            courier: courier, 
        },{ headers: { key: process.env.ONGKIR_KEY, "Content-Type": 'application/x-www-form-urlencoded' }})
        CreateResponse(res,{ status: 200,message: "", response: { ...data.rajaongkir } })
    } catch (error) {
        
    }
})



export default routes