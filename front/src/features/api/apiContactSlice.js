import {apiSlice} from "./apiSlice"

const apiContact = apiSlice.injectEndpoints({
    endpoints: builder => ({
        storeContact: builder.mutation({
            query: ({ username, data }) => ({ url: "contacts/"+username+"/add", data: data,method: "POST" }),
            invalidatesTags: res => {
                return res?.response.contacts  ? [{ type: "Contact", id: res.response.contacts.id },{ type: "Contact", id: "LIST-CONTACTS" }]
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            }

        }),
        findAllContact: builder.query({
            query: (params) => {
                const { page, search, perPage,username } = params
                return { url: "contacts/"+username+`/all?search=&page=${page}&per_page=${perPage}`,method: "GET" }
            },
            providesTags: result => {
                return result?.response?.contacts.length > 0
                ? result.response.contacts.map(contact => ({ type: "Contact", id: contact.id },{ type: "Contact",id: "LIST-CONTACTS" }))
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            },
        }),
        findOneContact: builder.query({
            query: ({ id,userid  }) => ({ url: "contacts/"+userid+"/"+id,method: "GET" }),
            providesTags: result => {
                return result?.response?.contacts.length > 0
                ? [{ type: "Contact", id: result.response.contacts.id },{ type: "Contact",id: "LIST-CONTACTS" }]
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            },
        }),
        updateContact: builder.mutation({
            query: ({ userid, data,id }) => ({ url: "contacts/"+userid+"/"+id,data: data, method: "PUT" }),

        }),
        restoreContact: builder.mutation({
            query: ({ username, id }) => ({ url: "contacts/"+username+"/"+id+"/restore", data: { contactid: [id],  username: username  },method: "PUT" }),
            invalidatesTags: res => {
                return res?.response?.contacts.length != 0 ? res.response.contacts.map(e=> ({ type: "Contact", id: e.id },{ type: "Contact", id: "LIST-CONTACTS" }))
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            }
        }),
        deleteContact: builder.mutation({
            query: ({ username, id }) => ({ url: "contacts/"+username+"/"+id+"/destroy", data: { contactid: [id], username: username },method: "DELETE" }),
            invalidatesTags: res => {
                return res?.response?.contacts.length != 0 ? res.response.contacts.map(e=> ({ type: "Contact", id: e.id },{ type: "Contact", id: "LIST-CONTACTS" }))
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            }
        }),


        // admin
        findAllContact_:  builder.query({
            query: ({ restores, page, search, perPage}) => {
                const restore = restores ? "restore": ""
                return { url: "contacts?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }

            },
            providesTags: res => {
                return res?.response?.contacts.length != 0 ? res?.response.contacts.map(e=> ({ type: "Contact", id: e.id },{ type: "Contact", id: "LIST-CONTACTS" }))
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            }
        }),
        findOneContact_: builder.query({
            query: ({ id }) => ({ url: "contacts/"+id,method: "GET" }),
            providesTags: res => {
                return res?.response  ? [{ type: "Contact", id: res.response.id },{ type: "Contact", id: "LIST-CONTACTS" }]
                : [{ type: "Contact", id: "LIST-CONTACTS" }]
            }
        }),
        updateContact_: builder.mutation({
            query: ({ data, id }) => ({ url: "contacts/tanggapan/"+id+"/add",data: data, method: "PUT", headers: { "Content-Type": "multipart/form-data" }}),
            invalidatesTags: [{ type: "Contact", id: "LIST-CONTACTS" }]
        }),
        restoreContact_: builder.mutation({
            query: (data) => ({ url: "contacts/restore",data: data,method: "PUT" }),
            invalidatesTags: [{ type: "Contact", id: "LIST-CONTACTS" }]
        }),
        deleteContact_: builder.mutation({
            query: (data) => ({ url: "contacts/destroy"+data.permanent, data: data,method: "DELETE" }),
            invalidatesTags: [{ type: "Contact", id: "LIST-CONTACTS" }]
        }),
    })
})

export const {
    useFindAllContactQuery,
    useFindOneContactQuery,
    useStoreContactMutation,
    useDeleteContactMutation,
    useUpdateContactMutation,
    useRestoreContactMutation,

    useFindAllContact_Query,
    useFindOneContact_Query,
    useDeleteContact_Mutation,
    useUpdateContact_Mutation,
    useRestoreContact_Mutation,
} = apiContact