import {apiSlice} from "./apiSlice"

const apiShoppingCart = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsCarts: builder.query({
            query: (params) => {
                const { username, productId } = params
                
                return { 
                    url: "shopping-carts/"+username+"?product="+productId,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.products.length > 0
                ? result.response.products.map(p => ({ type: "Products", id: p.id },{ type: "Products",id: "LIST-PRODUCTS" }))
                : [{ type: "Products", id: "LIST-PRODUCTS" }]
            },
        }),
        checkout: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "order/"+username+"/add",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),
        createTransaction: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "/shopping-carts/"+ username +"/create-transaction",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),
        cancelTransaction: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "shopping-carts/"+ username +"/cancel-transaction",
                    method: "DELETE",
                    data: data
                }
            },
            invalidatesTags: [{ type: "Products", id: "LIST-PRODUCTS" }]
        }),
        storePayment: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "/shopping-carts/"+ username +"/create-transaction-payment",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),
        storePaymentPending: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "/shopping-carts/"+ username +"/pay-payment-pending",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),

        deleteOrderCheckout: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "/shopping-carts/"+ username +"/delete-transaction",
                    method: "DELETE",
                    data: data
                }
            },
        }),
        storeOrdersItems: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "/shopping-carts/"+ username +"/store-orders-items",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),
        
    })
})

export const {
    useCheckoutMutation,
    useFindAllProductsCartsQuery,
    useCreateTransactionMutation,
    useDeleteOrderCheckoutMutation,
    useStorePaymentMutation,
    useStorePaymentPendingMutation,
    useCancelTransactionMutation,
    useStoreOrdersItemsMutation,
} = apiShoppingCart