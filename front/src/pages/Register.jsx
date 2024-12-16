import React, {  useEffect, useState } from 'react'
import {  Link, useNavigate } from "react-router-dom"
import jwt from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setRemoveState, setToken, setUser, tokenSelector } from "../features/authSlice"
import { useLoginMutation } from '../features/api/apiAuthSlice'
import { Toast } from '../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faCoffee,faSignIn,faRegistered, faSignInAlt, faKey, faVoicemail, faMailBulk, faEnvelope, faLockOpen, faLock, faUserLock, faUserPlus, faTriangleExclamation, faSave, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons'
  import { Helmet } from 'react-helmet'
  
function Login() {
    const [value,setValue] = useState([])
    const [msg,setMsg] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login,{ isLoading, isError, error, isSuccess }]= useLoginMutation()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)

    const handleInput = (e) => {
        setValue(prev => { return {...prev,[e.target.name] : e.target.value} })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await login(value).unwrap()
            const tokens = jwt(response.accessToken) 
            dispatch(setMessage("Selamat datang " + tokens.fullname))
            dispatch(setToken(response))
            tokens.roles.map((t)=>{                
                if(t.name.trim().toLowerCase().includes("admin","penulis")){
                    navigate("/api/dashboard")
                }else{
                    navigate("/")
                    console.log("gome")
                }
            })
        } catch (error) {
            console.log(error)
            if(error?.data?.errors && error?.data?.errors.length != 0) setMsg(error?.data?.errors)
        }
    }

    useEffect(() => {
        if(!token && message) Toast.fire({ text: message,icon: "success" }) 
    },[message])
    const LoginButton = () =>  <FontAwesomeIcon icon={faSignIn} values='Login' />
    return (
    <div className="h-screen w-full container mx-auto p-5 ">
        <div className="flex justify-center w-full">
            <div className={`w-full mx-10 md:w-[700px]  ${msg ? "mt-3" : "mt-16"} `}>
            <h1 className="font-bold text-2xl text-center"> <span className="flex justify-center gap-2"><FontAwesomeIcon  icon={faUserPlus} values='Login' /> Daftar</span> </h1>
               <div className="mb-5">
                {
                    msg && msg.map((e,i) => <div key={i} className="bg-red-800 p-3 mb-1  text-slate-200 "><span className=""><span><FontAwesomeIcon  icon={faTriangleExclamation} /> {e.msg}</span></span></div> )
                }
               </div>
            <div className="shadow-2xl border-0 rounded-sm bg-slate-100 p-5 h-auto overflow-hidden">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div className="bg-slate-100 mb-5 flex-initial w-full md:w-[50%]">
                    <label htmlFor="fullname"><span><FontAwesomeIcon  icon={faUser} values='Login' /> Nama</span></label>
                    <input type="text" placeholder="Masukan nama anda" onChange={handleInput} name="fullname" id="fullname" className="border-0 w-full" />
                </div>
                <div className="bg-slate-100 mb-5 w-full md:w-[50%]">
                    <label htmlFor="email"><span><FontAwesomeIcon  icon={faEnvelope} values='Login' /> Email</span></label>
                    <input type="email" placeholder="Masukan email anda" onChange={handleInput} name="email" id="email" className="border-0 w-full" />
                </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div className="bg-slate-100 mb-5 flex-initial w-ful  md:w-[50%]">
                    <label htmlFor="password"><span><FontAwesomeIcon  icon={faLock} values='Login' /> Password</span></label>
                    <input type="password" placeholder="******" onChange={handleInput} name="password" id="password" className="border-0 w-full" />
                </div>
                <div className="bg-slate-100 mb-5 w-full  md:w-[50%]">
                    <label htmlFor="konf_password"><span><FontAwesomeIcon  icon={faLock} values='Login' /> Konfirmasi Password</span></label>
                    <input type="password" placeholder="******" onChange={handleInput} name="konf_password" id="konf_password" className="border-0 w-full" />
                </div>
                </div>
                <div className="bg-slate-100 mb-3 mt-10 flex justify-normal gap-1">
                    <button type="submit" className="bg-blue-800 rounded-sm 
                    border-0 text-slate-300  mr-1
                    text-sm w-auto px-5 py-1 h-10
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200"> {isLoading ? <span><FontAwesomeIcon  icon={faSpinner} values='Login' /></span> : <span><FontAwesomeIcon  icon={faPaperPlane} values='Login' /> Daftar</span>} </button>
                    <Link to={"/api/login"}>
                    <button type="button" className="bg-cyan-800  rounded-sm 
                    border-0 text-slate-300 
                    text-sm w-auto px-5 py-1 h-10
                    font-medium text-center hover:bg-cyan-900
                    hover:text-slate-200 "> <span><FontAwesomeIcon  icon={faSignInAlt} values='Login' /> Login</span> </button>   
                    </Link>
                </div>
            </form>
            </div>
            </div>
        </div>
    </div>
    )
}

export default Login