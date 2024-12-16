import {
    findAll as findAllService,
    findOne as findOneService,
    createTransaction as createTransactionService,
    notificationTransaction as notificationTransactionService,
    destroy as destroyService,
    storePayment as storePaymentService,
    storePaymentPending as storePaymentPendingService,
    cancelTransactions as cancelTransactionsService,
    storeOrdersDetails as storeOrdersDetailsService,
    chargeTransaction as chargeTransactionService,
} from "../../service/backend/ShoppingCartsService.js"
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

export const createTransaction = async (req,res,next) => {
    try {
        const response = await createTransactionService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const notificationTransaction = async (req,res,next) => {
    try {
        const response = await notificationTransactionService(req)
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


export const storePayment = async (req,res,next) => {
    try {
        const response = await storePaymentService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const storePaymentPending = async (req,res,next) => {
    try {
        const response = await storePaymentPendingService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const cancelPayment = async (req,res,next) => {
    try {
        const response = await storePaymentService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const cancelTransactions = async (req,res,next) => {
    try {
        const response = await cancelTransactionsService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

export const storeOrdersDetails = async (req,res,next) => {
    try {
        const response = await storeOrdersDetailsService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}


export const chargeTransaction = async (req,res,next) => {
    try {
        const response = await chargeTransactionService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}



