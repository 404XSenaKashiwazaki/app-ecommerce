import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    message: null,
    options: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")) : null,
    checkedId: [],
    quantity: localStorage.getItem("shoppingCart") ? JSON.parse(localStorage.getItem("shoppingCart")).orders.orders_item.length : 0,
    carts: [],
    totals: 0
}

export const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {
        resetState: (state) => {
            localStorage.clear("shoppingCart")
            state.options = []
            state.checkedId = []
            state.message = null
            state.quantity = 0
            state.carts = []
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
            localStorage.setItem("shoppingCart",JSON.stringify(action.payload))
        },
        setRemoveOption: (state) => {
            localStorage.clear("shoppingCart")
            state.options = []
        },
        setCheckedId: (state,action) => {
            state.checkedId = action.payload
        },
        setShoppingCarts: (state, action) => {
            state.carts = action.payload
        },
        resetShoppingCarts: state => {
            state.carts = []
        },
        setTotals: (state, action) =>{ state.total = action.payload },
        removeTotals: state => { state.total = 0 }
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
    setShoppingCarts,
    resetShoppingCarts,
    setTotals,
    removeTotals,
} = shoppingCartSlice.actions

export default shoppingCartSlice.reducer