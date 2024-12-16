import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFile, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Modal from "../components/Modal_"
import ErrorMsg from './ErrorMsg'
import { useDispatch } from 'react-redux'
import { useUpdateProfileMutation } from '../features/api/apiProfileSlice'
import { setToken } from '../features/authSlice'
import { setMessage } from '../features/profileSlice'
const FormInputProfileModal = ({ username, input, setInput, showModal, setShowModal }) => {
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdateProfileMutation()
    const dispatch = useDispatch()
    const ModalTitle = () =>  <span className="px-2"><FontAwesomeIcon icon={faFileUpload}/> Upload Profile</span>

    const handleChangeInputFile = (e) => {
        e.preventDefault()

        const files = e.target.files[0]
        const reader = new FileReader
        let profile
        let profileUrl
        let error

        if(files?.size > 1*1000*1000){
            error = {
                poster: "File yang di upload terlalu besar!"
            }
            profile = "default.png"
            profileUrl = "http://localhost:8000/profile/default.jpg"
            setInput(prev => ({...prev, profile,profileUrl,error}))

        }else{
            const err = input.error
            profile = files
            error = { ...err, profileUrl: null }
            reader.addEventListener("load", () => {
                profileUrl = reader.result
                setInput(prev => ({...prev, profile,profileUrl,error}))
                handleUpdateProfile({...input, profile})
            })
            if(files) reader.readAsDataURL(files)
        }  
    }


    const handleUpdateProfile = async (form) => {
        const res = await update({ data: form, username }).unwrap()
        dispatch(setToken(res.response))
        setInput({ ...form, profileUrl: res.response.users.UsersDetail.profileUrl ,error: null })
        
        dispatch(setMessage(res.message))
        setShowModal(false)
    }
    
    return (
        <> 
            <Modal type="md" title={<ModalTitle />}  button={""} setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                <div className="w-full mb-1 p-4 h-auto">
                    <div className="mb-0">
                        <label htmlFor="profile" className="text-gray-700"><FontAwesomeIcon icon={faFile} /> Profile</label>
                        <input 
                            onChange={(e) => handleChangeInputFile(e)}
                            type="file" 
                            name="profile" 
                            id="profile"  
                            className="p-1 text-gray-700 w-full border border-gray-300 rounded mt-2" />
                            <ErrorMsg message={input?.error?.poster} />
                    </div>
                </div>
            </Modal>
        </>
    ) 
}

export default FormInputProfileModal