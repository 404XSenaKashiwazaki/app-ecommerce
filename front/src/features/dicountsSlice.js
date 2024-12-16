import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    isRestore: JSON.parse(localStorage.getItem("cms_discounts_isrestore")) || false,
    message: null,
    checkedId: []
}

export const discountsSlice = createSlice({
    name: "discounts",
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
        setCheckedId: (state,action) => {
            state.checkedId = action.payload
        }
    },
    extraReducers: _ =>{
    }
})

export const {
  resetState,
  removeMessage,
  setCheckedId,
  setMessage,
  setIsRestore
} = discountsSlice.actions

export default discountsSlice.reducer