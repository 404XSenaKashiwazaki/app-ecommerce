import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    isRestore: JSON.parse(localStorage.getItem("cms_sites_isrestore")) || false,
    site: null,
    message: null,
    options: [],
    checkedId: []
}

export const sitesSlice = createSlice({
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
        setCheckedId: (state,action) => {
            state.checkedId = action.payload
        },
        setSites: (state,action) => {
            console.log(action);
            state.site = action.payload
        },
    },
    extraReducers: _ =>{
    }
})

export const {
  resetState,
  removeMessage,
  setCheckedId,
  setMessage,
  setOptions,
  setIsRestore,
  setSites
} = sitesSlice.actions

export default sitesSlice.reducer