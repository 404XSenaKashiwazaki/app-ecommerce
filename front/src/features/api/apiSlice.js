import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setRemoveState, setToken, setUser } from "../authSlice"
import AXIOS from "../../api/api"


const fnFetch = fetchBaseQuery({
   baseUrl: "http://localhost:8000/api/",
   credentials: "include",
   prepareHeaders: (Headers, { getState }) => {
      return Headers.set("Authorization","Bearer "+getState().auth.token)
   }
})

const baseQuery = async (args,BaseQueryApi,extraOption) =>{

   let res = await fnFetch(args,BaseQueryApi,extraOption)
   if(res?.error?.originalStatus == 403){
      console.log("Update Token...");
      const { data,error } = await fnFetch("/token",BaseQueryApi,extraOption)
      if(data){
         BaseQueryApi.dispatch(setToken(data))
         res = await fnFetch(args,BaseQueryApi,extraOption)
      }else{
         BaseQueryApi.dispatch(setRemoveState())
      }
   }
   
   return res
}

const baseQueryAxios = ({ baseUrl } = { baseUrl: "" }) => async ({ url, method, data, params, headers }) => {
   try {
      const res = await AXIOS({
         url: baseUrl + url,
         method,
         data,
         params,
         headers
      })

      return { data: res.data}
   } catch (error) {
      return {
         error: {
            status: error.response?.status,
            data: error.response?.data || error.message
         }
      }
   }
}

export const apiSlice = createApi({
   reducerPath: "api",
   baseQuery: baseQueryAxios({
      baseUrl:"http://localhost:8000/api/"
   }),
   tagTypes:[
      "Series",
      "Episodes",
      "Users",
      "Auth",
      "Tags",
      "Categories",
      "Products",
      "Roles",
      "Sites",
      "Contact",
      "Comments",
      "Profiles",
      "Chechout",
      "Sliders",
      "OrdersProducts",
      "PaymentsOrders",
      "NotPaidOrders",
      "ContactOrders",
      "OrdersProductsNotPaid",
      "OrdersProductsPackaged",
      "OrdersProductsShipping",
      "OrdersProductsCancelled",
      "OrdersProductsFinish",
      "Discounts",
      "OrdersProductsMessage",
   ],
   endpoints: builder => ({}),
})


