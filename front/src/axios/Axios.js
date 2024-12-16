import axios from 'axios'

export const AXIOS = (exprTokenDate,dispatch,setToken) => {
    const createAxios = axios.create()
    createAxios.interceptors.request.use(async(config) => {
      const curDate = new Date()
      if(exprTokenDate * 1000 < curDate.getTime()){
        console.log(exprTokenDate * 1000 < curDate.getTime());
        console.log("updated..");
        const { data } = await axios.get("http://localhost:8000/api/token",{ withCredentials: true })
        config.headers.Authorization = "Bearer "+data.accessToken
        dispatch(setToken(data))
      }
      return config
    },(err) => Promise.reject(err))
  return createAxios
}
