import { Op } from "sequelize"
import Contact from "../../models/backend/Contact.js"
import Users from "../../models/backend/Users.js"
import UsersDetail from "../../models/backend/UsersDetails.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
//============================// 

export const findAll = async (req) => {
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true
  const where = (paranoid) 
  ? { where: {
    [Op.or]: {
      username: { [Op.like]: `%${search}%` },
      email: { [Op.like]: `%${search}%`},
      content: { [Op.like]: `%${search}%`}
    },
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      username: { [Op.like]: `%${search}%` },
      email: { [Op.like]: `%${search}%`},
      content: { [Op.like]: `%${search}%`}
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const contacts = await Contact.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await Contact.count(whereCount)

  const totalsCount = (search == "") ? totals : contacts.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = contacts.length

  return { 
    status: 200,
    message: "", 
    response: { contacts, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true

 
  const include = [{model: Users,attributes: ["username","email","namaDepan","namaBelakang"],include:[{ model: UsersDetail, attributes: ["profileUrl","alamat","noHp"] }]}]
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const contacts = await Contact.findOne({...where, paranoid, include})
  if(!contacts) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { contacts } 
  }
}

export const update = async (req) => {
  const { email, username, content, UserId } = req.body
  const contacts = await Contact.create(req.body,{ fields:["email","username","content","UserId", "ContactId"] })
  return { 
    status:  201,
    message: `Contacts berhasil di kirim`, 
    response: { contacts  } 
  }
}


export const destroy = async (req) => {
  const { id } = req.body
  const force = req.query.permanent == "true" ? true : false
  const contacts = (await Contact.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
 
  if(contacts.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Contact.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ contacts.length } Data berhasil di hapus`, 
    response: { contacts  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const contacts = (await Contact.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(contacts.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Contact.restore({ where: { id: id } })
  return { 
    status:  200,
    message: `${ contacts.length } Data berhasil di restore`,  
    response: { contacts } 
  }
}
