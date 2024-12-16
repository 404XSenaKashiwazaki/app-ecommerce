import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: "profile",
    initialState: { message: null },
    reducers: {
        setMessage: (state,action) => {
            state.message = action.payload
        },
        removeMessage: (state) => {
            state.message = null
        }
    }
})

export const { 
    setMessage,
    removeMessage
} =  profileSlice.actions

export default profileSlice.reducer