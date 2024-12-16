import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPaperPlane, faPlus, faPlusSquare, faRefresh, faReplyAll, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useFindOneContact_Query, useUpdateContact_Mutation } from "../../features/api/apiContactSlice"
import { useEffect } from "react"
import { setMessage } from "../../features/contactSlice"
import Modal from "../../components/Modal_"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const dispatch = useDispatch()
    const { dataUser } = useSelector(state=> state.auth)
    const [ form, setForm ] = useState({ username: "", content: "", tanggapan: "", error: null })
    const { data } = useFindOneContact_Query({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateContact_Mutation()

    useEffect(() => {
        if(data?.response?.contacts) setForm({
            ContactId: data.response.contacts.id,
            username: data.response.contacts.username,
            content: data.response.contacts.content,
            tangapan: "",
            error: null
        })
    },[ data ])

    const handleChange = (e) => {
        e.preventDefault()
        const { name,value } = e.target
        setForm(prev => ({ ...prev, [name]: value}))
    }

    
    const handleClickSave = async () => {
        try {
            console.log({ form });
            
            const res = await update({id, data: {
                email: dataUser.email, username: dataUser.username, content: form.tanggapan,UserId: dataUser.id, ContactId: form.ContactId
            } }).unwrap()
            dispatch(setMessage(res?.message))
            
            setShowModal(false)
        } catch (error) {
            console.log({error});
            
            const inpt = form
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err) => {
                    inpt.error = { [err.param]: err.msg  }
                
                })
            }
            setForm({ ...inpt})
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        setForm(prev=> ({ ...prev, tanggapan: "", error: null }))
    }

    const ButtonModal = () => {
        return (
            <div>
            <button 
                type='button'
                onClick={handleClickReset}
                className='
                bg-red-800 py-1 px-2 rounded-sm 
                border-0 text-white
                h-auto text-sm w-auto
                font-medium text-center hover:bg-red-900 mr-1'
                > <span><FontAwesomeIcon icon={faRefresh} /> Reset</span> 
            </button>
            <button 
                type='button'
                onClick={handleClickSave}
                className='
                bg-blue-800 py-1 px-2 rounded-sm 
                border-0 text-white
                h-auto text-sm w-auto
                font-medium text-center hover:bg-blue-900 mr-1'
                > { (loadingUpdate) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Kirim</span> }
            </button>
            </div>
        )
    }

    const ModalTitle = () => {
        return <span> <FontAwesomeIcon icon={faReplyAll}/> Tanggapi </span>
    }

    if(!dataUser) return <></>
    return (
        <> 
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 
            <div className={`w-full`}>
            <div className="w-full mb-2">
                <label htmlFor="username" className="font-semibold">Username</label>
                <input type="text" readOnly onChange={(e) => handleChange(e)} value={form.username} name="username" id="username" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Username"/>
                <ErrorMsg message={form.error?.username || ""} />
            </div>
            
            <div className="w-full my-2">
                <label htmlFor="content" className="font-semibold">Content</label>
                <textarea readOnly onChange={(e) => handleChange(e)} value={form.content} name="content" id="content" className="w-full min-h-[100px] border-slate-600 rounded-sm" placeholder="Content"/>
                <ErrorMsg message={form.error?.content || ""} />
            </div>
            <div className="w-full my-2">
                <label htmlFor="tanggapan" className="font-semibold">Tanggapan</label>
                <textarea  onChange={(e) => handleChange(e)} value={form.tanggapan} name="tanggapan" id="tanggapan" className="w-full h-32 border-slate-600 rounded-sm" placeholder="Masukan Tanggapan"/>
                <ErrorMsg message={form.error?.tanggapan || ""} />
            </div>
        </div>
        </div>
        </Modal>
        </>
    ) 
}

export default Form