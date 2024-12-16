import { apiSlice } from "./apiSlice";

export const apiDiscountsSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllDiscounts: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "discounts?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.discounts.length > 0 
                ? res.response.discounts.map(e=> ({ type: "Discounts", id: e.id },{ type: "Discounts", id: "LIST-DISCOUNTS" }))
                :  [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
            }
        }),
        findOneDiscounts: builder.query({

            query: ({ id }) => {
                return { url: `discounts/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.discounts
                ? [ {type: "Discounts", id: res.response.discounts.id},{ type: "Discounts", id:"LIST-DISCOUNTS" }] 
                : [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
            }
        }),

        // multipel 
        storeMultipelDiscounts: builder.mutation({
            query(data){
                return { 
                    url:"discounts/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
        }),
        updateMultipelDiscounts: builder.mutation({
            query(data){
                return { 
                    url:"discounts/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
        }),
        restoreMultipelDiscounts: builder.mutation({
            query(data){
                return { 
                    url:"discounts/restore", 
                    method: "PUT", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
        }),
        destroyMultipelDiscounts: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"discounts/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "Discounts", id: "LIST-DISCOUNTS" }]
        }),
    })
})

export const {
    useFindAllDiscountsQuery,
    useFindOneDiscountsQuery,

    useStoreMultipelDiscountsMutation,
    useUpdateMultipelDiscountsMutation,
    useRestoreMultipelDiscountsMutation,
    useDestroyMultipelDiscountsMutation,

} = apiDiscountsSlice