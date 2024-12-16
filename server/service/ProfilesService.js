import Users from "../models/backend/Users.js"
import Roles from "../models/backend/Roles.js"
import UsersDetails from "../models/backend/UsersDetails.js"
import { CreateErrorMessage } from "../utils/CreateError.js"
import sequelize from "../config/Database.js"
import bcrypt from "bcrypt"
import env from "dotenv"
import jwt from "jsonwebtoken"
import { existsSync, unlink } from "node:fs"
//============================// 


export const find = async req => {
  const { username } = req.params
  const profiles = await Users.findOne({  where: { username: username }, include:[Roles,UsersDetails] })
  return { 
    status: 200,
    message: "",
    response: { profiles }
  }
}

export const update = async (req,res)=> {
  const users = await Users.findOne({ where: { id: req.body.id }, include:[Roles,UsersDetails] })
  const profileOld = users.UsersDetail.profile

  if(!users) throw CreateErrorMessage("Tidak ada data",404)

  try {
    await sequelize.transaction( async transaction => {
      await users.update(req.body,{ fields:["email","namaDepan", "namaBelakang"], transaction})
      await UsersDetails.update(req.body,{ where:{ userId: req.body.id }, fields:[ 
        "profile",
        "profileUrl",
        "noHp",
        "alamat",
        "desc",
        "userId",
        "provinsi",
        "kota",
        "kecamatan",
        "kodePos",
        "negara"
      ], transaction })
    })

    // update file profile
    if(existsSync("./public/profile/"+profileOld) && profileOld != "default.jpg" && (req.files && req.files.length > 0)) unlink("./public/profile/"+profileOld, err => {
      if(err) throw CreateErrorMessage("File gagal di hapus",500)
        console.log("File berhasil di hapus")
    })

    await users.reload()
    const refreshToken = createToken(process.env.REFRESH_TOKEN_SECRET,users,"1d")
    const accessToken = createToken(process.env.ACCESS_TOKEN_SECRET,users, "30s")

    res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 60*60*24*1000})
    await users.update({token: refreshToken})
    return { 
      status: 200,
      message: "Profile berhasil di update",
      response: { users, accessToken  }
    }
  } catch (error) {
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}


export const updatePassword = async (req,res)=> {
  const users = await Users.findOne({ where: { id: req.body.id }, include:[Roles,UsersDetails] })
  if(!users) throw CreateErrorMessage("Tidak ada data",404)
  const saltRound = await bcrypt.genSalt(10)

  const match = await bcrypt.compare(req.body.passwordOld,users.password)
  if(!match) throw CreateErrorMessage("Password lama anda salah",400)
  req.body.password = (req.body.password) ? await bcrypt.hash(req.body.password, saltRound) : users.password
  try {
    await users.update(req.body,{ fields:["password"]})
    return { 
      status: 200,
      message: "Password berhasil di update",
      response: { users }
    }
  } catch (error) {
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}

export const removeProfile = async (req,res)=> {
  const { id, profile, profileUrl, profileOld } = req.body
  const users = await Users.findOne({ where: { id }, include:[Roles,UsersDetails] })
  if(!users) throw CreateErrorMessage("Tidak ada data",404)

  try {
    await UsersDetails.update({ profile, profileUrl },{ where: { UserId: id } })
    // update file profile
    if(existsSync("./public/profile/"+profileOld) && profileOld != "default.jpg") unlink("./public/profile/"+profileOld, err => {
      if(err) throw CreateErrorMessage("File gagal di hapus",500)
        console.log("File berhasil di hapus")
    })
    await users.reload()
    
    const refreshToken = createToken(process.env.REFRESH_TOKEN_SECRET,users,"1d")
    const accessToken = createToken(process.env.ACCESS_TOKEN_SECRET,users, "30s")
    res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 60*60*24*1000})

    await users.update({token: refreshToken})
    return { 
      status: 200,
      message: "Password berhasil di update",
      response: { users, accessToken }
    }
  } catch (error) {
    throw CreateErrorMessage(error.message, error.statusCode)
  }
}


const createToken = (secretKey,users,expires)=> {
  const roles = users.Roles
  const navigate = roles.map(t => (t.name.trim().toLowerCase().includes("admin","penjual")) ? "/api/dashboard" : "/")
  const jwtToken = jwt.sign({ 
    id: users.id,
    username: users.username,
    namaDepan: users.namaDepan,
    namaBelakang: users.namaBelakang,
    email: users.email,
    roles: users.Roles,
    detailUsers: users.UsersDetail,
    navigate: navigate[0]
  },
    secretKey,
  {expiresIn: expires})

  return jwtToken
}