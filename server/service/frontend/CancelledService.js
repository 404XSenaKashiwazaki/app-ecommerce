import { Op } from "sequelize"
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
    const where = (paranoid) 
    ? { where: {
        UserId: users.id,
        status: {
            [Op.or]: ["cancel","expired"]
        },
        deletedAt: {
            [Op.is]: null
        }
        } }
        : { where: {
        UserId: users.id,
        status: {
            [Op.or]: ["cancel","expired"]
        },
        deletedAt: {
            [Op.not]: null
        }
    } }

    const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
    const orders = await Orders.findAll({...where,include: [{ model: Products, include:[{ model: ImageProducts }] },{ model: Users }], paranoid ,limit, offset, order: [["id","DESC"]]})   
    const totals = await Orders.count(whereCount)

    const totalsCount = (search == "") ? totals : orders.length
    const totalsPage = Math.ceil(totalsCount / limit)
    const totalsFilters = orders.length
    
    return { 
        status:  200,
        message: "", 
        response: { orders, page, offset, limit,totalsPage,totals, totalsFilters } 
    }
}

export const findOne = async (req) => {
    const { produkid } = req.params
    const paranoid = req.query.type == "restore" ? false : true
    const where = paranoid 
    ? { where: { [Op.and]: { id: produkid, status: "cancel", deletedAt: { [Op.is]: null} }  } }
    : { where: { [Op.and]: { id: produkid, status: "cancel",eletedAt: { [Op.not]: null} }  } }

    const orders = await Orders.findOne({...where,include: [{ model: Products, include: ImageProducts },{model: Payments},{ model: Users,include:[UsersDetails] }], paranoid })   
    if(!orders) throw CreateErrorMessage("Tidak ada data",404)
    return { 
        status:  200,
        message: "", 
        response: { orders } 
    }

}