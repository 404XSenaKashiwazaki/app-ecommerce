import {apiSlice} from "./apiSlice"


const apiComment = apiSlice.injectEndpoints({
    endpoints: builder => ({
        storeComment: builder.mutation({
            query: ({ data,seriid }) => ({ url: "comment/"+seriid, data: data,method: "POST" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),
        countComment: builder.mutation({
            query: ({ seriid }) => ({ url: "comment/count/"+seriid,method: "GET" }),
        }),
        findAllComment: builder.query({
            query: ({ seriid }) => ({ url: "comment/"+seriid,method: "GET" }),
            providesTags: res => {
                return  res?.response?.comments.length > 0 
                ? res.response.comments.map(e => ({type:"Comments", id: e.id },{ type: "Comments",id: "LIST-COMMENTS" }))
                : [{ type: "Comments",id: "LIST-COMMENTS" }]
            }
        }),
        findOneComment: builder.query({
            query: ({ userid,seriid,id  }) => ({ url: "comment/"+id+"/"+userid+"/"+seriid,method: "PUT" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),
        // updateComment: builder.mutation({
        //     query: ({ userid, data,seriid,id }) => ({ url: "comment/"+userid+"/"+seriid+"/"+id,data: data, method: "PUT" }),
        //     invalidatesTags: res => {
        //         return  res?.response?.comments
        //         ? [{type:"Comments", id: res.response.comments },{ type: "Comments",id: "LIST-COMMENTS" }]
        //         : [{ type: "Comments",id: "LIST-COMMENTS" }]
        //     }
        // }),
        deleteComment: builder.mutation({
            query: ({ id, userid, seriid }) => ({ url: "comment/"+id+"/"+userid+"/"+seriid+"/destroy",method: "DELETE" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),

         // admin
         findAllComment_:  builder.query({
            query: ({ restores, page, search, perPage}) => {
                const restore = restores ? "restore": ""
                return { url: "comments?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }

            },
            providesTags: res => {
                return res?.response?.comments.length != 0 ? res?.response.comments.map(e=> ({ type: "Comments", id: e.id },{ type: "Comments", id: "LIST-COMMENTS" }))
                : [{ type: "Comments", id: "LIST-COMMENTS" }]
            }
        }),
        findOneComment_: builder.query({
            query: ({ id }) => ({ url: "comments/"+id,method: "GET" }),
            providesTags: res => {
                return res?.response  ? [{ type: "Comments", id: res.response.id },{ type: "Comments", id: "LIST-COMMENTS" }]
                : [{ type: "Comments", id: "LIST-COMMENTS" }]
            }
        }),
        updateComment_: builder.mutation({
            query: (data) => ({ url: "comments",data: data, method: "PUT" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),
       
        restoreAllComment_: builder.mutation({
            query: (data) => ({ url: "comments/restore",data: data ,method: "PUT" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),
      
        deleteAllComment_: builder.mutation({
            query: ({  id ,permanent }) => ({ url: "comments/destroy"+permanent, data: { id: id },method: "DELETE" }),
            invalidatesTags: [{ type: "Comments", id: "LIST-COMMENTS" }]
        }),
    })
})

export const {
    useFindAllCommentQuery,
    useFindOneCommentQuery,
    useStoreCommentMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
    useCountCommentMutation,

    useFindAllComment_Query,
    useFindOneComment_Query,
    useUpdateComment_Mutation,
    useDeleteAllComment_Mutation,
    useRestoreAllComment_Mutation
} = apiComment