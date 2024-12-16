import { faCalendarAlt, faFire, faFolder, faHome, faHomeAlt, faList, faTags } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, NavLink } from "react-router-dom"

const NavbarMenuHome = () => {
    const path =  location.pathname.split("/")
    const active = " bg-indigo-600 w-full h-full text-center "
    return (
        <div className="p-0 shadow-2xl mx-0 mt-24">
        <ul className="grid grid-cols-2 md:grid-cols-6  gap-5 text-slate-50">
            <NavLink to={"/"} className={({isActive}) => (isActive ? active : "")}><li className="p-2 mx-0 font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faHomeAlt}/> HOME</li></NavLink>
            <NavLink to={"/anime"}  className={({isActive}) => (isActive && path.length != 3 && path[2] != "genres" ? active : "")}><li className="p-2 mx-2  w-full h-full font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faList}/> LIST</li></NavLink>
            <NavLink to={"/jadwal-rilis"}  className={({isActive}) => (isActive ? active : "")}><li className="p-2 mx-2 w-full h-full font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faCalendarAlt}/> JADWAL</li></NavLink>
            <NavLink to={"/genre"} className={({isActive}) => (isActive ? active : "")}> <li className="p-2 mx-0 w-full h-full font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faTags}/> GENRE </li></NavLink>
            <NavLink to={"/ongoing"} className={({isActive}) => (isActive ? active : "")}><li className="p-2 mx-2 w-full h-full font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faFire}/> ON-GOING</li></NavLink>
            <NavLink to={"/complete"}  className={({isActive}) => (isActive ? active : "")}><li className="p-2 mx-2 w-full h-full font-medium text-[12px] cursor-pointer"><FontAwesomeIcon icon={faFolder}/> COMPLETE</li></NavLink>
        </ul>
    </div>
        // <div className="md:w-[850px] md:mx-5 mx-0 shadow-2xl mb-0 mt-24 p-0 bg-slate-400">
          
       
       
        // </div>
    )
}

export default NavbarMenuHome