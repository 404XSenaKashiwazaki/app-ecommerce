 import { apiSlice } from "./apiSlice"

export const apiAddToCartSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findSite: builder.query({
            query: ({ username }) => {
                return { 
                    url: `orders`,
                    method: "GET"
                }
            },
            providesTags: result => {

                return result?.response?.sites != null
                ? [{ type: "Sites", id: result.response.sites?.id },{ type: "Sites",id: "LIST-SITES" }]
                : [{ type: "Sites", id: "LIST-SITES" }]
            },
        }),
        // 

        // multipel 
        storeToCart: builder.mutation({
            query({ data , username }){
                return { 
                    url:"orders/"+username+"/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Sites", id: "LIST-SITES" }]
        }),
        updateSite: builder.mutation({
            query({ data, id}){
                return { 
                    url:"sites/update/"+id, 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: res => {

                return  res?.response?.sites ? [{ type: "Sites", id: res.response.sites[0] },{ type: "Sites",id: "LIST-SITES" }]
                : [{ type: "Sites", id: "LIST-SITES" }]
            }
        })
    })
})


export const {
    useFindSiteQuery,
    useStoreToCartMutation,
    useUpdateSiteMutation,
} = apiAddToCartSlice
