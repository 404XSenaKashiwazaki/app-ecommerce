import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: localStorage.getItem("package") ? JSON.parse(localStorage.getItem("package")) : null,
    checkedId: [],
    quantity: localStorage.getItem("package") ? JSON.parse(localStorage.getItem("package")).orders.orders_item.length : 0
}

export const packageSlice = createSlice({
    name: "packaged",
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
            localStorage.setItem("package",JSON.stringify(action.payload))
        },
        setRemoveOption: (state) => {
            localStorage.clear("package")
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
} = packageSlice.actions

export default packageSlice.reducer