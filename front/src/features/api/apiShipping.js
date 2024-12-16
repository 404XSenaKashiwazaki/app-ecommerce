import {apiSlice} from "./apiSlice"

const apiShoppingCart = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsShipping: builder.query({
            query: (params) => {
                const { username, productId } = params
                
                return { 
                    url: "shipping/"+username,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.orders.length > 0
                ? result.response.orders.map(p => ({ type: "OrdersProductsShipping", id: p.id },{ type: "OrdersProductsShipping",id: "LIST-ORDER-PRODUCTS-SHIPPING" }))
                : [{ type: "OrdersProductsShipping", id: "LIST-ORDER-PRODUCTS-SHIPPING" }]
            },
        }),
        findOneProductsShipping: builder.query({
            query: (params) => {
                const { username, produkid } = params
                return { 
                    url: "shipping/"+username+`/${produkid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsShipping", id: res.response.orders.id},{ type: "OrdersProductsShipping", id:"LIST-ORDER-PRODUCTS-SHIPPING" }] 
                : [{ type: "OrdersProductsShipping",id: "LIST-ORDER-PRODUCTS-SHIPPING" }]
            }
        }),
        transactionAccepted: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "shipping/"+ username +"/accepted-transaction",
                    method: "PUT",
                    data: data
                }
            },
            invalidatesTags: [{ type: "OrdersProductsShipping",id: "LIST-ORDER-PRODUCTS-SHIPPING" }]
        }),
    })
})

export const {
    useFindAllProductsShippingQuery,
    useFindOneProductsShippingQuery,
    useTransactionAcceptedMutation,
} = apiShoppingCart