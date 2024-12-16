import React from 'react'
import Modal from "../components/Modal_"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRemoveProfileMutation } from '../features/api/apiProfileSlice'
import { setToken } from '../features/authSlice'
import { setMessage } from '../features/profileSlice'
import { useDispatch } from 'react-redux'


const AlertProfileRemove = ({ username, input, setInput, showModal, setShowModal }) => {
    const dispatch = useDispatch()
    const [ remove, { data: dataUpdate, isError,isLoading,error } ] = useRemoveProfileMutation()
    const ModalTitle = () =>  <span className="px-2"><FontAwesomeIcon icon={faTrash}/> Hapus Profile</span>
    const ModalButton = () => <div className="flex gap-1">
            <button
                onClick={handleRemoveProfile}
                disabled={input.profile == "default.jpg" ? true : false }
                className={`mt-4 w-auto px-4 py-1 bg-red-700 text-white  rounded-sm font-bold text-sm hover:bg-red-600 transition ${ input.profile == "default.jpg" && `cursor-not-allowed` }`}>
                Hapus
            </button> 
            <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-auto px-4 py-1 bg-slate-700 text-white  rounded-sm font-bold text-sm hover:bg-slate-600 transition">
                Batal
            </button>
    </div>
    const handleRemoveProfile = async e => {
        e.preventDefault()
        try {
            const data = { 
                id: input.id, 
                profile: "default.jpg",
                profileUrl: "http://localhost:8000/profile/default.jpg",  
                profileOld: input.profile,
                profileUrlOld: input.profileUrl,
            }
            console.log({ data });
            
            const res = await remove({ data, username }).unwrap()
            dispatch(setToken(res.response))
            dispatch(setMessage(res.message))
            setShowModal(false)
        } catch (error) {
            console.log(error)
            
        }
    }

    return (
        <> 
            <Modal type="sm" title={<ModalTitle />}  button={<ModalButton />} setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                <div className="w-full mb-1 p-4 h-auto">
                    <p className="text-red-600 uppercase text-sm font-bold"> Anda yakin akan menghapus foto profile?</p>
                </div>
            </Modal>
        </>
    ) 
}

export default AlertProfileRemove