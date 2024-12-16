import { faEnvelope, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { faLock, faSignInAlt, faSpinner, faTriangleExclamation, faUser, faUserLock, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import {  Link, useNavigate } from "react-router-dom"
import jwt from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setRemoveState, setToken, setUser, tokenSelector } from "../features/authSlice"
import { useLoginMutation, useDaftarMutation } from '../features/api/apiAuthSlice'
import { Toast } from '../utils/sweetalert'

const ModalFront = () => {
    const [msg,setMsg] = useState(null)
    const [ type, setType ] = useState("login")
    const [ value,setValue] = useState([])
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)
    const dispatch = useDispatch()
    const [ login,{ isLoading, isError, error, isSuccess }]= useLoginMutation()
    const [ daftar,{ isLoading: isLoadingDaftar, isError: isErrorDaftar, error: errorDaftar, isSuccess: isSuccessDaftar }]= useDaftarMutation()
    
    const handleInput = (e) => {
        setValue(prev => { return {...prev,[e.target.name] : e.target.value} })
    }

    const handleClickBtn = async (type) => {
        try {
            const { response } = type == "login" ? await login(value).unwrap() : await daftar(value).unwrap()
            const tokens = jwt(response.accessToken) 
            dispatch(setToken(response))
            dispatch(setUser(tokens))
            setMsg(null)
            dispatch(setMessage("Selamat datang " + tokens.fullname))
            document.getElementById('login').close()
        } catch (error) {
            console.log(error)
            if(error?.data?.errors && error?.data?.errors.length != 0) setMsg(error?.data?.errors)
        }
    }

    useEffect(() => {
        if(token && message) Toast.fire({ text: message,icon: "success" }) 
    },[message])

    useEffect(() => {
        setMsg(null)
    },[type])

    return (
        <>
         <dialog id="login" className="modal">
            <div className="modal-box p-3 bg-indigo-950 shadow-2xl mb-5">
            <div className="p-1 m-4">
            <h1 className="font-bold text-2xl  text-slate-50"> 
                { type == "daftar" ? <span className="flex gap-2"><FontAwesomeIcon  icon={faUserPlus} values='Login' /> Daftar</span> : <span className="flex gap-2"><FontAwesomeIcon  icon={faUserLock} values='Login' /> Masuk</span> }
            </h1>
            <div className={`${msg ? 'mb-2 mt-2': "mb-0"}`}>
                {
                    msg && msg.map((e,i) => <div key={i} className="bg-red-800 p-3 mb-1  text-slate-200 "><span className=""><span><FontAwesomeIcon  icon={faTriangleExclamation} /> {e.msg}</span></span></div> )
                }
               </div>
            </div>
               { type == "daftar" && (
                <div>
                    <div className="p-1 m-4">
                        <label htmlFor="username" className="text-slate-50"><FontAwesomeIcon icon={faUser} /> Username</label>
                        <input onChange={handleInput} type="text" name="username" id="username" placeholder="Username anda" className="input w-full bg-slate-950 text-slate-50" />
                    </div>
                    <div className="p-1 m-4">
                        <label htmlFor="fullname" className="text-slate-50"><FontAwesomeIcon icon={faUserCircle} /> Fullname</label>
                        <input onChange={handleInput} type="text" name="fullname" id="fullname" placeholder="Fullname anda" className="input w-full bg-slate-950 text-slate-50" />
                    </div>
                </div>
               ) }
                <div className="p-1 m-4">
                    <label htmlFor="email3" className="text-slate-50"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                    <input onChange={handleInput} type="email" name="email" id="email3" placeholder="Email anda" className="input w-full bg-slate-950 text-slate-50" />
                </div>
                <div className="p-1 m-4">
                    <label htmlFor="password" className="text-slate-50"><FontAwesomeIcon icon={faLock} /> Password</label>
                    <input onChange={handleInput} type="password" name="password" id="password" placeholder="*****" className="input w-full bg-slate-950 text-slate-50" />
                </div>
                { type == "daftar" && (
                <div className="p-1 m-4">
                     <label htmlFor="konf_password" className="text-slate-50"><FontAwesomeIcon icon={faLock} /> Konfirmasi Password</label>
                     <input onChange={handleInput} type="password" name="konf_password" id="konf_password" placeholder="*****" className="input w-full bg-slate-950 text-slate-50" />
                 </div>
                ) }
                <div className="p-1 mx-4 mt-7 mb-10 flex justify-start gap-1">
                    { type == "daftar" 
                        ? (
                            <div>
                            <button onClick={()=>{
                                handleClickBtn("daftar")
                                // setType("daftar")
                                // setMsg(null)
                            }} className="btn btn-sm btn-primary mr-1">{ isLoadingDaftar ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faUserPlus} /> Daftar</span> } </button>
                            <button onClick={()=>setType("login")} className="btn btn-sm btn-info"><span><FontAwesomeIcon icon={faSignInAlt} /> Masuk </span></button>
                            </div>
                        )
                        : (
                            <div>
                            <button onClick={()=>{
                                handleClickBtn("login")
                                // setType("login")
                                // setMsg(null)
                            }} className="btn btn-sm btn-primary mr-1">{ isLoading ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faSignInAlt} /> Masuk</span> } </button>
                                <button onClick={()=>setType("daftar")} className="btn btn-sm btn-info"><span><FontAwesomeIcon icon={faUserPlus} /> Daftar</span> </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
            </dialog>
        </>
    )
}

export default ModalFront