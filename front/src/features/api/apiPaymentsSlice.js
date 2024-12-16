import {apiSlice} from "./apiSlice"


const invalidatesTags = [{ type: "PaymentsOrders", id: "LIST-PAYMENTS-ORDERS" }]
const apiPaymentsSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //backend 
        findAllPaymentsBack: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return {
                    url: `payments?search=${search}&page=${page}&per_page=${perPage}&type=${restore}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.payments.length > 0
                ? res.response.payments.map(e=> ({ type: "PaymentsOrders", id: e.id },{ type: "PaymentsOrders", id: "LIST-PAYMENTS-ORDERS" }))
                : [{ type: "PaymentsOrders", id: "LIST-PAYMENTS-ORDERS" }]
            }
        }),
        findOnePaymentsBack: builder.query({
            query: ({ id }) => ({ url: "payments/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.payments
                ? [{ type: "PaymentsOrders", id: result.response.payments.id },{ type: "PaymentsOrders", id: "LIST-PAYMENTS-ORDERS" }]
                : [{ type: "PaymentsOrders", id: "LIST-PAYMENTS-ORDERS" }]
            }
        }),
        updatePaymentsBack: builder.mutation({
            query(data){
                console.log({ data });
                
                return { 
                    url:"payments/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        restorePaymentsBack: builder.mutation({
            query(data){
                return { 
                    url:"payments/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),
        destroyPaymentsBack: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"payments/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
    })
})

export const {
    useFindAllPaymentsBackQuery,
    useFindOnePaymentsBackQuery,
    useUpdatePaymentsBackMutation,
    useRestorePaymentsBackMutation,
    useDestroyPaymentsBackMutation,
} = apiPaymentsSlice