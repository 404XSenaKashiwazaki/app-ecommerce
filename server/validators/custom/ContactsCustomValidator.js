import { check } from "express-validator"

export const rule = [
    check("ContactId").trim().notEmpty().withMessage("Contats tidak boleh kosong"),
    check("username").trim().notEmpty().withMessage("Username tidak boleh kosong"),
    check("email").trim().notEmpty().withMessage("Email tidak boleh kosong"),
    check("content").trim().notEmpty().withMessage("Pesan tidak boleh kosong"),
]


export const ruleStore = [
        check("username").trim().notEmpty().withMessage("Username tidak boleh kosong"),
        check("email").trim().notEmpty().withMessage("Email tidak boleh kosong"),
        check("content").trim().notEmpty().withMessage("Pesan tidak boleh kosong"),
    ]
    