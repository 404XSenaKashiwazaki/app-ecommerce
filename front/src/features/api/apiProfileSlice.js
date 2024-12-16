import {apiSlice }from "./apiSlice"

const apiProfileSlice = apiSlice.injectEndpoints({
    endpoints: builder =>  ({
        findProfile: builder.query({
            query: ({ username }) => ({ url: "profile/"+username, method: "GET" }),
            providesTags: result => {
                return result?.response?.profiles ? [{type: "Auth",id: result.response.profiles.id}] :  [{ type: "Auth",id: "LIST-AUTH" }]
            }
        }),
        updateProfile: builder.mutation({
            query: params => {
                const { data, username } = params
                return { url:"profile/"+username,data: data, method: "PUT",  headers: { "Content-Type": "multipart/form-data" } }
            },
            invalidatesTags: result => [{type: "Auth",id: result?.response?.users.id}]
        }),
        updatePassword: builder.mutation({
            query: params => {
                const { data, username } = params
                return { url:"profile/"+username+"/update-password",data: data, method: "PUT",  headers: { "Content-Type": "multipart/form-data" } }
            },
            invalidatesTags: result => [{type: "Auth",id: result?.response?.users.id}]
        }),
        removeProfile: builder.mutation({
            query: params => {
                const { data, username } = params
                return { url:"profile/"+username+"/remove-profile",data: data, method: "PUT",  headers: { "Content-Type": "multipart/form-data" } }
            },
            invalidatesTags: result => [{type: "Auth",id: result?.response?.users.id}]
        }),
    })
})

export const { 
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useRemoveProfileMutation,
    useFindProfileQuery
} = apiProfileSlice