import {
    findAll as findAllService,
    findOne as findOneService,
    acceptedTransaction as acceptedTransactionService,
} from "../../service/frontend/ShippingService.js"
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

export const acceptedTransaction = async (req,res,next) => {
    try {
        const response = await acceptedTransactionService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

