import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    modalShow: false,
    modalContent: null,
    modalData: null,
    modalId: null,
    modalDataId: null,
    modalSuccessAction: false
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: ({
        setModalShow(state){
            state.modalShow = true
        },
        setModalClose(state){
            state.modalShow = false
            state.modalId = null
            state.modalDataId = null
        },
        setModalContent(state,action){
            state.modalContent = action.payload
        },
        setModalId(state,action) {
            state.modalId = action.payload
        },
        setModalDataId(state,action) {
            state.modalDataId = action.payload
        },
        setModalSuccessAction(state, action){
            state.modalSuccessAction = action.payload
        }
    })
})

export const { 
    setModalShow,
    setModalClose,
    setModalContent,
    setModalId, 
    setModalSuccessAction,
    setModalDataId,
} = modalSlice.actions

export const selectorModal = state => state.modal
export default modalSlice.reducer