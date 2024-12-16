import { faPowerOff, faSignInAlt, faSpinner, faUserAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { setRemoveState } from "../features/authSlice"
import { useAuthQuery, useLogoutMutation } from "../features/api/apiAuthSlice"
import { faUser } from "@fortawesome/free-regular-svg-icons"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const NavbarHome = ({ site }) => {
    const path =  location.pathname.split("/")
    const { data } = useAuthQuery()
    const [ logout, { isLoading, isSuccess, isError } ] = useLogoutMutation()
    const { dataUser } = useSelector(state=> state.auth)
    const { message } = useSelector(state => state.profile)

    const dispatch = useDispatch()

    const handleClickLogout = async () => {
        try {
            await logout().unwrap()
            dispatch(setRemoveState())
            console.log("logout");
            // navigate("/")
          } catch (error) {
            console.log(error)
          }
    }

    // console.log(path);
  
    // console.log(!["anime","episode","genre"].includes(path[1]));
    return (
        <div className="navbar bg-indigo-950 m-0 shadow-2xl text-slate-50 z-10 fixed top-0">
        <div className="flex-1 ">
          <span className="btn btn-ghost text-xl"><Link to={"/"}>{ site?.title || "" }</Link></span>
        </div>
        <div className="flex-none gap-2">
    
          <div className="form-control">
             <button className="btn btn-ghost btn-circle" onClick={()=>document.getElementById('my_modal_2').showModal()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>
          
            {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                { dataUser ? <img alt="Tailwind CSS Navbar component" src={dataUser.detailUser?.profileUrl} /> : <span onClick={()=>document.getElementById('login').showModal()}><FontAwesomeIcon  icon={faSignInAlt} /> </span> }
              </div>
            </div>
           { dataUser &&  <ul tabIndex={0} className="mt-3 z-[1] p-2 bg-indigo-950 shadow menu menu-sm dropdown-content text-slate-50 rounded-box w-52">
              <li>
                <span onClick={()=>document.getElementById('profile-modal').showModal()} className="justify-between">
                  
                  <span><FontAwesomeIcon icon={ faUserAlt } /> Profile</span>
                  {/* <span className="badge">New</span> */}
                </span>
              </li>
              {/* <li><a>Settings</a></li> */}
              <li onClick={handleClickLogout}><span>{ isLoading ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faPowerOff } /> Logout</span> }</span></li>
            </ul> }
          </div>
        </div>
      </div>
    )
}

export default NavbarHome