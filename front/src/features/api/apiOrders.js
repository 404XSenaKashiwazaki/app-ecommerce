import {apiSlice} from "./apiSlice"


const invalidatesTags = [{ type: "OrdersProducts", id: "LIST-ORDER-PRODUCTS" }]
const apiOrders = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //backend 
        findAllOrderBack: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return {
                    url: `orders?search=${search}&page=${page}&per_page=${perPage}&type=${restore}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders.length > 0
                ? res.response.orders.map(e=> ({ type: "OrdersProducts", id: e.id },{ type: "OrdersProducts", id: "LIST-ORDER-PRODUCTS" }))
                : [{ type: "OrdersProducts", id: "LIST-ORDER-PRODUCTS" }]
            }
        }),
        findAllOrderMessageBack:builder.query({
            query: ({ transactionid }) => {
                return {
                    url: `orders/message/${transactionid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders.length > 0
                ? res.response.orders.map(e=> ({ type: "OrdersProductsMessage", id: e.id },{ type: "OrdersProductsMessage", id: "LIST-ORDER-PRODUCTS-MSG" }))
                : [{ type: "OrdersProductsMessage", id: "LIST-ORDER-PRODUCTS-MSG" }]
            }
        }),
        storeOrdersMessageBack: builder.mutation({
            query: ({ data }) => ({ url: `orders/message/${transactionid}/add`, data: data,method: "POST" }),
            invalidatesTags: [{ type: "OrdersProductsMessage", id: "LIST-ORDER-PRODUCTS-MSG" }]
        }),
        findOneOrderBack: builder.query({
            query: ({ id }) => ({ url: "orders/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.orders
                ? [{ type: "OrdersProducts", id: result.response.orders.id },{ type: "OrdersProducts", id: "LIST-ORDER-PRODUCTS" }]
                : [{ type: "OrdersProducts", id: "LIST-ORDER-PRODUCTS" }]
            }
        }),
        updateOrderBack: builder.mutation({
            query(data){
                console.log({ data });
                
                return { 
                    url:"orders/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        restoreOrderBack: builder.mutation({
            query(data){
                return { 
                    url:"orders/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),
        destroyOrderBack: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"orders/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
    })
})

export const {
    useFindAllOrderBackQuery,
    useFindOneOrderBackQuery,
    useUpdateOrderBackMutation,
    useRestoreOrderBackMutation,
    useDestroyOrderBackMutation,
    useFindAllOrderMessageBackQuery,
    useStoreOrdersMessageBackMutation,
} = apiOrders