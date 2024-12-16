import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Categories", id:"LIST-CATEGORIES" }]

export const apiCategoriesSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllCategories: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "categories?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.categories.length > 0
                    ? result.response.categories.map(data => ({ type: "Categories", id: data.id },{ type: "Categories",id: "LIST-CATEGORIES" }))
                    : [{ type: "Categories", id: "LIST-CATEGORIES" }]
            }
        }),

        findOneCategories: builder.query({
            query: ({ slug }) => ({ url: "categories/"+slug, method: "GET" }),
            providesTags: result => {
                return result?.response?.categori
                ? [{ type: "Categories", id: result.response.categori.id },{ type: "Categories", id: "LIST-CATEGORIES" }]
                : [{ type: "Categories", id: "LIST-CATEGORIES" }]
            }
        }),

        //
        createCategoriesSlug: builder.mutation({
            query(data){
                return { 
                    url:"categories/create-slug", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),

        storeCategories: builder.mutation({
            query(data){
                return { 
                    url:"categories/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updateCategories: builder.mutation({
            query(data){
                return { 
                    url:"categories/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        restoreCategories: builder.mutation({
            query(data){
                return { 
                    url:"categories/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyCategories: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"categories/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
        findAllCategoriesFront: builder.query({
            query: () => {
                return { 
                    url: "categories",
                    method: "GET"
                }
            }
        }),
    })
})


export const {
    useFindAllCategoriesQuery,
    useFindOneCategoriesQuery,

    useStoreCategoriesMutation,
    useUpdateCategoriesMutation,
    useRestoreCategoriesMutation,
    useDestroyCategoriesMutation,
    useCreateCategoriesSlugMutation,
    useFindAllCategoriesFrontQuery,
} = apiCategoriesSlice
