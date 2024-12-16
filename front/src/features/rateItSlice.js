import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: localStorage.getItem("rateIt") ? JSON.parse(localStorage.getItem("rateIt")) : null,
    checkedId: [],
    quantity: localStorage.getItem("rateIt") ? JSON.parse(localStorage.getItem("rateIt")).orders.orders_item.length : 0
}

export const rateItSlice = createSlice({
    name: "rateIt",
    initialState,
    reducers: {
        resetState: (state) => {
            state.options = []
            state.checkedId = []
            state.message = null
            state.quantity = 0
        },
        setQuantity: (state, action) => {
            state.quantity = action.payload
        },
        setJumlah: (state, action) => {
            state.quantity = action.payload
        },
        removeQuantity: (state) => {
            state.quantity = 0
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
        setOptions: (state,action) => {
            state.options = action.payload
            localStorage.setItem("rateIt",JSON.stringify(action.payload))
        },
        setRemoveOption: (state) => {
            localStorage.clear("rateIt")
            state.options = []
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
    setOptions,
    setRemoveOption,
    removeQuantity,
    setJumlah,
    setQuantity,
} = rateItSlice.actions

export default rateItSlice.reducer