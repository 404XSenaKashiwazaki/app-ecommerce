import { Op, Sequelize } from "sequelize"
import Shops from "../../models/backend/Shops.js"
import Users from "../../models/backend/Users.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { existsSync, unlink } from "node:fs"
import { ImageProducts, Orders,Payments, Products, UsersDetails } from "../../models/Index.js"
import sequelize from "../../config/Database.js"
//============================// 

export const findAll = async (req) => {
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true


  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}   
  const payments = await Payments.findAll({ where: { 
    [Op.or]: {
        "amount": { [Op.like]: `%${search}%` },
      },
    deletedAt: { [(paranoid) ? Op.is : Op.not]: null }
},include:[{ model: Orders, include: [{ model: Users, attributes:["username","namaDepan","namaBelakang"]},{ model: Products, include:[{ model: ImageProducts }] }]}],paranoid,limit, offset,order: [["id","DESC"]]})      
  const totals = await Payments.count(whereCount)
  const totalsCount = (search == "") ? totals : payments.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = payments.length

  
  return { 
    status:  200,
    message: "", 
    response: { payments, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const payments = await Payments.findOne({...where, include:[{ model: Orders, include: [{ model: Users, attributes:["username","namaDepan","email","namaBelakang"], include: [UsersDetails]},{ model: Products, include:[{ model: ImageProducts }] }]}], paranoid })
  if(!payments) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { payments } 
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
  const payments = await Payments.findOne({ where: { id }, paranoid: false})
  if(!payments) throw CreateErrorMessage("Tidak ada data",404)

  await payments.destroy({ force })
  
  return { 
    status:  200,
    message: `Payments berhasil di hapus`, 
    response: { payments  } 
  }
}

export const restore = async req => {
  const { id } = req.body
  // const orders = []
  const payments = await Payments.findOne({ where: { id }, paranoid: false})
  if(!payments) throw CreateErrorMessage("Tidak ada data",404)

  await payments.restore()
  
  return { 
    status:  200,
    message: `Payment berhasil di restore`, 
    response: { payments  } 
  }
}