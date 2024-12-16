import express from "express"
import { destroy, findAll, findOne, restore, store } from "../../controllers/frontend/ContactsController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleStore } from "../../validators/custom/ContactsCustomValidator.js"

const routes = express.Router()

routes.route("/contacts/:username/all")
.get(findAll)

routes.route("/contacts/:username/add")
.post(fileUploads("useername","useername","").any(),validate(ruleStore),store)

routes.route("/contacts/:username/:contactid")
.get(findOne)

routes.route("/contacts/:username/:contactid/destroy")
.delete(destroy)

routes.route("/contacts/:username/:contactid/restore")
.put(restore)

export default routes