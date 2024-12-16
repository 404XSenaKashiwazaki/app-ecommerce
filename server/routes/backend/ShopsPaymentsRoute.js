import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/ShopsPaymentsController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate } from "../../validators/custom/ShopsOrdersCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/payments")
.get(findAll)

routes.route("/payments/:id")
.get(findOne)

routes.route("/payments/update")
.put(fileUploads("orders","logo","").any(),update)


routes.route("/payments/restore")
.put(restore)

routes.route("/payments/destroy")
.delete(destroy)

export default routes