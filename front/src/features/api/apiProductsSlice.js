import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Products", id:"LIST-PRODUCTS" }]

export const apiJadwalRilisSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllProducts: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "products?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.products.length > 0
                    ? result.response.products.map(data => ({ type: "Products", id: data.id },{ type: "Products",id: "LIST-PRODUCTS" }))
                    : [{ type: "Products", id: "LIST-PRODUCTS" }]
            }
        }),

        findAllProductsById: builder.query({
            query: (params) => {
                const { page, search, perPage, id, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "products/get-all-byid",
                    method: "POST",
                    data: { id, type: restore }
                }
            },
            providesTags: result => {
                return result?.response?.products.length > 0
                ? result.response.products.map(jadwal => ({ type: "Products", id: jadwal.id },{ type: "Products",id: "LIST-PRODUCTS" }))
                : [{ type: "Products", id: "LIST-PRODUCTS" }]
            },
        }),

        findOneProducts: builder.query({
            query: ({ slug }) => ({ url: "products/"+slug, method: "GET" }),
            providesTags: result => {
                return result?.response?.products
                ? [{ type: "Products", id: result.response.products.id },{ type: "Products", id: "LIST-PRODUCTS" }]
                : [{ type: "Products", id: "LIST-PRODUCTS" }]
            }
        }),

        //
        createProductsSlug: builder.mutation({
            query(data){
                return { 
                    url:"products/create-slug", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),

        storeProducts: builder.mutation({
            query(data){
                return { 
                    url:"products/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updateProducts: builder.mutation({
            query(data){
                return { 
                    url:"products/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        storeImageProducts: builder.mutation({
            query(data){
                return { 
                    url:"products/image/add", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),


        restoreProducts: builder.mutation({
            query(data){
                return { 
                    url:"products/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyProducts: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"products/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),

    })
})


export const {
    useFindAllProductsQuery,
    useFindOneProductsQuery,
    useFindAllProductsByIdQuery,

    useStoreProductsMutation,
    useUpdateProductsMutation,
    useRestoreProductsMutation,
    useDestroyProductsMutation,
    useCreateProductsSlugMutation,
    useStoreImageProductsMutation
} = apiJadwalRilisSlice
