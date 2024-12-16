import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Users",id: "LIST-USERS" }]

export const apiUserSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllUsers: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "users?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.users.length > 0
                ? res.response.users.map(e=> ({ type: "Users", id: e.id },{ type: "Users", id: "LIST-USERS" }))
                : [{ type: "Users", id: "LIST-USERS" }]
            }
        }),
       
        findOneUsers: builder.query({
            query: ({ id }) => {
         
                return { url: `users/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.users 
                ? [ {type: "Users", id: res.response.users.id},{ type: "Users", id:"LIST-USERS" }] 
                : [{ type: "Users",id: "LIST-USERS" }]
            }
        }),

        activeUsers: builder.mutation({
            query({ userid }){
                return { url:"users/isactive/"+userid, method: "PUT" }
            },
            invalidatesTags
        }),

        nonActiveUsers: builder.mutation({
            query({ userid }){
                return { url:"users/nonactive/"+userid, method: "PUT" }
            },
            invalidatesTags
        }),

        updateProfileUsers: builder.mutation({
            query(data){
                return { 
                    url:"users/update-profile-image", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        find: builder.mutation({
            query: ({ search, page, perPage, restores }) => {
                const restore = restores ? "restore" : ""
                return { url: "users?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.users 
                ? res.response.users.map(e=> ({ type: "Users", id: e.id },{ type: "Users", id: "LIST-USERS" }))
                : [{ type: "Users", id: "LIST-USERS" }]
            }
        }),
        // multipel 
        storeMultipelUsers: builder.mutation({
            query(data){
                return { 
                    url:"users/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        updateMultipelUsers: builder.mutation({
            query(data){
                return { 
                    url:"users/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),
        restoreMultipelUsers: builder.mutation({
            query(data){
                return { 
                    url:"users/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),
        destroyMultipelUsers: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"users/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
    })
})

export const {
    useFindAllUsersQuery,
    useFindOneUsersQuery,
    useLazyFindOneUsersQuery,
    
    useStoreMultipelUsersMutation,
    useUpdateMultipelUsersMutation,
    useRestoreMultipelUsersMutation,
    useDestroyMultipelUsersMutation,
    useUpdateProfileUsersMutation,
    useActiveUsersMutation,
    useFindMutation,
    useNonActiveUsersMutation
} = apiUserSlice