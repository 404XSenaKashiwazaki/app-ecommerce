import { Op } from "sequelize"
import Contact from "../../models/backend/Contact.js"
import Users from "../../models/backend/Users.js"
import UsersDetail from "../../models/backend/UsersDetails.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { ContactOrders, Orders, UsersDetails  } from "../../models/Index.js"
//============================// 

export const findAll = async (req) => {
  const { transactionid } = req.params
  const contacts = await ContactOrders.findAll({ where: { transactionId: transactionid }, include:[{model: Orders, include:[{model: Users,include:[UsersDetails]}]}]})   
  return { 
    status: 200,
    message: "", 
    response: { contacts } 
  }
}


export const store = async (req) => {
  const { contacts } = req.body
  const response = await ContactOrders.create(contacts,{ fields:["email","username","content","transactionId","profileUrl"] })

    return { 
    status:  201,
    message: `Pesan berhasil dikirim`, 
    response: { response } 
  }
}
