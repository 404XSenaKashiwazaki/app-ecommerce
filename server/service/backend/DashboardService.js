import { Op } from "sequelize"
import Shops from "../../models/backend/Shops.js"
import Users from "../../models/backend/Users.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { existsSync, unlink } from "node:fs"
import { Diskon, ImageProducts, Orders, OrdersItem, Payments, Products, Roles, UsersDetails } from "../../models/Index.js"
import sequelize from "../../config/Database.js"
//============================// 

export const countAllInfo= async (req) => {
  const usersCount = await Users.count({ paranoid: true, include:[{model:Roles, where: { name: {
    [Op.not]: "ADMIN"
  } }}] })
  const productsCount = await Products.count({ paranoid: true })
  const transactionsCount = await Payments.count({ paranoid: true })
  const incomesCount = await Payments.sum("amount",{ where: { status: "settlement" } })
  const topSelingId = (await OrdersItem.findAll({ attributes: [
        "ProductId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"]
      ], 
  group: ["ProductId"],
  order: [[sequelize.literal("totalQuantity"), 'DESC']]})).map(e=> e.ProductId)
  const topSelling = await Products.findAll({ where: { id: topSelingId }, limit:5, include:[ImageProducts,Diskon,Orders]})

  return { 
    status:  200,
    message: "", 
    response: { usersCount, productsCount, incomesCount, transactionsCount, topSelling } 
  }

}

export const findAll = async (req) => {
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const orders = await Orders.findAll({ include: [{ model: Users, required: false, attributes: { exclude:["password","token"] }}, { model: Products, required: false}],paranoid,limit, offset,order: [["id","DESC"]], where: {
    [Op.or]: {
      "$User.username$": { [Op.like]: `%${search}%` },
      "$Products.nama_produk$": { [Op.like]: `%${search}%` },
      "total_price": { [Op.like]: `%${search}%` },
    },
    deletedAt: { [(paranoid) ? Op.is : Op.not]: null }
  }, duplicating: false,
  subQuery: false})   
  const totals = await Orders.count(whereCount)

  const totalsCount = (search == "") ? totals : orders.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = orders.length
  console.log({ search });
  
  return { 
    status:  200,
    message: "", 
    response: { orders, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const orders = await Orders.findOne({...where,include:[{ model: Users,attributes: {exclude: ["password","token"]}, include:[UsersDetails] },{ model: Products, include:[ImageProducts] }], paranoid})
  if(!orders) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { orders } 
  }

}
export const store = async (req) => {
  let { shopsorders } = req.body
  shopsorders = await Orders.bulkCreate(shopsorders,{ updateOnDuplicate: ["status"] })
  return { 
    status:  201,
    message: `${shopsorders.length} Data berhasil di simpan`, 
    response: { shopsorders  } 
  }
}


export const update = async req =>  {
  const { orders } = req.body
  try {
    const order = await Orders.findOne({ where: { id: orders[0].orderId } })
    if(!order) throw CreateErrorMessage("Tidak ada data",404)
    await order.update({ status: orders[0].status })

    return { 
      status:  201,
      message: `Status orders berhasil di update`, 
      response: {  orders: order  } 
    } 
  } catch (error) {
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}

export const destroy = async req => {
  const { id } = req.body
  const force = req.query.permanent == "true" ? true : false
  // const orders = []
  const orders = await Orders.findOne({ where: { id }, paranoid: false})
  if(!orders) throw CreateErrorMessage("Tidak ada data",404)

  await orders.destroy({ force })
  
  return { 
    status:  200,
    message: `Order berhasil di hapus`, 
    response: { orders  } 
  }
}

export const restore = async req => {
  const { id } = req.body
  // const orders = []
  const orders = await Orders.findOne({ where: { id }, paranoid: false})
  if(!orders) throw CreateErrorMessage("Tidak ada data",404)

  await orders.restore()
  
  return { 
    status:  200,
    message: `Order berhasil di restore`, 
    response: { orders  } 
  }
}