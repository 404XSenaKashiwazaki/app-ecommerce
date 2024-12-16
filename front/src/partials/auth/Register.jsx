import React, {  useEffect, useState } from 'react'
import {  Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setRemoveState, setToken, setUser, tokenSelector } from "../../features/authSlice"
import { useDaftarMutation } from '../../features/api/apiAuthSlice'
import { Toast } from '../../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee,faSignIn,faRegistered, faSignInAlt, faKey, faVoicemail, faMailBulk, faEnvelope, faLockOpen, faLock, faUserLock, faUserPlus, faTriangleExclamation, faSave, faPaperPlane, faUser, faUserCheck, faUserCog, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'
import ErrorMsg from "../../components/ErrorMsg"
import { Helmet } from 'react-helmet'

  function Register({ site }) {
    const [value,setValue] = useState({
        namaDepan:"",
        namaBelakang: "",
        username: "",
        email: "",
        password: "",
        konf_password: "",
        error: null
    })
    const [msg,setMsg] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [register,{ isLoading, isError, error, isSuccess }]= useDaftarMutation()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)

    const handleInput = (e) => {
        setValue(prev => { return {...prev,[e.target.name] : e.target.value} })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            console.log({ value });
            
            const res = await register(value).unwrap()
            dispatch(setMessage(res.message))
            navigate("/login")
        } catch (error) {
            console.log(error)
            const inpt = value
            if(error?.data?.errors && error?.data?.errors.length != 0) {
                error.data.errors.forEach((err,errIndex) => {
                    const name = err.param
                    if(name) inpt.error = { [name]: err.msg }
                    if(!name) setMsg(err.msg)
                })
                
                
            }
            console.log(value);
            setValue(prev=>({...prev, error: inpt.error}))
        }
    }

    useEffect(() => {
        if(!token && message) Toast.fire({ text: message,icon: "success" }) 
        if(msg)  Toast.fire({ text: msg,icon: "error" }) 
        setMsg("")
    },[message,msg])
    const LoginButton = () =>  <FontAwesomeIcon icon={faSignIn} values='Login' />
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <Helmet >
                <title>{ site } - Register</title>
            </Helmet>
        <div className="bg-white mx-3 p-8 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Daftar </h2>
            <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="namaDepan">
                        <FontAwesomeIcon  icon={faUser} /> Nama Depan
                    </label>
                    <input
                        name="namaDepan"
                        onChange={handleInput}
                        id="namaDepan"
                        type="text"
                        placeholder="Masukan nama depan"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.namaDepan || ""} />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="namaBelakang">
                        <FontAwesomeIcon  icon={faUser} /> Nama Belakang
                    </label>
                    <input
                        name="namaBelakang"
                        onChange={handleInput}
                        id="namaBelakang"
                        type="text"
                        placeholder="Masukan nama belakang"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.namaBelakang || ""} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
                        <FontAwesomeIcon  icon={faUserCog} /> Username
                    </label>
                    <input
                        name="username"
                        onChange={handleInput}
                        id="username"
                        type="text"
                        placeholder="Masukan username"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.username || ""} />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
                        <FontAwesomeIcon  icon={faEnvelope} /> Email
                    </label>
                    <input
                        name="email"
                        onChange={handleInput}
                        id="email"
                        type="email"
                        placeholder="Masukan email"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.email || ""} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
                        <FontAwesomeIcon  icon={faLock}  /> Password
                    </label>
                    <input
                        name="password"
                        onChange={handleInput}
                        id="password"
                        type="password"
                        placeholder="********"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.password || ""} />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="konf_password">
                        <FontAwesomeIcon  icon={faLock}  /> Konfirmasi Password
                    </label>
                    <input
                        name="konf_password"
                        onChange={handleInput}
                        id="konf_password"
                        type="password"
                        placeholder="********"
                        className="w-full px-3 py-1 text-gray-700 border rounded-sm focus:outline-none focus:ring focus:ring-purple-500"
                    />
                    <ErrorMsg message={value.error?.konf_password || ""} />
                </div>
            </div>
            <div className="flex items-center justify-center mt-3">
                <button
                    onClick={handleRegister}
                    disabled={isLoading ? true : false}
                    className={`bg-gradient-to-r ${isLoading ? `cursor-not-allowed` : `cursor-pointer`} w-full from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
                    {isLoading ? <span><FontAwesomeIcon  icon={faSpinner} values='...' /></span> : <span><FontAwesomeIcon  icon={faUserPlus} values='Login' /> Daftar</span>}
                </button>
            </div>
            <div className="text-center text-gray-500 mt-1">Or</div>
            <div className="flex justify-center mt-1 space-x-4">
                <Link to={`http://localhost:8000/api/auth/google`}
                    className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faGoogle} />
                </Link>
            </div>
            <div className="flex justify-center gap-1 mt-2">
            <div className="text-center text-gray-500 mt-0">Sudah punya akun?</div>
                <Link to={`/login`} className="text-purple-500 hover:underline">
                    Masuk
                </Link>
            </div>
        </div>
        </div>
    )
}

export default Register