import { apiSlice } from "./apiSlice";

export const apiSliderSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findAllSliders: builder.query({
            query: ({ restores,search, page, perPage }) => {
                const restore = restores ? "restore" : ""
                return { url: "sliders?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.sliders.length > 0
                ? res.response.sliders.map(e=> ({ type: "Sliders", id: e.id },{ type: "Sliders", id: "LIST-SLIDERS" }))
                : [{ type: "Sliders", id: "LIST-SLIDERS" }]
            },
        }),
        findOneSliders: builder.query({
            query: ({ id }) => {
                return { url: `sliders/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.slider
                ? [ {type: "Sliders", id: res.response.slider.id},{ type: "Sliders", id:"LIST-SLIDERS" }] 
                : [{ type: "Sliders",id: "LIST-SLIDERS" }]
            }
        }),
        showSliders: builder.query({
            query: () => {
                return { url: "sliders-banners", method: "GET" }
            },
            providesTags: res => {
                return res?.response?.sliders.length > 0
                ? res.response.sliders.map(e=> ({ type: "Sliders", id: e.id },{ type: "Sliders", id: "LIST-SLIDERS" }))
                : [{ type: "Sliders", id: "LIST-SLIDERS" }]
            },
        }),
        findOneSliders: builder.query({
            query: ({ id }) => {
                return { url: `sliders/${id}`, method: "GET" }
            },
            providesTags: res => {
                return res?.response?.slider
                ? [ {type: "Sliders", id: res.response.slider.id},{ type: "Sliders", id:"LIST-SLIDERS" }] 
                : [{ type: "Sliders",id: "LIST-SLIDERS" }]
            }
        }),
        // multipel 
        storeMultipelSliders: builder.mutation({
            query(data){
                return { 
                    url:"sliders/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Sliders", id: "LIST-SLIDERS" }]
        }),
        updateMultipelSliders: builder.mutation({
            query(data){
                return { 
                    url:"sliders/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags: [{ type: "Sliders", id: "LIST-SLIDERS" }]
        }),
        restoreMultipelSliders: builder.mutation({
            query(data){
                return { 
                    url:"sliders/restore", 
                    method: "PUT", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "Sliders", id: "LIST-SLIDERS" }]
        }),
        destroyMultipelSliders: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"sliders/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags: [{ type: "Sliders", id: "LIST-SLIDERS" }]
        }),
    })
})

export const {
    useFindAllSlidersQuery,
    useFindOneSlidersQuery,
    useLazyFindAllSlidersQuery,
    useShowSlidersQuery,
    useStoreMultipelSlidersMutation,
    useUpdateMultipelSlidersMutation,
    useRestoreMultipelSlidersMutation,
    useDestroyMultipelSlidersMutation,

} = apiSliderSlice