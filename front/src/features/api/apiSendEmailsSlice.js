import {apiSlice} from "./apiSlice"

const apiSendEmailsSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendEmailsCheckout: builder.mutation({
            query: (params) => {
                const { data } = params
                return { 
                    url: "sendemails",
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
        }),
    })
})

export const {
    useSendEmailsCheckoutMutation
} = apiSendEmailsSlice