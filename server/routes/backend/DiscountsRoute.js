import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/DiscountsController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../../validators/custom/DiscountsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/discounts")
.get(VerifyToken,findAll)

routes.route("/discounts/:id")
.get(VerifyToken,findOne)

routes.route("/discounts/add")
.post(fileUploads("discounts","profile","").any(),validate(rule),validateDuplicate,store)
routes.route("/discounts/update")
.put(VerifyToken,fileUploads("discounts","profile","").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/discounts/destroy")
.delete(VerifyToken,destroy)

routes.route("/discounts/restore")
.put(VerifyToken,restore)

export default routes