import express from "express"
import { cancelTransactions, chargeTransaction, createTransaction, destroy, findAll, findOne, notificationTransaction, storeOrdersDetails, storePayment, storePaymentPending} from "../../controllers/backend/ShoppingCartsController.js"
import { VerifyToken } from "../../middleware/VerifyToken.js"
import { fileUploads } from "../../middleware/ValidateUpload.js"
import { validate } from "../../validators/Validator.js"
import { rule } from "../../validators/custom/ShoppingCartsCustomValidator.js"

const routes = express.Router()

routes.route("/shopping-carts/:username")
.get(VerifyToken,findAll)

routes.route("/shopping-carts/:username/:id")
.get(VerifyToken,findOne)

routes.route("/shopping-carts/:username/create-transaction")
.post(VerifyToken,fileUploads("orders","transaction_details","").any(), validate(rule),createTransaction)

routes.route("/shopping-carts/:username/create-transaction-payment")
.post(VerifyToken,fileUploads("order_id","order_id","").any(), storePayment)

routes.route("/shopping-carts/:username/pay-payment-pending")
.post(fileUploads("order_id","order_id","").any(), storePaymentPending)

routes.route("/shopping-carts/:username/delete-transaction")
.delete(VerifyToken, destroy)

routes.route("/shopping-carts/:username/cancel-transaction")
.delete(cancelTransactions)


routes.route("/shopping-carts/transaction-notification")
.post(notificationTransaction)

routes.route("/shopping-carts/:username/store-orders-items")
.post(VerifyToken, fileUploads("order_id","order_id","").any(), storeOrdersDetails)


routes.route("/shopping-carts/:username/charge-transaction")
.post(chargeTransaction)

export default routes