import { 
    register as registerService,
    login as loginService,
    logout as logoutService,
    forgotPassword as forgotPasswordService,
    newPassword as newPasswordService,
    verifyEmail as verifyEmailService,
} 
from "../service/AuthService.js"
import { CreateResponse } from "../utils/CreateResponse.js"

export const login = async (req,res,next) => {
    try {
        const response = await loginService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res,next) => {
    try {
        const response = await registerService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req,res,next) => {
    try {
        const response = await logoutService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}

export const forgotPassword = async (req,res,next) => {
    try {
        const response = await forgotPasswordService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}

export const newPassword = async (req,res,next) => {
    try {
        const response = await newPasswordService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req,res,next) => {
    try {
        const response = await verifyEmailService(req,res)
        CreateResponse(res,response)
    } catch (error) {
        next(error)
    }
}