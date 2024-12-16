import axios from "axios"
import { setToken } from "../features/authSlice"

let store
export const injectStoreApi = _store => {
    store = _store
    
}

const AXIOS = axios.create({
    withCredentials: true,
})

AXIOS.interceptors.request.use(async(config) => {
    const curDate = new Date()
    if(store.getState().auth.token != null && store.getState().auth.exprTokenDate * 1000 < curDate.getTime()){
        console.log("token updated..");
        const { data } = await axios.get("http://localhost:8000/api/auth/token",{ withCredentials: true })
        store.dispatch(setToken(data.response))
    }
    config.headers.Authorization = "Bearer "+store.getState().auth.token 
    return config
},(err) => {
    return Promise.reject(err)
})

export default AXIOS