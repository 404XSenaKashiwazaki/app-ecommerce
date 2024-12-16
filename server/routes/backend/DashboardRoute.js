import express from "express"
import { countAllInfo,  destroy, findAll, findOne, restore, store, update } from "../../controllers/backend/DashboardController.js"
import { validate } from "../../validators/Validator.js"
import upload, { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, validateDuplicate } from "../../validators/custom/ShopsOrdersCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/dashboards")
.get(countAllInfo)

routes.route("/orders/:id")
.get(findOne)

routes.route("/orders/update")
.put(fileUploads("orders","logo","").any(),update)


routes.route("/orders/restore")
.put(restore)

routes.route("/orders/destroy")
.delete(destroy)

export default routes