import React, { createContext } from "react"
import jwt from "jwt-decode"

export const initValue = {
    user: {},
    expToken: null,
    isLogin: false,
    token: null
  }
  export const authContext = createContext()
  
  export const reducer = (state, action) => {
    const decode = jwt(action.payload)
    switch(action.type){
        case "LOGIN": 
            return {
                ...state,
                isLogin: true,
                user: {
                  email: decode.email,
                  level: decode.roles, 
                  fullname: decode.fullname,              
                },
                token: action.payload,
                expToken: decode.exp
            }
        case "LOGOUT": 
            return {
                ...state,
                isLogin: false,
                user: null,
                expToken: null,
                token: null
            }
        default:
            return state
    }
  }