import express from "express"
import { acceptedTransaction, findAll, findOne} from "../../controllers/frontend/ShippingController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleAcc, validateDuplicate, validateUpdate } from "../../validators/custom/ShopsCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()


routes.route("/shipping/:username")
.get(findAll)

routes.route("/shipping/:username/:produkid")
.get(findOne)

routes.route("/shipping/:username/contact-the-seller")
.post(VerifyToken, fileUploads("contacts_selers","","").any())


routes.route("/shipping/:username/accepted-transaction")
.put(VerifyToken, fileUploads("transactionId","","").any(), acceptedTransaction)

export default routes