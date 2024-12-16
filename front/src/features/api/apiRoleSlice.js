import { apiSlice } from "./apiSlice";

export const apiRoleSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllRoles: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "roles?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.roles.length > 0 
                ? res.response.roles.map(e=> ({ type: "Roles", id: e.id },{ type: "Roles", id: "LIST-ROLES" }))
                : [{ type: "Roles", id: "LIST-ROLES" }]
            }
        }),
        findOneRoles: builder.query({
            query: ({ id }) => {
                return { url: `roles/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.role
                ? [ {type: "Roles", id: res.response.role.id},{ type: "Roles", id:"LIST-ROLES" }] 
                : [{ type: "Roles",id: "LIST-ROLES" }]
            }
        }),

        // multipel 
        storeMultipelRoles: builder.mutation({
            query(data){
                return { 
                    url:"roles/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Roles", id: "LIST-ROLES" }]
        }),
        updateMultipelRoles: builder.mutation({
            query(data){
                return { 
                    url:"roles/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Roles", id: "LIST-ROLES" }]
        }),
        restoreMultipelRoles: builder.mutation({
            query(data){
                return { 
                    url:"roles/restore", 
                    method: "PUT", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "Roles", id: "LIST-ROLES" }]
        }),
        destroyMultipelRoles: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"roles/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
           invalidatesTags: [{ type: "Roles", id: "LIST-ROLES" }]
        }),
    })
})

export const {
    useFindAllRolesQuery,
    useFindOneRolesQuery,
    useLazyFindAllRolesQuery,
    
    useStoreMultipelRolesMutation,
    useUpdateMultipelRolesMutation,
    useRestoreMultipelRolesMutation,
    useDestroyMultipelRolesMutation,

} = apiRoleSlice