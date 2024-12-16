import {
    findAll as findAllService,
    findOne as findOneService,
    store as storeService,
    destroy as destroyService,
    cancel as cancelService,
    quantity as quantityService,
    checkout as checkoutService,
    accepted as acceptedService,
    storeOrdersMessages as storeOrdersMessagesService,
    findAllOrdersMessages as findAllOrdersMessagesService,
} from "../../service/frontend/OrdersService.js"
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


export const store = async (req,res,next) => {
    try {
        const response = await storeService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const checkout = async (req,res,next) => {
    try {
        const response = await checkoutService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const destroy = async (req,res,next) => {
    try {
        const response = await destroyService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const quantity = async (req,res,next) => {
    try {
        const response = await quantityService(req)
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

export const accepted = async (req,res,next) => {
    try {
        const response = await acceptedService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const findAllOrdersMessages = async (req,res,next) => {
    try {
        const response = await findAllOrdersMessagesService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const storeOrdersMessages = async (req,res,next) => {
    try {
        const response = await storeOrdersMessagesService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}