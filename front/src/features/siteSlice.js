import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    site: null,
    message: null,
    options: [],
}

export const siteSlice = createSlice({
    name: "sites",
    initialState,
    reducers: {
        resetState: (state) => {
            state.options = []
            state.checkedId = []
            state.isRestore = false
            state.message = null
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
        setIsRestore: (state, action) => {
            state.isRestore = action.payload
        },
        setOptions: (state,action) => {
            state.options = action.payload
        },
        setSites: (state,action) => {
            state.site = action.payload
        },
    },
    extraReducers: _ =>{
    }
})

export const {
  resetState,
  removeMessage,
  setMessage,
  setOptions,
  setIsRestore,
  setSites
} = siteSlice.actions

export default siteSlice.reducer