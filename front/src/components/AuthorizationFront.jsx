import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuthQuery, } from './features/api/apiAuthSlice'
import { messageSelector, tokenSelector, } from './features/authSlice'
import { Toast } from './utils/sweetalert'


function AuthorizationFront() {
    const navigate = useNavigate()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)
    const { data, isLoading, isError, error, isSuccess } = useAuthQuery()
  
    useEffect(() => {
        if( isSuccess && message && token){
            Toast.fire({ text: message, icon: "success"})
            console.log(dataUser);
            // localStorage.setItem("cms_users",{})
        }
    }, [ message, isSuccess ])

    return <Outlet />

 
}

export default AuthorizationFront