import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    isRestore: JSON.parse(localStorage.getItem("cms_contacts_isrestore")) || false,
    message: null,
    checkedId: []
}

export const contactSlice = createSlice({
    name: "contacts",
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
} = contactSlice.actions

export default contactSlice.reducer