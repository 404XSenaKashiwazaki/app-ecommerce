import express from "express"
import { destroy, findAll, findOne, restore, showBanners, store, update } from "../../controllers/backend/SlidersController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../../validators/custom/SlidersCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/sliders")
.get(VerifyToken,findAll)

routes.route("/sliders-banners")
.get(showBanners)

routes.route("/sliders/:id")
.get(VerifyToken,findOne)

routes.route("/sliders/add")
.post(VerifyToken,fileUploads("sliders","image","./public/slider").any(),validate(rule),validateDuplicate,store)
routes.route("/sliders/update")
.put(VerifyToken,fileUploads("sliders","image","./public/slider").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/sliders/destroy")
.delete(VerifyToken,destroy)

routes.route("/sliders/restore")
.put(VerifyToken,restore)

export default routes