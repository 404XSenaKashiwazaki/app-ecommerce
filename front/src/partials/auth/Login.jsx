import { faGoogle, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {  Link, useNavigate } from "react-router-dom"
import jwt from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setToken, tokenSelector } from "../../features/authSlice"
import { useLoginMutation } from '../../features/api/apiAuthSlice'
import { Toast } from '../../utils/sweetalert'
import { faSignInAlt, faEnvelope, faLock,  faSpinner } from '@fortawesome/free-solid-svg-icons'
import ErrorMsg from "../../components/ErrorMsg"
import { Helmet } from "react-helmet"

const Login = ({ site }) => {
    const [value,setValue] = useState({
        email: "",
        password: "",
        error: null
    })
    const [msg,setMsg] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login,{ isLoading }]= useLoginMutation()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)

    useEffect(() => {
        if(!token && message) Toast.fire({ text: message,icon: "success" }) 
        if(msg)  Toast.fire({ text: msg,icon: "error" }) 
        setMsg("")
    },[message,dispatch,msg])

    const handleInput = (e) => {
        setValue(prev => { return {...prev,[e.target.name] : e.target.value} })
    }

    const handleLogin = async (e) => {
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
            const inpt = value
            if(error?.data?.errors && error?.data?.errors.length != 0) {
                error.data.errors.forEach((err,errIndex) => {
                    const name = err.param
                    if(name) inpt.error = { [name]: err.msg }
                    if(!name) setMsg(err.msg)
                })
                
                
            }
            setValue(prev=>({...prev, error: inpt.error}))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
        <Helmet >
            <title>{ site } - Login</title>
        </Helmet>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Login </h2>
            <div className="mb-4">
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
            <div className="mb-3">
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
                <div className="text-right mt-3">
                    <Link to={`/forgot-password`} className="text-sm text-purple-500 hover:underline">
                        Lupa password?
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button
                    onClick={handleLogin}
                    disabled={isLoading ? true : false}
                    className={`bg-gradient-to-r ${isLoading ? `cursor-not-allowed` : `cursor-pointer`}  w-full from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
                    {isLoading ? <span><FontAwesomeIcon  icon={faSpinner} values='...' /></span> : <span><FontAwesomeIcon  icon={faSignInAlt}  /> Masuk</span>}
                </button>
            </div>
            <div className="text-center text-gray-500 mt-1 text-sm">Or</div>
            <div className="flex justify-center mt-1 space-x-4">
                <Link to={`http://localhost:8000/api/auth/google`}
                    className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faGoogle} />
                </Link>
            </div>
            <div className="flex justify-center gap-1 mt-1">
            <div className="text-center text-gray-500 mt-0">Belum punya akun?</div>
                <Link to={`/register`} className="text-purple-500 hover:underline">
                    Daftar
                </Link>
            </div>
        </div>
        </div>
    )
}

export default Login
