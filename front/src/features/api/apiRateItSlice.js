import {apiSlice} from "./apiSlice"

const apiRateIt = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductRateIt: builder.query({
            query: (params) => {
                const { username, productId } = params
                
                return { 
                    url: "finished-orders/"+username,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.orders.length > 0
                ? result.response.orders.map(p => ({ type: "OrdersProductsFinish", id: p.id },{ type: "OrdersProductsFinish",id: "LIST-ORDER-PRODUCTS-FINISH" }))
                : [{ type: "OrdersProductsFinish", id: "LIST-ORDER-PRODUCTS-FINISH" }]
            },
        }),
        findOneProductsRateIt: builder.query({
            query: (params) => {
                const { username, produkid } = params
                return { 
                    url: "finished-orders/"+username+`/${produkid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsFinish", id: res.response.orders.id},{ type: "OrdersProductsFinish", id:"LIST-ORDER-PRODUCTS-FINISH" }] 
                : [{ type: "OrdersProductsFinish",id: "LIST-ORDER-PRODUCTS-FINISH" }]
            }
        }),
        storeProductsRateIt: builder.mutation({
            query: (params) => {
                const { username, data} = params
                console.log({  data });
                
                return { 
                    url: "finished-orders/"+username+"/add-rating",
                    data: data,
                    method: "POST",
                }
            },
            invalidatesTags: [{ type: "OrdersProductsFinish", id: "LIST-ORDER-PRODUCTS-FINISH" }]
        }),
        findProductsRatingRateIt: builder.query({
            query: (params) => {
                const { username, orderid } = params
                return { 
                    url: "finished-orders/rating/"+username+`/${orderid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsFinish", id: res.response.orders.id},{ type: "OrdersProductsFinish", id:"LIST-ORDER-PRODUCTS-FINISH" }] 
                : [{ type: "OrdersProductsFinish",id: "LIST-ORDER-PRODUCTS-FINISH" }]
            }
        }),
    })
})

export const {
    useFindAllProductRateItQuery,
    useFindOneProductsRateItQuery,
    useStoreProductsRateItMutation,
    useFindProductsRatingRateItQuery
} = apiRateIt