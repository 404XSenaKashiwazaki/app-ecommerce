import {apiSlice} from "./apiSlice"

const apiNotYetPaid = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsNotYetPaid: builder.query({
            query: (params) => {
                const { username, restores,search, page, perPage } = params
                const restore = restores ? "restore" : ""
                return { 
                    url: "not-yet-paid/"+username+`?search=${search}&page=${page}&per_page=${perPage}&type=${restore}`,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.orders.length > 0
                ? result.response.orders.map(p => ({ type: "OrdersProductsNotPaid", id: p.id },{ type: "OrdersProductsNotPaid",id: "LIST-ORDER-PRODUCTS-NOT-PAID" }))
                : [{ type: "OrdersProductsNotPaid", id: "LIST-ORDER-PRODUCTS-NOT-PAID" }]
            },
        }),
        findOneProductsNotYetPaid: builder.query({
            query: (params) => {
                const { username, produkid } = params
                return { 
                    url: "not-yet-paid/"+username+`/${produkid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsNotPaid", id: res.response.orders.id},{ type: "OrdersProductsNotPaid", id:"LIST-ORDER-PRODUCTS-NOT-PAID" }] 
                : [{ type: "OrdersProductsNotPaid",id: "LIST-ORDER-PRODUCTS-NOT-PAID" }]
            }
        }),
        findConfirmPayment: builder.query({
            query: (params) => {
                const { username, transactionid } = params
                return { 
                    url: "not-yet-paid/confirm/"+username+`/${transactionid}`,
                    method: "GET",
                }
            }
        }),
        cancelTransactionNotPaid: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "shopping-carts/"+ username +"/cancel-transaction",
                    method: "DELETE",
                    data: data
                }
            },
            invalidatesTags: [{ type: "OrdersProductsNotPaid", id: "LIST-ORDER-PRODUCTS-NOT-PAID" }]
        }),
        chargeTransactionNotPaid: builder.mutation({
            query: (params) => {
                const { username, data } = params
                return { 
                    url: "shopping-carts/"+ username +"/charge-transaction",
                    method: "POST",
                    data: data
                }
            },
            invalidatesTags: [{ type: "OrdersProductsNotPaid", id: "LIST-ORDER-PRODUCTS-NOT-PAID" }]
        }),
    })
})

export const {
    useFindAllProductsNotYetPaidQuery,
    useCancelTransactionNotPaidMutation,
    useFindOneProductsNotYetPaidQuery,
    useFindConfirmPaymentQuery,
    useChargeTransactionNotPaidMutation,
} = apiNotYetPaid