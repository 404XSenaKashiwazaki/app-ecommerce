import express from "express"
import { find, removeProfile, update, updatePassword } from "../controllers/ProfilesController.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"
import { afterValidate, rule, ruleUpdatePass} from "../validators/custom/ProfileCustomValidator.js"
import { VerifyToken } from "../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/profile/:username")
.get(VerifyToken,find)
.put(VerifyToken,fileUploads("profile","profile","./public/profile").any(),validate(rule),afterValidate,update)

routes.route("/profile/:username/update-password")
.put(VerifyToken,fileUploads("profile","profile","./public/profile").any(),validate(ruleUpdatePass),updatePassword)

routes.route("/profile/:username/remove-profile")
.put(VerifyToken,fileUploads("profile","profile","./public/profile").any(),removeProfile)

export default routes