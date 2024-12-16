import express from "express"
import { acc, destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/ShopsController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleAcc, validateDuplicate, validateUpdate } from "../../validators/custom/ShopsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/shops")
.get(findAll)

routes.route("/shops/:id")
.get(findOne)

routes.route("/shops/add")
.post(fileUploads("shops","logo","./public/shops").any(),validate(rule),validateDuplicate,store)
routes.route("/shops/update")
.put(fileUploads("shops","logo","./public/shops").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/shops/acc")
.put(fileUploads("shops","logo","./public/shops").any(),validate(ruleAcc),acc)

routes.route("/shops/destroy")
.delete(destroy)

routes.route("/shops/restore")
.put(restore)

export default routes