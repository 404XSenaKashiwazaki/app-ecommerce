import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuthQuery, } from './features/api/apiAuthSlice'
import { messageSelector, setMessage, tokenSelector, } from './features/authSlice'

function Authorization() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector(tokenSelector)
    const message = useSelector(messageSelector)
    const { dataUser } = useSelector(stat=>stat.auth)
    const { data, isLoading, isError, error, isSuccess } = useAuthQuery()
    useEffect(() => {
        if(dataUser) {
            const role =dataUser.roles.map(e=>e.name.toLowerCase())
            if(role.length == 1 && role.includes("user")) navigate("/")
        }
    }, [ message, dispatch, dataUser, token])

    useEffect(() => {
        if(!token && isError) navigate("/login")
    },[data, isError, isSuccess])
    

    if(isLoading) return (<></>)
    if(token) return <Outlet />
}

export default Authorization