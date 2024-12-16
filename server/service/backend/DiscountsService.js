import { Op } from "sequelize"
import Diskon from "../../models/backend/Diskon.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { formatDateTime } from "../../utils/FormatDate.js"
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
      diskon: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      diskon: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const discounts = await Diskon.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await Diskon.count(whereCount)

  const totalsCount = (search == "") ? totals : discounts.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = discounts.length
  
  return { 
    status:  200,
    message: "", 
    response: { discounts, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const discounts = await Diskon.findOne({...where, paranoid})
  if(!discounts) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { discounts } 
  }

}
export const store = async (req) => {
  let { discounts } = req.body
  discounts = discounts.map(e=> ({...e, tanggal_mulai: formatDateTime(e.tanggal_mulai),tanggal_berakhir: formatDateTime(e.tanggal_berakhir)}))
  await Diskon.bulkCreate(discounts,{ fields: ["diskon","deskripsi","tanggal_mulai","tanggal_berakhir"] })
  return { 
    status:  201,
    message: `${discounts.length} Data berhasil di simpan`, 
    response: { discounts  } 
  }
}



export const update = async (req) => {
  const { discounts } = req.body
  const response = (await Promise.all(discounts.map(async e =>  {
    e.tanggal_mulai = (e.tanggal_mulai == e.tanggal_mulai_old) ? e.tanggal_mulai_old : formatDateTime(e.tanggal_mulai)
    e.tanggal_berakhir = (e.tanggal_berakhir == e.tanggal_berakhir_old) ? e.tanggal_berakhir_old : formatDateTime(e.tanggal_berakhir)

    const discounts = await Diskon.findOne({ where: { id: e.discounts_id }, paranoid: false, attributes: ["id"] })
    if(!discounts) return 
    await discounts.update(e,{ fields: ["diskon","deskripsi","tanggal_mulai","tanggal_berakhir"] })

    return { id: discounts.id }
  }))).filter(e=> e != null)
  if(response.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  201,
    message: `${response.length} Data berhasil di update`, 
    response: { response  } 
  }
}

export const destroy = async (req) => {
  const { id } = req.body
  const force = req.query.permanent == "true" ? true : false

  const discounts = (await Diskon.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(discounts.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Diskon.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ discounts.length } Data berhasil di hapus`, 
    response: { discounts  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const discounts = (await Diskon.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(discounts.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Diskon.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ discounts.length } Data berhasil di restore`,  
    response: { discounts } 
  }
}
