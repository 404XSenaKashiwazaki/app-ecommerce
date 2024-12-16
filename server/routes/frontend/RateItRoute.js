import express from "express"
import { findAll, findOne, findOrderRating, storeRating } from "../../controllers/frontend/RateItController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import { check } from "express-validator"

const routes = express.Router()

const rule = [
    check("products").isObject().withMessage("Rating tidak valid"),
    check("products.*.ratings").notEmpty().withMessage("Rating tidak boleh kosong"),
    check("products.*.reviews").notEmpty().withMessage("Review tidak boleh kosong")
]
routes.route("/finished-orders/:username")
.get(VerifyToken,findAll)

routes.route("/finished-orders/:username/:produkid")
.get(findOne)

routes.route("/finished-orders/rating/:username/:orderid")
.get(findOrderRating)

routes.route("/rate-it/:username/contact-the-seller")
.post(VerifyToken, fileUploads("contacts_selers","","").any())

routes.route("/finished-orders/:username/add-rating")
.post(VerifyToken, fileUploads("username","","").any(),validate(rule),storeRating)


export default routes