import express from "express"
import {  } from "express-validator"
import { callback } from "../controllers/GoogleAuthController.js"
import { VerifyToken } from "../middleware/VerifyToken.js"
import { ruleLogin, ruleRegister } from "../validators/AuthValidators.js"
import { validate } from "../validators/Validator.js"
import passport from "passport"

const routes = express.Router()

routes.get("/auth/google",passport.authenticate("google",{ scope: ["profile","email"] }))
routes.get("/auth/google/callback", passport.authenticate("google", { 
    failureRedirect: "http://localhost:5173/login", 
    // successRedirect: "http://localhost:5173/"
}),callback)

export default routes

