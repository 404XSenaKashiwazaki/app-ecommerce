import express from "express"
import { findAll } from "../../controllers/frontend/PackagedController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule } from "../../validators/custom/SendEmailCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import { sendEmails } from "../../controllers/backend/SendEmailController.js"

const routes = express.Router()


routes.route("/sendemails")
.post(VerifyToken,fileUploads("sendemails","","").any(),sendEmails)


export default routes