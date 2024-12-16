import express from "express"
import { check } from "express-validator"
import { forgotPassword, login, logout, newPassword, register, verifyEmail } from "../controllers/AuthController.js"
import { VerifyToken } from "../middleware/VerifyToken.js"
import { ruleForgotPassword, ruleLogin, ruleNewPassword, ruleRegister, ruleToken } from "../validators/AuthValidators.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"

const routes = express.Router()


routes.post("/auth/login",validate(ruleLogin),login)
routes.post("/auth/register", validate(ruleRegister) , register)
routes.delete("/auth/logout",VerifyToken,logout)

routes.post("/auth/forgot-password",fileUploads("email","email","").any(),validate(ruleForgotPassword),forgotPassword)
routes.post("/auth/new-password",fileUploads("password","password","").any(),validate(ruleNewPassword),newPassword)
routes.post("/auth/verify-email",fileUploads("token","token","").any(),validate(ruleToken),verifyEmail)

export default routes