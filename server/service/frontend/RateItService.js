import { Op } from "sequelize"
import { ImageProducts, Orders, OrdersItem, Payments, Products, Rating, Roles, User_Role, Users, UsersDetails } from "../../models/Index.js"
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
        status: "selesai",
        deletedAt: {
            [Op.is]: null
        }
        } }
        : { where: {
        UserId: users.id,
        status: "selesai",
        deletedAt: {
            [Op.not]: null
        }
    } }

    const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
    const orders = await Orders.findAll({...where,include: [{ model: Products, include: ImageProducts },{ model: Users,attributes:{exclude:["password","token","resetToken","resetTokenExp"]}, include:[{ model: UsersDetails }]}], paranoid ,limit, offset, order: [["id","DESC"]]})   
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
    ? { where: { [Op.and]: { id: produkid, status: "selesai", deletedAt: { [Op.is]: null} }  } }
    : { where: { [Op.and]: { id: produkid, status: "selesai",eletedAt: { [Op.not]: null} }  } }

    const orders = await Orders.findOne({...where,include: [{ model: Products, include: [ImageProducts], },{model: Payments},{ model: Users,include:[UsersDetails] }], paranoid })   
    if(!orders) throw CreateErrorMessage("Tidak ada data",404)
    return { 
        status:  200,
        message: "", 
        response: { orders } 
    }

}

export const storeRating = async req => {
    const { products } = req.body
    const response =  await Promise.all(Object.values(products).map(async e=> {
        e.rating = e.ratings
        e.review = e.reviews
        e.OrdersItemId = e.OrderItemId
        const re = await sequelize.transaction(async t => {     
            const res = await Rating.create(e,{ fields:["rating", "review", "OrdersItemId","username","fullname","image"] })
            await Products.update({ rating: e.rating },{ where: { id: e.ProductId} })
            return res
        })
        return re
    }))
    return { 
        status:  200,
        message: "Penilaian berhasil di kirim", 
        response: { response } 
    }
}

export const findOrderRating = async (req) => {
    const { orderid } = req.params
    const orders = await Orders.findOne({ where: { id: orderid }, attributes:["id"], include:[{ model: Products, attributes:["id"], through: {
        attributes: ["id"]
    } }] })
    if(!orders) throw CreateErrorMessage("Tidak ada data",404)
    const r = orders.Products.map(e=>e.OrdersItems.id)
    const ratings = await OrdersItem.findAll({ where: { id: r }, attributes:["id","ProductId"],include: [Rating] })
    return { 
        status:  200,
        message: "", 
        response: { ratings } 
    }
}