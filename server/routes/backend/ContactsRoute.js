import express from "express"
import { destroy, findAll, findOne, restore, update } from "../../controllers/backend/ContactsController.js"
import { validate } from "../../validators/Validator.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule } from "../../validators/custom/ContactsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/contacts")
.get(findAll)

routes.route("/contacts/:id")
.get(findOne)

routes.route("/contacts/tanggapan/:id/add")
.put(fileUploads("contacts","username","./").any(),validate(rule),update)

routes.route("/contacts/destroy")
.delete(destroy)

routes.route("/contacts/restore")
.put(restore)

export default routes