import Sites from "../../models/backend/Sites.js"
import { existsSync, unlink } from "node:fs"

//============================// 

export const find = async (req) => {
  const sites = await Sites.findOne()
  return { 
    status: 200,
    message: "", 
    response: { sites } 
  }
}

export const store = async (req) => {
  const sites = await Sites.create(req.body, { fields: ["title","logo","logo_url","about","dmca","privacy_police"] })
  return { 
    status:  201,
    message: `Data berhasil di simpan`, 
    response: { sites  } 
  }
}

export const update = async (req) => {
  const { id } = req.params

  const sites = await Sites.update(req.body, { where: { id: id } ,fields: ["title","logo","logo_url","about","dmca","privacy_police"] })
  if(existsSync("./public/sites/"+req.body.fileOld) && req.body.fileOld != "default.jpg") unlink("./public/sites/"+req.body.fileOld, err => {
    if(err) throw new Error("File gagal di hapus")
    console.log("File berhasil di hapus")
  })
  return { 
    status:  201,
    message: `Data berhasil di update`, 
    response: { sites  } 
  }
}

export const destroy = async (req) => {
  const { id } = req.params
  const force = req.query.permanent == "true" ? true : false
  const sites = (await Sites.findOne({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)

  if(!sites) throw new Error("error tidak ad data")
  await Sites.destroy({ where: { id: id }, force: force })
  if(force) {
    if(existsSync("./public/sites/"+sites.logo) && sites.logo != "default.jpg") unlink("./public/sites/"+sites.logo, err => {
      if(err) throw new Error("File gagal di hapus")
      console.log("File berhasil di hapus")
    })
  }

  return { 
   status:  200,
    message: `${ sites } Data berhasil di hapus ${force ? `(PERMANENT)` : ``}`, 
    response: { sites } 
  }
}

export const restore = async (req) => {
  const { id } = req.params
  const sites = (await Sites.findOne({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(!sites) throw new Error("Tidak ada data")
  
  await Sites.restore({ where: { id: id } })
  return { 
   status:  200,
    message: `${ sites } Data berhasil di restore`,  
    response: { sites } 
  }
}


export const removeLogo = async (req,res)=> {
  const { id, logo, logo_url, fileOld } = req.body
  const sites = await Sites.findOne({ where: { id }})
  if(!sites) throw CreateErrorMessage("Tidak ada data",404)

  try {
    await sites.update({ logo, logo_url })
    // update file profile
    if(existsSync("./public/sites/"+fileOld) && fileOld != "default.jpg") unlink("./public/sites/"+fileOld, err => {
      if(err) throw CreateErrorMessage("File gagal di hapus",500)
        console.log("File berhasil di hapus")
    })

    return { 
      status: 200,
      message: "Logo berhasil di hapus",
      response: { sites }
    }
  } catch (error) {
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}
