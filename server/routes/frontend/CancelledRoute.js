import express from "express"
import { findAll, findOne } from "../../controllers/frontend/CancelledController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleAcc, validateDuplicate, validateUpdate } from "../../validators/custom/ShopsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()


routes.route("/cancelled-orders/:username")
.get(findAll)
routes.route("/cancelled-orders/:username/:produkid")
.get(findOne)

routes.route("/rate-it/:username/contact-the-seller")
.post(VerifyToken, fileUploads("contacts_selers","","").any())

export default routes