import {
    findAll as findAllService,
    cancel as cancelService,
    findOne as findOneService,
} from "../../service/frontend/PackagedService.js"
import { CreateResponse } from "../../utils/CreateResponse.js"

export const findAll = async (req,res,next) => {
    try {
        const response = await findAllService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const findOne = async (req,res,next) => {
    try {
        const response = await findOneService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const cancel = async (req,res,next) => {
    try {
        const response = await cancelService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}
