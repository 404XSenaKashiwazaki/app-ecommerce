import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    search: ""
}

export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        resetSearch: (state) => {
            state.search = ""
        },
        setSearch: (state,action) => {
            state.search = action.payload
        },
    },
    extraReducers: _ =>{
    }
})

export const {
    setSearch,
    resetSearch,
} = homeSlice.actions

export default homeSlice.reducer