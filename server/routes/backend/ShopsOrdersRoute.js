import express from "express"
import { destroy, findAll, findAllMessage, findOne, restore, store, update } from "../../controllers/backend/ShopsOrdersController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { resiToUpper, rule, validateDuplicate } from "../../validators/custom/ShopsOrdersCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/orders")
.get(findAll)

routes.route("/orders/:id")
.get(findOne)

routes.route("/orders/update")
.put(fileUploads("orders","logo","").any(),resiToUpper,update)

routes.route("/orders/message/:transactionid")
.get(findAllMessage)

routes.route("/orders/message/:transactionid/add")
.put(fileUploads("orders","logo","").any(),store)

routes.route("/orders/restore")
.put(restore)

routes.route("/orders/destroy")
.delete(destroy)

export default routes