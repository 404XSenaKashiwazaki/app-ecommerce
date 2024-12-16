import React, { useEffect, useReducer, useState } from 'react'
import { Link, Outlet, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons"
import { faLock, faSignInAlt, faUserLock, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import ModalFront from '../components/ModalFront'
import { useDispatch, useSelector } from 'react-redux'
import { messageSelector, tokenSelector } from '../features/authSlice'
import { useAuthQuery } from '../features/api/apiAuthSlice'
import NavbarHome from '../components/NavbarHome'
import NavbarMenuHome from '../components/NavbarMenuHome'
import ModalProfile from '../components/ModalProfile'
import FooterHome from '../components/FooterHome'
import { useFindSiteQuery } from "../features/api/apiSitesSlice"
import { setIsRestore, setSites } from '../features/siteSlice'

function LayoutHome() {
  const {pathname} = location
  const dispatch = useDispatch()
  const { data:dataSite } = useFindSiteQuery()
  const [site, setSite ] = useState()

  useEffect(() => {
    if(dataSite?.response?.sites) {
      setSite({
        title: dataSite.response.sites.title,
        deskripsi: dataSite.response.sites.deskripsi,
        dmca: dataSite.response.sites.dmca,
        privacy_police: dataSite.response.sites.privacy_police
      }) 
    }
  },[dataSite])

  useEffect(() =>{
    if(site) dispatch(setSites(site))
  },[ site ])

    return (
    <div className="bg-indigo-950 h-full min-h-screen z-30 w-full overflow-hidden">
    <div className="container mx-auto w-full  h-auto ">
        
        <NavbarHome site={site}/>
        <div className="mx-1 h-auto md:mx-auto md:w-fit box-border mt-10">
       
        {/* card epiosode terbaru */}
        <div className="md:w-[850px] mx-5 shadow-2xl">
        <NavbarMenuHome />
          </div>
          </div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        {/* content */}
        <Outlet />
        <ModalFront />
        <ModalProfile />
        {/* content */}
        <FooterHome site={site} />
    asfsasgf
    </div>
    </div>
    )
}

export default LayoutHome