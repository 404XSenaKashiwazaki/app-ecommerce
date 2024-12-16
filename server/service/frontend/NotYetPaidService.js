import { Op, Sequelize } from "sequelize"
import { ImageProducts, Orders, Payments, Products, Users, UsersDetails } from "../../models/Index.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import sequelize from "../../config/Database.js"
//============================// 


export const findAll = async (req) => {
    const search = req.query.search || ""
    const username = req.params.username || ""
    const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
    const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

    const offset = page > 1 ? (page * limit) - limit : 0
    const paranoid = req.query.type == "restore" ? false : true
    const users = await Users.findOne({ where: { username }, paranoid: false })  
    
    if(!users) throw CreateErrorMessage("Tidak ada data",404)
    const whereCount = { where: {  status: "pending", deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}

    const results = await Payments.findAll({ where: { 
        [Op.or]: {
            amount: { [Op.like]: `%${search}%` },
        },
        status: "pending",
        deletedAt: { [(paranoid) ? Op.is : Op.not]: null }
    },include:[{ model: Orders, where: { UserId: users.id },include: [{ model: Users,  attributes:["username","namaDepan","namaBelakang","email"]},{ model: Products,include:[{ model: ImageProducts }] }]}],paranoid,limit, offset,order: [["id","DESC"]]})   
    const totals = await Payments.count(whereCount)
    const totalsCount = (search == "") ? totals : results.length
    const totalsPage = Math.ceil(totalsCount / limit)
    const totalsFilters = results.length
    
    return { 
        status:  200,
        message: "", 
        response: { orders: results, page, offset, limit,totalsPage,totals, totalsFilters } 
    }
}

export const findOne = async (req) => {
    const { produkid } = req.params
    const paranoid = req.query.type == "restore" ? false : true
    const where = paranoid 
    ? { where: { [Op.and]: { transactionId: produkid, status: "pending", deletedAt: { [Op.is]: null} }  } }
    : { where: { [Op.and]: { transactionId: produkid, status: "pending",eletedAt: { [Op.not]: null} }  } }

    const orders = await Payments.findOne({...where, include:[{ model: Orders, include: [{ model: Users, attributes:["username","namaDepan","email","namaBelakang"], include: [UsersDetails]},{ model: Products, include:[{ model: ImageProducts }] }]}], paranoid })
    if(!orders) throw CreateErrorMessage("Tidak ada data",404)
    return { 
        status:  200,
        message: "", 
        response: { orders } 
    }

}