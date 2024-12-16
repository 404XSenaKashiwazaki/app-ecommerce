import { apiSlice } from "./apiSlice"
import { setRemoveState, setToken } from "../authSlice"
const auth = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        auth: builder.query({
            query: () => ({ 
                url: "auth/token",
                method: "GET"
            }),
            providesTags: result => {
                return result?.response?.users ? [{type: "Auth",id: result.response.users.id}] :  [{ type: "Auth",id: "LIST-AUTH" }]
            },
            async onQueryStarted(args,{ queryFulfilled, dispatch, getState },extra){
                try {
                    const { data } = await queryFulfilled
                    if(data) dispatch(setToken(data.response))
                } catch (error) {
                    console.log(error);
                    dispatch(setRemoveState())
                }
            }
        }),
        login: builder.mutation({
            query(data){
                return {
                    url: "auth/login",
                    method: "POST",
                    data
                }
            },
            providesTags: result => {
                return result?.response?.users ? [{type: "Auth",id: result.response.users.id}] :  [{ type: "Auth",id: "LIST-AUTH" }]
            },
        }),
        daftar: builder.mutation({
            query(data){
                return {
                    url: "auth/register",
                    method: "POST",
                    data
                }
            },
            providesTags: result => {
                return result?.response?.users ? [{type: "Auth",id: result.response.users.id}] :  [{ type: "Auth",id: "LIST-AUTH" }]
            },
        }),
        logout: builder.mutation({
            query(){
                    return {
                        url: "auth/logout",
                        method: "DELETE",
                    }
                },
                providesTags: result => {
                    return result?.response?.users ? [{type: "Auth",id: result.response.users.id}] :  [{ type: "Auth",id: "LIST-AUTH" }]
            },
        }),
        authVerifyEmail: builder.mutation({
            query(data){
                return {
                    url: "auth/verify-email",
                    method: "POST",
                    data
                }
            },
        }),
        authForgotPassword: builder.mutation({
            query(data){
                return {
                    url: "auth/forgot-password",
                    method: "POST",
                    data
                }
            },
        }),
        authNewPassword: builder.mutation({
            query(data){
                return {
                    url: "auth/new-password",
                    method: "POST",
                    data
                }
            },
        }),
    }),
})

export const {  
    useLoginMutation,
    useLogoutMutation,
    useDaftarMutation,
    useAuthQuery,
    useAuthForgotPasswordMutation,
    useAuthNewPasswordMutation,
    useAuthVerifyEmailMutation
} = auth



