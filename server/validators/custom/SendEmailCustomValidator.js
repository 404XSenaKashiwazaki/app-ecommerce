import { check } from "express-validator";


export const rule = [
    check("sendemails").isObject().withMessage("Data tidak valid"),
    check("sendemails.email").notEmpty().withMessage("Email tidak boleh kosong"),
    check("sendemails.username").notEmpty().withMessage("Username tidak boleh kosong"),
    check("sendemails.fullname").notEmpty().withMessage("Fullname tidak boleh kosong"),
    check("sendemails.item_details").isArray().withMessage("Items details tidak valid"),
    check("sendemails.item_details.*.nama_produk").notEmpty().withMessage("Produk tidak boleh kosong"),
    check("sendemails.item_details.*.harga_produk").notEmpty().withMessage("Harga Produk tidak boleh kosong"),
    check("sendemails.item_details.*.jumlah").notEmpty().withMessage("Jumlah Produk tidak boleh kosong"),
    check("sendemails.item_details.*.total").notEmpty().withMessage("Total Bayar tidak boleh kosong")
]