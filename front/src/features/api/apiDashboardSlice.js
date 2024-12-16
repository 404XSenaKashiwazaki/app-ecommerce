import {apiSlice} from "./apiSlice"

const apiDashboardSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        countAllUsers: builder.query({
            query: () => ({ url: "dashboard/count-users",method: "GET" })
        }),
        countAllPosts: builder.query({
            query: ({ type }) => ({ url: "dashboard/count/posts?type="+type,method: "GET" })
        }),
        countAllRoles: builder.query({
            query: () => ({ url: "dashboard/count/roles",method: "GET" })
        }),
        countAllComment: builder.query({
            query: () => ({ url: "dashboard/count/comment",method: "GET" })
        }),
        countAllContact: builder.query({
            query: () => ({ url: "dashboard/count/contact",method: "GET" })
        }),
        countAllInfo: builder.query({
            query: () => ({ url: "dashboards",method: "GET" })
        }),
    })
})

export const {
    useCountAllPostsQuery,
    useCountAllRolesQuery,
    useCountAllUsersQuery,
    useCountAllCommentQuery,
    useCountAllContactQuery,
    useCountAllInfoQuery
} = apiDashboardSlice