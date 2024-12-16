import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
}

export const contactOrdersSlice = createSlice({
    name: "contactOrders",
    initialState,
    reducers: {
        resetState: (state) => {
            state.message = null
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
    },
    extraReducers: _ =>{
    }
})

export const {
  resetState,
  removeMessage,
  setMessage,
} = contactOrdersSlice.actions

export default contactOrdersSlice.reducer