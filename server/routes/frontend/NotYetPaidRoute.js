import express from "express"
import { findAll, findOne } from "../../controllers/frontend/NotYetPaidController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleAcc, validateDuplicate, validateUpdate } from "../../validators/custom/ShopsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()


routes.route("/not-yet-paid/:username")
.get(findAll)

routes.route("/not-yet-paid/:username/:produkid")
.get(findOne)

routes.route("/not-yet-paid/confirm/:username/:produkid")
.get(findOne)

routes.route("/not-yet-paid/:username/contact-the-seller")
.post(VerifyToken, fileUploads("contacts_selers","","").any())

export default routes