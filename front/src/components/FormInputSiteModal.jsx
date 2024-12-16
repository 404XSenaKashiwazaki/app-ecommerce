import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFile, faFileUpload, faImage, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Modal from "./Modal_"
import ErrorMsg from './ErrorMsg'
import { useDispatch } from 'react-redux'
import { setMessage } from '../features/profileSlice'
import { setOptions } from '../features/siteSlice'
import { useRemoveSiteLogoMutation, useUpdateSiteMutation } from '../features/api/apiSitesSlice'
const FormInputSiteModal = ({ type, input, setInput, showModal, setShowModal }) => {
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdateSiteMutation()
    const [ remove ] = useRemoveSiteLogoMutation()
    const dispatch = useDispatch()
    const ModalTitle = () =>  (type == "ganti") ? <span className="px-2"><FontAwesomeIcon icon={faFileUpload}/> Upload Logo</span> : <span className="px-2"><FontAwesomeIcon icon={faTrash}/> Hapus Logo</span>
    const ModalButton = () => <div className="flex gap-1"> 
        { (type == "ganti") ? (<button 
            onClick={() => handleSaveSiteImage()}
            className="px-4 bg-indigo-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                Simpan
        </button> ) : (<button 
            onClick={() => handleRemoveProfile()}
            disabled={ input.logo == "default.jpg" ? true : false }
            className={ `px-4 bg-red-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-red-600 transition ${ input.logo == "default.jpg" && `cursor-not-allowed` }` }>
                Hapus
        </button> ) }
        <button  
            onClick={() => { 
                setInput(prev => ({ ...prev, logo: prev.fileOld , logoPreview: prev.logoPreviewOld}))
                setShowModal(false)
            }}
            className="px-4 bg-slate-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-slate-600 transition">
                Batal
        </button> 
    </div>

    const handleChangeInputFile = (e) => {
        e.preventDefault()

        const files = e.target.files[0]
        const reader = new FileReader
        let logo
        let logoPreview
        let error
        // console.log(parseInt(files.size) > 1*1000*1000);
        if(files?.size > 1*1000*1000){
        error = {
            poster: "File yang di upload terlalu besar!"
        }
            logo = "http://localhost:8000/site/default.png"
            logoPreview = "http://localhost:8000/site/default.png"
            setInput(prev => ({...prev, logoPreview,logo, error}))
        }else{
            const err = input.error
            logo = files
            error = { ...err, logo: null }
            reader.addEventListener("load", () => {
                logoPreview = reader.result
                setInput(prev => ({...prev, logoPreview, logo, error}))
            })
            if(files) reader.readAsDataURL(files)
        }  
    }


    const handleSaveSiteImage = async () => {
        try {
                console.log({ input});
                
                const res = await update({ data: input, id: input.id }).unwrap()
                dispatch(setOptions(res.response))
                dispatch(setMessage(res.message))
                setShowModal(false)
            } catch (error) {
                console.log(error);
                
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
                // input.error = []
                // const name = e.param.match(/([A-Za-z]+_[A-Za-z]+|[A-Za-z]+)/)[0]
                // console.log({name});
                
                // msg.push(e.msg)
                // input.error = { [name.toLowerCase()]: [...new Set(msg)] }
            })
    
            setInput(input)
            }
    }

    const handleRemoveProfile = async () => {
        try {
            const res = await remove({ data: {...input, logo: "default.jpg", logo_url: "http://localhost:8000/sites/default.jpg" }, id: input.id }).unwrap()
            dispatch(setMessage(res.message))
            setShowModal(false)
        } catch (error) {
            console.log(error)
            
        }
    }
    
    return (
        <> 
            <Modal type="sm" title={<ModalTitle />}  button={<ModalButton />} setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                { (type == "ganti") ? (<div className="w-full mb-1 p-4 h-auto">
                    <div className="mb-0">
                        <label htmlFor="profile" className="text-gray-700"><FontAwesomeIcon icon={faImage} /> Logo</label>
                        <input 
                            onChange={(e) => handleChangeInputFile(e)}
                            type="file" 
                            name="profile" 
                            id="profile"  
                            className="p-1 text-gray-700 w-full border border-gray-300 rounded mt-2" />
                            <ErrorMsg message={input?.error?.poster} />
                    </div>
                </div>) : (<div className="w-full mb-1 p-4 h-auto">
                    <p className="text-red-600 uppercase text-sm font-bold"> Anda yakin akan menghapus foto profile?</p>
                </div>) }
            </Modal>
        </>
    ) 
}

export default FormInputSiteModal