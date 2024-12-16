import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthQuery, } from './features/api/apiAuthSlice'
import { messageSelector, setMessage, tokenSelector, } from './features/authSlice'
import jwt from "jwt-decode"
import { inPath } from './utils/Utils'

function AuthorizationFront() {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const dispatch = useDispatch()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)
    const { dataUser } = useSelector(stat=>stat.auth)
    const { data, isLoading, isError, error, isSuccess } = useAuthQuery()
    const currentPath = pathname.split("/")[1]

    useEffect(() => {
        if(inPath(["cart","orders","profile","order","checkouts"],currentPath)){
            if(!data && isLoading == false) navigate("/login")
        }        
    },[ token, data, navigate ])
    
    if(isLoading) return (<></>)
    
    return <Outlet />
}

export default AuthorizationFront