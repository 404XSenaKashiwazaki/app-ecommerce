import React, {  useEffect, useState } from 'react'
import {  Link, useNavigate } from "react-router-dom"
import jwt from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setToken, tokenSelector } from "../features/authSlice"
import { useLoginMutation } from '../features/api/apiAuthSlice'
import { Toast } from '../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignIn, faSignInAlt, faEnvelope, faLock, faUserLock, faUserPlus, faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
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
            const res = await login(value).unwrap()
            setMsg([])
            const tokens = jwt(res.response.accessToken) 
            dispatch(setMessage("Selamat datang " + tokens.username))
            dispatch(setToken(res.response))
            navigate(tokens.navigate)
        } catch (error) {
            console.log(error)
            if(error?.data?.errors && error?.data?.errors.length != 0) setMsg(error?.data?.errors)
        }
    }

    useEffect(() => {
        if(!token && message) Toast.fire({ text: message,icon: "success" }) 
        console.log(message);
    },[message,dispatch])

    return (
    <div className="h-screen w-full mx-auto bg-[#003276] min-h-screen z-30 overflow-hidden">
        <div className="flex justify-center w-full">
            <div className={`w-full mx-10 md:w-[400px] lg:w-[450px] xl:w-[500px]  ${msg ? "mt-16" : "mt-24"} `}>
            <h1 className="font-bold text-2xl text-center"> <span className="flex justify-center gap-2"><FontAwesomeIcon  icon={faUserLock} values='Login' /> Masuk</span> </h1>
            <div className="mb-5">
                {
                    msg && msg.map((e,i) => <div key={i} className="bg-red-800 p-3 mb-1  text-slate-200 "><span className=""><span><FontAwesomeIcon  icon={faTriangleExclamation} /> {e.msg}</span></span></div> )
                }
            </div>
            <div className="shadow-2xl border-0 rounded-sm bg-slate-100 p-9 h-auto overflow-hidden">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="bg-slate-100 mb-5">
                    <label htmlFor="username"><span><FontAwesomeIcon  icon={faEnvelope} values='Login' /> Username</span></label>
                    <input type="text" placeholder="Masukan Username anda" onChange={handleInput} name="username" id="username" className="border-0 w-full" />
                </div>
                <div className="bg-slate-100 mb-5">
                    <label htmlFor="password"><span><FontAwesomeIcon  icon={faLock} values='Login' /> Password</span></label>
                    <input type="password" placeholder="******" onChange={handleInput} name="password" id="password" className="border-0 w-full" />
                </div>
                <div className="bg-slate-100 mb-3 mt-10 flex justify-normal gap-1">
                    <button type="submit" className="bg-blue-800 rounded-sm 
                    border-0 text-slate-300  mr-1
                    text-sm w-auto px-5 py-1 h-10
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200"> {isLoading ? <span><FontAwesomeIcon  icon={faSpinner} values='Login' /></span> : <span><FontAwesomeIcon  icon={faSignInAlt} values='Login' /> Masuk</span>} </button>
                    <Link to={"/api/register"}>
                    <button type="button" className="bg-cyan-800  rounded-sm 
                    border-0 text-slate-300 
                    text-sm w-auto px-5 py-1 h-10
                    font-medium text-center hover:bg-cyan-900
                    hover:text-slate-200 "> <span><FontAwesomeIcon  icon={faUserPlus} values='Login' /> Daftar</span> </button>   
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