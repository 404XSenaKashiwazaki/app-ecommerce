import { faGoogle, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {  Link, useLocation, useNavigate, useParams } from "react-router-dom"
import jwt from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, setMessage, setToken, tokenSelector } from "../../features/authSlice"
import { useAuthVerifyEmailMutation } from '../../features/api/apiAuthSlice'
import { Toast } from '../../utils/sweetalert'
import { faSignInAlt, faEnvelope, faLock,  faSpinner, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons'
import ErrorMsg from "../../components/ErrorMsg"

const VerifyEmail = ({ site }) => {
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const verifyToken = queryParams.get('token')    
    const [ data, setData ] = useState(null)
    const [value,setValue ] = useState({
        password: "",
        konf_password: "",
        error: null
    })
    const [msg,setMsg] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ verifyEmail, { isLoading } ] = useAuthVerifyEmailMutation()
    const message = useSelector(messageSelector)

    useEffect(() => {
        if(message) Toast.fire({ text: message,icon: "success" }) 
        console.log(message)
    },[message,dispatch])

    useEffect(() =>{
        if(!verifyToken) {
            dispatch(setMessage("Tidak ada token verifikasi"))
            navigate("/register")
        }
        if(verifyToken) {
            const decode = jwt(verifyToken)
            if(!decode){
                setMsg("Token Verifikasi email tidak valid")
            }else{
                setData({...decode})
            }
        }
    },[verifyToken])

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await verifyEmail({ token: verifyToken }).unwrap()
            setMsg(null)
            dispatch(setMessage(res.message))
            navigate("/login")
        } catch (error) {
            console.log(error)
            const input = value
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
                input.error = []
                if(e?.param) {
                    const name = e?.param?.match(/([A-Za-z]+_[A-Za-z]+|[A-Za-z]+)/)[0]
                    msg.push(e?.msg)
                    input.error = { [name.toLowerCase()]: [...new Set(msg)] }
                }else{
                    input.error = null
                    setMsg(e.msg)
                }
            })
            setValue(prev=>({...prev, error: input.error}))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <Helmet >
                <title>{ site } - Verifikasi Email</title>
            </Helmet>
        <div className="bg-white p-0 rounded-lg shadow-lg max-w-md w-full relative">
            { msg && <div  className="bg-red-800 absolute -top-12 text-slate-200 my-1 px-2 py-1 text-sm  font-medium w-full">{ msg }!</div> }
            <div className="p-8 m-0">
            <h2 className="text-2xl font-bold text-center mb-6">Verifikasi Email</h2>
            {/* <p className="font-medium text-md ">{ data?.email }</p> */}
            <div className="flex items-center justify-center">
                <button
                    onClick={handleLogin}
                    disabled={isLoading ? true : false}
                    className={`bg-gradient-to-r ${isLoading ? `cursor-not-allowed` : `cursor-pointer`} w-full from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
                    {isLoading ? <span><FontAwesomeIcon  icon={faSpinner} values='...' /></span> : <span><FontAwesomeIcon  icon={faEnvelopeCircleCheck}  /> Verifikasi</span>}
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default VerifyEmail
