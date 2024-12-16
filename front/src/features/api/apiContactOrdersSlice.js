import {apiSlice} from "./apiSlice"

const apiContactOrdersSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllContactOrders: builder.query({
            query: (params) => {
                const { transactionid } = params
                return { url: "contact-orders/"+transactionid,method: "GET" }
            },
            providesTags: result => {
                return result?.response?.contacts.length > 0
                ? result.response.contacts.map(contact => ({ type: "ContactOrders", id: contact.id },{ type: "ContactOrders",id: "LIST-CONTACTS-ORDERS" }))
                : [{ type: "ContactOrders", id: "LIST-CONTACTS-ORDERS" }]
            },
        }),
        storeContactOrders: builder.mutation({
            query: ({ data }) => ({ url: "contact-orders/add", data: data,method: "POST" }),
            invalidatesTags: [{ type: "ContactOrders", id: "LIST-CONTACTS-ORDERS" }]
        }),
    })
})

export const {
    useFindAllContactOrdersQuery,
    useStoreContactOrdersMutation,
} = apiContactOrdersSlice