import { check } from "express-validator";

export const rule = [
    check("orders").isObject().withMessage("Data transaksi tidak valid"),
    check("orders.transaction_details").isObject().withMessage("Transaksi tidak boleh kosong"),
    check("orders.transaction_details.order_id").notEmpty().withMessage("Transaksi order id tidak boleh kosong"),
    check("orders.transaction_details.gross_amount").trim().notEmpty().withMessage("Transaksi total bayar tidak boleh kosong"),
    check("orders.customer_details").isObject().withMessage("Customer detail tidak valid"),
    check("orders.customer_details.first_name").trim().notEmpty().withMessage("Nama depan customer tidak boleh kosong"),
    check("orders.customer_details.last_name").trim().notEmpty().withMessage("Nama belakang customer tidak boleh kosong"),
    check("orders.customer_details.email").trim().notEmpty().withMessage("Email customer tidak boleh kosong"),
    check("orders.customer_details.phone").trim().notEmpty().withMessage("No Hp depan customer tidak boleh kosong"),
    check("orders.customer_details.billing_address").isObject().withMessage("Customer detail pembayaran tidak valid"),
    check("orders.customer_details.billing_address.first_name").trim().notEmpty().withMessage("Customer detail pembayaran nama depan tidak boleh kosong"),
    check("orders.customer_details.shipping_address").isObject().withMessage("Customer detail pengiriman tidak valid"),
    check("orders.customer_details.shipping_address.first_name").trim().notEmpty().withMessage("Customer detail pengiriman nama depan tidak boleh kosong"),
]