import { apiSlice } from "./apiSlice"

export const apiSiteSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findSite: builder.query({
            query: () => {
                return { 
                    url: `sites`,
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
        storeSite: builder.mutation({
            query({ data }){
                return { 
                    url:"sites/add", 
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
        }),
        removeSiteLogo: builder.mutation({
            query: params => {
                const { data, id } = params
                return { url:"sites/"+id+"/remove-logo",data: data, method: "DELETE",  headers: { "Content-Type": "multipart/form-data" } }
            },
            invalidatesTags: res => {

                return  res?.response?.sites ? [{ type: "Sites", id: res.response.sites[0] },{ type: "Sites",id: "LIST-SITES" }]
                : [{ type: "Sites", id: "LIST-SITES" }]
            }
        }),
    })
})


export const {
    useFindSiteQuery,
    useStoreSiteMutation,
    useUpdateSiteMutation,
    useRemoveSiteLogoMutation,
} = apiSiteSlice
