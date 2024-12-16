import express from "express"
import { cancel, destroy, findAll, findOne, quantity, store, checkout, accepted, findAllOrdersMessages, storeOrdersMessages } from "../../controllers/frontend/OrdersController.js"
import { validate } from "../../validators/Validator.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { rule, ruleOders, validateDuplicate, validateItemProducts, ruleQuantity } from "../../validators/custom/OrdersCustomValidator.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import { validationResult } from "express-validator"

const routes = express.Router()

routes.route("/order/:username")
.get(findAll)

routes.route("/order/:username/:id")
.get(findOne)

routes.route("/order/:username/add")
.post(fileUploads("orders","orders","").any(),validate(ruleOders),validateItemProducts,store)

routes.route("shoppingcart/:username/:orderid/checkout")
.put(fileUploads("orders","orders","").any(),checkout)

routes.route("/shoppingcart/:username/:orderid/:productid/quantity/:type")
.put(quantity)

routes.route("/shoppingcart/:username/:orderid/accepted")
.put(accepted)

routes.route("/order/:username/:orderid/cancel") //type=cancel
.delete(cancel)

routes.route("/shoppingcart/:username/:orderid/destroy") //type=destoy
.delete(destroy)



export default routes