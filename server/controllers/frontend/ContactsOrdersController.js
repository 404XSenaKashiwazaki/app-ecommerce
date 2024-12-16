import {
    findAll as findAllService,
    store as storeService,
} from "../../service/frontend/ContactsOrdersService.js"
import { CreateResponse } from "../../utils/CreateResponse.js"

export const findAll = async (req,res,next) => {
    try {
        const response = await findAllService(req)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}



export const store = async (req,res,next) => {
    try {
        const response = await storeService(req)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}
