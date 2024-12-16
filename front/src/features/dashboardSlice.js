import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
}

export const sendEmailsSlice = createSlice({
    name: "sendEmails",
    initialState,
    reducers: {
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        }
    },
    extraReducers: _ =>{
    }
})

export const {
    removeMessage,
    setMessage,
} = sendEmailsSlice.actions

export default sendEmailsSlice.reducer