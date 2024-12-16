import { Op } from "sequelize"
import Users from "../../models/backend/Users.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { existsSync, unlink } from "node:fs"
import { Diskon, ImageProducts, Orders, OrdersItem, Payments, Products, UsersDetails } from "../../models/Index.js"
import Categories from "../../models/backend/Categories.js"
import env from "dotenv"
import midtransClient from "midtrans-client"
import { console } from "node:inspector"
import sequelize from "../../config/Database.js"
import nodemailer from "nodemailer"
import { sendEmailsAfterSuccessTransaction } from "./SendEmailService.js"
import { response } from "express"
//============================// 


env.config()

export const findAll = async (req) => {
  console.log({ bodu: req.query.product});
  
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10
  let productId = req.query.product.split(",")

  productId =  productId.map(e=> parseInt(e))
  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true
  const where = { where: {
    [Op.in]: { id: [1] },
    deletedAt: {
      [Op.is]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const products = await Products.findAll({ where: { id: { [Op.in]: productId } }, include:[{ model: ImageProducts, },{ model: Diskon },{ model: Categories }],paranoid ,limit, offset, order: [["id","DESC"],[ImageProducts,"id","ASC"]]})   
  const totals = await Products.count(whereCount)

  const totalsCount = (search == "") ? totals : products.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = products.length
  
  return { 
    status:  200,
    message: "", 
    response: { products, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { slug } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { slug: slug, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { slug: slug, deletedAt: { [Op.not]: null} }  } }

  const products = await Products.findOne({...where, include: [{ model: ImageProducts },{ model: Diskon },{ model: Categories },{ model: Users}], paranoid})
  if(!products) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { products } 
  }

}

export const store = async (req) => {
  let { shopsorders } = req.body
  const idOrders = await Orders.bulkCreate(shopsorders,{ updateOnDuplicate: ["status"] })
  const transaction = []
  return { 
    status:  201,
    message: `Transaksi berhasil`, 
    response: { transaction  } 
  }
}

export const createTransaction = async req => {
  const { orders } = req.body
  const snap = new midtransClient.Snap({
      isProduction : false,
      serverKey : process.env.SERVER_KEY,
      clientKey : process.env.CLIENT_KEY 
  })
  const transaction = await snap.createTransaction({ ...orders })
  console.log({ transaction });
  
  const transactionToken = transaction.token
  return {
    status: 200,
    message: "",
    response: { transactionToken, transaction }
  }
}

export const notificationTransaction = async (req,res)=> {
  const snap = new midtransClient.Snap({
      isProduction : false,
      serverKey : process.env.SERVER_KEY,
      clientKey : process.env.CLIENT_KEY 
  })
  const response = await snap.transaction.notification(req.body)
  const orderId = response.order_id
  
  const transactionStatus = response.transaction_status
  const transactionId = response.transaction_id
  const transactionTime = response.transaction_time
  try {
    if (transactionStatus === 'settlement') await updateDataTransactions(transactionStatus, transactionId, transactionTime)
    if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') await updateDataTransactions(transactionStatus == "expire" ? "cancel": transactionStatus, transactionId, transactionTime) 
    return { 
      status:  200,
      message: `Success`, 
      response: "" 
    }
  } catch (error) {
    console.log({error })
    throw CreateErrorMessage(error.message,500)
  }
}

const updateDataTransactions = async (status, transactionId, transactionTime) => {
  await sequelize.transaction(async (transaction) => {
    const order = await Orders.findOne({ where: { transactionId }, transaction })
    if (order) {
      await order.update({ status }, { transaction })
      await Payments.update({ status: status, payment_date: transactionTime  },{ where: { transactionId  }, transaction })
    } else {
      await Orders.create({ transactionId, status }, { transaction })
      await Payments.create({ transactionId, status, payment_date: transactionTime }, { transaction })
    }
  })
  
//  return await sequelize.transaction(async (transaction) => {
//   await Orders.upsert()
//     await Orders.upsert(
//       { transactionId, status }, 
//       { transaction }
//     )

//     await Payments.upsert(
//       { transactionId, status, payment_date: transactionTime },
//       { transaction }
//     )
//   })
  
//  return await sequelize.transaction(async transaction => {
//     await Orders.update({ status: status }, { where: { transactionId }, transaction })
//     await Payments.update({ status: status, payment_date: transactionTime  },{ where: { transactionId  }, transaction })
//   })
}


export const destroy = async req =>  {
  const { username } = req.params
  const { orderid  } = req.body
  const orders = (await Orders.findAll({ where: { id: orderid }, include:[{ model: Users, where: { username: username }}], attributes: ["id"] })).filter(e=> e != null)
  if(orders.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Orders.destroy({ where: { id: orderid },force: true })
  return { 
    status:  200,
    message: `${ orders.length } Data berhasil di hapus`, 
    response: { orders  } 
  }
}

export const storePayment = async req => {
  const { order_id, gross_amount,transaction_time, payment_type, transaction_status } = req.body

  try {
    const pembayaran = await sequelize.transaction(async transaction => {
      await Orders.update({ status: "Dikemas" }, { where: { transactionId: order_id }, transaction })
  
      const pembayaran = await Payments.create({  
        amount: gross_amount,
        bill_amount: gross_amount,
        payment_date: transaction_time,
        status: transaction_status == 'capture' || transaction_status == 'settlement' ? "Paid" : "Failed" ,
        payment_method: payment_type,
        transactionId: order_id
      },{ transaction })
      return pembayaran
    })
  
    return {
      status: 200,
      message: "Berhasil",
      response: { pembayaran }
    }
  } catch (error) {
    console.log({error })
    throw CreateErrorMessage(error.message,404)
  }
} 

export const storePaymentPending = async req =>  {
  const { order_id, payment_type, payment_data } = req.body
  const snap = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : process.env.SERVER_KEY,
    clientKey : process.env.CLIENT_KEY,
  })


  try {
    const status = await snap.transaction.status(order_id)
    if (status.transaction_status !== 'pending') throw CreateErrorMessage("Transaksi tidak dalam status pending.",400)
console.log({ status });

    const paymentRequest = {
      "payment_type": "bank_transfer",
  "bank_transfer": {
    "bank": "bri"
  },
  "transaction_details": {
    "order_id": "0cc9126f-0414-49d4-bb8e-69715f18ddbc",
    "gross_amount": 8.000
  },
    }

    const paymentResponse = await snap.charge(paymentRequest)
    return {
      status: 200,
      message: "Pembayaran berhasil diproses.",
      response: { paymentRequest }
    }
  } catch (error) {
    console.error('Error saat membayar transaksi:', error)
    throw CreateErrorMessage(error.message,500)
  }
}


export const cancelTransactions = async req => {
  const { transactionId } = req.body
  const snap = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : process.env.SERVER_KEY,
    clientKey : process.env.CLIENT_KEY,
  })

  try {
    const response = await snap.transaction.cancel(transactionId)
    return { 
      status:  200,
      message: `Pesanan berhasil dicancel`, 
      response: {  response }
    }
  } catch (error) {
    throw CreateErrorMessage("Error, Transaksi expired.", 412)
  }
}

export const storeOrdersDetails = async req => {
  const { orders } = req.body
  try {
    
    const response = await sequelize.transaction(async t => {
      orders[0].status = orders[0].transaction_status
      orders[0].total_price = orders[0].gross_amount
      orders[0].transactionId = orders[0].transaction_id

      const order = await Orders.findOne({ where: { transactionId: orders[0].transactionId }, transaction: t })
      if(order){
        orders[0].OrderId = order.id
        // // e.role = [1,2,3]
        await order.update(orders[0],{ fields:["total_price","status","UserId","kurir","ongkir"],  transaction: t})
        orders[0].orders_item = orders[0].orders_item.map((item=> ({ ...item,OrderId: order.id }))).filter(e=> e.ProductId  != "ongkir")
        await OrdersItem.bulkCreate(orders[0].orders_item,{ fields:["quantity","price","OrderId","ProductId"], transaction: t})
        await Payments.update({  
          amount: orders[0].gross_amount,
          bill_amount: orders[0].gross_amount,
          payment_date: orders[0].transaction_time,
          va_numbers: orders[0].va_numbers,
          status: orders[0].transaction_status,
          payment_method: orders[0].payment_type,
          transactionId: orders[0].transactionId
        },{ where: { transactionId: orders[0].transactionId },transaction: t })
      }
      return order.id
    })
    // const transaction = await Orders.findAll({ where: { transactionId:  response }, include:[{ model: Users, include:[{ model: UsersDetails }] },{ model: Products, through:{ model: OrdersItem } }] })
    return { 
      status:  201,
      message: `Order berhasil`, 
      response: { response } 
    } 
  } catch (error) {
    console.log(error)
    
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}

export const chargeTransaction = async req => {
  const snap = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : process.env.SERVER_KEY,
    clientKey : process.env.CLIENT_KEY,
  })

  try {
    const response = await snap.charge(req.body)
    return { 
      status:  200,
      message: ``, 
      response: {  response }
    }
  } catch (error) {
    console.log(error)
    
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}