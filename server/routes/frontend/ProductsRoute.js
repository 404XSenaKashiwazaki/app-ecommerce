import express from "express"
import { destroy, findAll, findAllPopular, findOne, restore, store, update } from "../../controllers/frontend/ProductsController.js"
import { validate } from "../../validators/Validator.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule } from "../../validators/custom/ReservationsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/front/products")
.get(findAll)

routes.route("/front/products/:slug")
.get(findOne)


routes.route("/front/popular/products")
.get(findAllPopular)

export default routes