import express from "express"
import { findAll, store } from "../../controllers/frontend/ContactsOrdersController.js"
import { validate } from "../../validators/Validator.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule } from "../../validators/custom/ContactsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import { check } from "express-validator"

const routes = express.Router()

routes.route("/contact-orders/:transactionid")
.get(findAll)

routes.route("/contact-orders/add")
.post(fileUploads("contacts","username","./").any(),validate([check("contacts.content").trim().notEmpty().withMessage("Pesan tidak boleh kosong")]),store)

export default routes