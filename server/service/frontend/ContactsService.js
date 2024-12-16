import { Op } from "sequelize"
import Contacts from "../../models/backend/Contact.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import Contact from "../../models/backend/Contact.js"
import { Users, UsersDetails } from "../../models/Index.js"

//============================// 

export const findAll = async (req) => {
  const {  username } = req.params
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

  const offset = page > 1 ? (page * limit) - page : 0
  const paranoid = req.query.type == "restore" ? false : true
  const where = (paranoid) 
  ? { where: {
      username: username,
      deletedAt: {
      [Op.is]: null
      }
  } }
  : { where: {
      username: username,
      deletedAt: {
      [Op.not]: null
      }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const contacts = await Contacts.findAll({...where, include:[{ model: Contacts, include:[{ model: Users, include:[UsersDetails],attributes: { exclude: ["token","password","resetToken","resetTokenExp"] }}] },{ model: Users, include:[UsersDetails],attributes: { exclude: ["token","password","resetToken","resetTokenExp"] }}], paranoid ,limit, offset, order: [["id"],["id","DESC"]]})   
  const totals = contacts.length
  const totalsCount = (search == "") ? totals : contacts.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = contacts.length

  return { 
    status:  200,
    message: "", 
    response: { contacts, page, offset, totalsPage,totals, perPage: limit, totalsFilters} 
  }
}

export const findOne = async (req) => {
  const { userid,id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { UserId: userid, id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { UserId: userid, id, deletedAt: { [Op.not]: null} }  },paranoid}

  const contacts = await Contacts.findOne(where)
  return { 
    status:  200,
    message: "sas", 
    response: { contacts } 
  }

}
export const store = async (req) => {
  const contacts = await Contacts.create(req.body,{ fields:["email","username","content","UserId"] })
  return { 
    status:  201,
    message: `Contacts berhasil di kirim`, 
    response: { contacts  } 
  }
}

export const destroy = async (req) => {
  const { username, contactid } = req.body
  const force = req.query.permanent == "true" ? true : false
  const contacts = (await Contacts.findAll({ where: { username: username, id: contactid }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(contacts.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Contacts.destroy({ where: { username,id: contactid }, force })
  return { 
    status: 200,
    message: `${ contacts.length } Data contact berhasil di hapus`, 
    response: { contacts  } 
  }
}

export const restore = async (req) => {
    const { id, userId } = req.body
    const contacts = (await Contacts.findAll({ where: { userId: userId,id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
    if(contacts.length == 0) throw CreateErrorMessage("Tidak ada data",404)

    await Contacts.restore({ where: { userId: userId,id } })
    return { 
      status: 200,
      message: `${ contacts.length } Data contact berhasil di restore`, 
      response: { contacts  } 
    }
}
