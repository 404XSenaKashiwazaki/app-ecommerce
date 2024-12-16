import {apiSlice} from "./apiSlice"

const apiCancelled = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsCancelled: builder.query({
            query: (params) => {
                const { username} = params
                
                return { 
                    url: "cancelled-orders/"+username,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.orders.length > 0
                ? result.response.orders.map(p => ({ type: "OrdersProductsCancelled", id: p.id },{ type: "OrdersProductsCancelled",id: "LIST-ORDER-PRODUCTS-CANCELLED" }))
                : [{ type: "OrdersProductsCancelled", id: "LIST-ORDER-PRODUCTS-CANCELLED" }]
            },
        }),
        findOneProductsCancelled: builder.query({
            query: (params) => {
                const { username, produkid } = params
                return { 
                    url: "cancelled-orders/"+username+`/${produkid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsCancelled", id: res.response.orders.id},{ type: "OrdersProductsCancelled", id:"LIST-ORDER-PRODUCTS-CANCELLED" }] 
                : [{ type: "OrdersProductsCancelled",id: "LIST-ORDER-PRODUCTS-CANCELLED" }]
            }
        }),
    })
})

export const {
    useFindAllProductsCancelledQuery,
    useFindOneProductsCancelledQuery,
} = apiCancelled