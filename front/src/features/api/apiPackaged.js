import {apiSlice} from "./apiSlice"

const apiShoppingCart = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllProductsPackaged: builder.query({
            query: (params) => {
                const { username, restores,search, page, perPage } = params
                const restore = restores ? "restore" : ""
                return { 
                    url: "packaged/"+username+`?search=${search}&page=${page}&per_page=${perPage}&type=${restore}`,
                    method: "GET",
                }
            },
            providesTags: result => {
                return result?.response?.orders.length > 0
                ? result.response.orders.map(p => ({ type: "OrdersProductsPackaged", id: p.id },{ type: "OrdersProductsPackaged",id: "LIST-ORDER-PRODUCTS-PACKAGED" }))
                : [{ type: "OrdersProductsPackaged", id: "LIST-ORDER-PRODUCTS-PACKAGED" }]
            },
        }),
        findOneProductsPackaged: builder.query({
            query: (params) => {
                const { username, produkid } = params
                return { 
                    url: "packaged/"+username+`/${produkid}`,
                    method: "GET",
                }
            },
            providesTags: res => {
                return res?.response?.orders 
                ? [ {type: "OrdersProductsPackaged", id: res.response.orders.id},{ type: "OrdersProductsPackaged", id:"LIST-ORDER-PRODUCTS-PACKAGED" }] 
                : [{ type: "OrdersProductsPackaged",id: "LIST-ORDER-PRODUCTS-PACKAGED" }]
            }
        }),
        cancelProductsPackaged: builder.mutation({
            query: (params) => {
                const { username, data} = params
                return { 
                    url: "packaged/"+username+"/cancel",
                    data: data,
                    method: "DELETE",
                }
            },
            invalidatesTags: [{ type: "OrdersProductsPackaged", id: "LIST-ORDER-PRODUCTS-PACKAGED" }]
        }),
        
    })
})

export const {
    useFindAllProductsPackagedQuery,
    useCancelProductsPackagedMutation,
    useFindOneProductsPackagedQuery,
} = apiShoppingCart