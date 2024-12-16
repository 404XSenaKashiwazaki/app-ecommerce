import { Op } from "sequelize"

import Sliders from "../../models/backend/Slider.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"
import { existsSync, unlink } from "node:fs"
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
      title: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      title: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const sliders = await Sliders.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await Sliders.count(whereCount)

  const totalsCount = (search == "") ? totals : sliders.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = sliders.length
  
  return { 
    status:  200,
    message: "", 
    response: { sliders, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const showBanners = async (req) => {
  const sliders = await Sliders.findAll({ order: [["id","DESC"]]})   
  return { 
    status:  200,
    message: "", 
    response: { sliders } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const slider = await Sliders.findOne({...where, paranoid})
  if(!slider) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { slider } 
  }

}
export const store = async (req) => {
  const { sliders } = req.body
  await Sliders.bulkCreate(sliders,{ fields: ["title","image","imageUrl","desk"] })
  return { 
    status:  201,
    message: `${sliders.length} Data berhasil di simpan`, 
    response: { sliders  } 
  }
}

export const update = async (req) => {
  const { sliders } = req.body
  const response = (await Promise.all(sliders.map(async e =>  {
    const sliders = await Sliders.findOne({ where: { id: e.sliders_id }, paranoid: false, attributes: ["id","image"] })
    if(!sliders) return 
    const image = sliders.image

    await sliders.update(e,{ fields: ["title","image","imageUrl","desk"] })
    if(existsSync("./public/slider/"+image) && image != "default.jpg" && req.files && req.files.length > 0) unlink("./public/slider/"+image, err => {
      if(err) throw CreateErrorMessage("File gagal di hapus",500)
      console.log("File berhasil di hapus")
    })
    return { id: sliders.id }
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

  const sliders = (await Sliders.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(sliders.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Sliders.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ sliders.length } Data berhasil di hapus`, 
    response: { sliders  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const sliders = (await Sliders.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(sliders.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Sliders.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ sliders.length } Data berhasil di restore`,  
    response: { sliders } 
  }
}
