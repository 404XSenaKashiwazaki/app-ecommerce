import { faEnvelope, faMessage, faPaperPlane, faReply, faTrash, faUser, faUserCircle, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Modal from "../components/Modal_"
import { useState } from 'react'
import { useEffect } from 'react'
import ErrorMsg from './ErrorMsg'
import { useDispatch, useSelector } from 'react-redux'
import { useFindAllContactOrdersQuery, useStoreContactOrdersMutation } from '../features/api/apiContactOrdersSlice'
import TimeAgo from '../components/TimeAgo'
import { removeMessage, setMessage } from "../features/contactOrdersSlice"
import { Toast } from '../utils/sweetalert'


const ContactModal = ({ title,id,itemContact,showModal, setShowModal }) => {

    const { dataUser } = useSelector(state=> state.auth)
    const selector = useSelector(state=>state.contactOrders)
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ error: null, ...itemContact })
    const { data } = useFindAllContactOrdersQuery({ transactionid: id },{ skip: (id) ? false : true })
    const [ sendContact ] = useStoreContactOrdersMutation()
    const {  message } = selector
    
    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message ])

    const ModalTitle = () =>  <span className="px-2"><FontAwesomeIcon icon={faMessage}/> { title } </span>

    const handleClickSend = async (e) => {
        try {
            const res = await sendContact({ data: { contacts: form } }).unwrap()
            setForm(prec=> ({...prec, content: "", error: null}))
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error)
            const inpt = form
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err,errIndex) => {
                    const name = err.param.match(/\.([A-Za-z]+)/)[1]
                    inpt.error = { [name]: err.msg }
                })
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    return (
        <> 
            <Modal mt="mt-10" type="md" title={<ModalTitle />}  button="" setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                <div className="w-full mt mb-1 p-4 h-auto">
                    <div className="w-full mt-0 text-slate-500 bg-slate-50 px-5 py-5 h-50 max-h-[240px] overflow-auto">
                    {/*  */}
                    { data?.response?.contacts && data.response.contacts.map(c=> {
                        return (
                            <div key={c.id} className="mb-3">
                                
                                <div className={`${c.email == dataUser.email ? `flex flex-col gap-1 items-end` : `mt-0 mb-0 flex items-start flex-col` }`}>
                                    <div
                                        className="flex gap-1">
                                        {/* <img src={c.Order.User.UsersDetail.profileUrl} className="w-5 h-5 rounded-full"/>  */}
                                        <img src={ c.profileUrl} className="w-5 h-5 rounded-full"/> 
                                        <p className="text-md font-semibold">{ c.username  }</p>
                                    </div>
                                    <p className={`w-auto font-light text-sm ${(c.email == dataUser.email) ? `bg-cyan-100 ` : `bg-slate-200`} text-slate-500 py-2 px-5`}>{ c.content  || ""}</p>
                                    <div className="text-xs flex justify-end px-2">
                                        <TimeAgo date={c?.createdAt}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })  }
                    {/*  */}
                </div>
                </div>
                <div className="px-4">
                    <div className="w-full mb-0">
                        <textarea  onChange={handleChange} value={form.content} name="content" id="content" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Tulis pesan"/>
                        <ErrorMsg message={form.error?.content || ""} />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleClickSend}
                            className='
                            bg-sky-800 px-5 py-1 rounded-sm 
                            border-0 text-slate-300  w-auto 
                            h-auto text-sm  
                            font-medium text-center hover:bg-sky-900
                            hover:text-slate-200'
                            ><FontAwesomeIcon icon={faPaperPlane} /> Kirim</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ContactModal