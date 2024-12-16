import {
    findAll as findAllService,
    findOne as findOneService,
    storeRating as storeRatingService,
    findOrderRating as findOrderRatingService,
} from "../../service/frontend/RateItService.js"
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

export const storeRating = async (req,res,next) => {
    try {
        const response = await storeRatingService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const findOrderRating = async (req,res,next) => {
    try {
        const response = await findOrderRatingService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


