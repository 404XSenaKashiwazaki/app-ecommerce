import express from "express"
import { cancel, findAll, findOne } from "../../controllers/frontend/PackagedController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleAcc, validateDuplicate, validateUpdate } from "../../validators/custom/ShopsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()


routes.route("/packaged/:username")
.get(findAll)

routes.route("/packaged/:username/:produkid")
.get(findOne)


routes.route("/packaged/:username/cancel")
.delete(VerifyToken, cancel)

routes.route("/packaged/:username/contact-the-seller")
.post(VerifyToken, fileUploads("contacts_selers","","").any())

export default routes