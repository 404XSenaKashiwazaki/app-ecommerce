import { createSlice } from "@reduxjs/toolkit"
import jwtDecode from "jwt-decode"

const initialState = {
    token: null,
    exprTokenDate: null,
    dataUser: null,
    message: null
} 

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setRemoveState(state) {
            state.token = null,
            state.exprTokenDate = null,
            state.dataUser = null
            state.message = null
        },

        setToken(state,action) {
            const { exp, iat, ...others } = jwtDecode(action.payload.accessToken)
            state.exprTokenDate = exp
            state.token = action.payload.accessToken
            state.dataUser = others
        },

        setUser(state, action) {
            state.dataUser = action.payload
        },
        setMessage(state, action) {
            state.message = action.payload
        },
        removeMessage(state) {
            state.message = ""
        },
    },

})

export const { 
    setRemoveState, 
    setToken,
    setUser,
    setMessage,
    removeMessage
} = authSlice.actions
export default authSlice.reducer

export const tokenSelector = state => state.auth.token
export const userSelector = state => state.auth.dataUser
export const messageSelector = state => state.auth.message