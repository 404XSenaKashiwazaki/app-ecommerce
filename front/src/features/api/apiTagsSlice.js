import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Tags", id:"LIST-TAGS" }]

export const apiTagsSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllTags: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "posts/tags?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.tags.length > 0
                    ? result.response.tags.map(season => ({ type: "Tags", id: season.id },{ type: "Tags",id: "LIST-TAGS" }))
                    : [{ type: "Tags", id: "LIST-TAGS" }]
            }
        }),

        findOneTags: builder.query({
            query: ({ slug }) => ({ url: "posts/tags/"+slug, method: "GET" }),
            providesTags: result => {
                return result?.response?.tag
                ? [{ type: "Tags", id: result.response.tag.id },{ type: "Tags", id: "LIST-TAGS" }]
                : [{ type: "Tags", id: "LIST-TAGS" }]
            }
        }),

        //
        createTagsSlug: builder.mutation({
            query(data){
                return { 
                    url:"posts/tags/create-slug", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),

        storeTags: builder.mutation({
            query(data){
                return { 
                    url:"posts/tags/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updateTags: builder.mutation({
            query(data){
                return { 
                    url:"posts/tags/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        restoreTags: builder.mutation({
            query(data){
                return { 
                    url:"posts/tags/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyTags: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"posts/tags/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),

    })
})


export const {
    useFindAllTagsQuery,
    useFindOneTagsQuery,

    useStoreTagsMutation,
    useUpdateTagsMutation,
    useRestoreTagsMutation,
    useDestroyTagsMutation,
    useCreateTagsSlugMutation
} = apiTagsSlice
