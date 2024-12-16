import React, { useEffect, useState } from 'react';
import SearchModal from './header/SearchModal';
import Notifications from './header/Notifications';
import Help from './header/Help';
import UserMenu from './header/UserMenu';
import { useSelector } from 'react-redux';
import { faMessage, faShoppingCart, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { inPath } from '../utils/Utils';

function Header({
  sidebarOpen,
  setSidebarOpen
}) {

    const [searchModalOpen, setSearchModalOpen] = useState(false)
    const { isError } = useSelector(state=> state.auth)
    const { dataUser } = useSelector(state => state.auth)
    const [ roles, setRoles ] = useState([])
    const { pathname } = location;
    const pathName = pathname.split("/")[1]
    const selector = useSelector(state=>state.shoppingCart)
    const { options, quantity } = selector   


    useEffect(() => {
      if(dataUser?.roles) setRoles(dataUser.roles.map(e=>e.name.toLowerCase()))
    },[dataUser])

  return (!isError) && (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">

          {/* Header: Left side */}
          <div className="flex">

            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

          </div>

          {/* Header: Right side */}
          <div className="flex items-center">

            {/* <button
              className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${searchModalOpen && 'bg-slate-200'}`}
              onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
              aria-controls="search-modal"
            >
              <span className="sr-only">Search</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-current text-slate-500" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                <path className="fill-current text-slate-400" d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
              </svg>
            </button> */}
          
            { (dataUser && roles.includes("admin","penjual") && pathName == "api") 
            ? <><Notifications /></> 
            : <>
            { inPath(["","/"],pathName) && <><button
              className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${searchModalOpen && 'bg-slate-200'}`}
              onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
              aria-controls="search-modal"
              >
              <span className="sr-only">Search</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-current text-slate-500" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                <path className="fill-current text-slate-400" d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
              </svg>
            </button>
              <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} /> </>}
            </> }
            {/* <Help /> */}
            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 mx-3" />
            <div className="flex items-center gap-2">
            { (dataUser && pathName != "api") && <div className="mx-1">
                <Link to={`cart/${dataUser.username}`} className="relative mx-1">
                  <FontAwesomeIcon icon={faShoppingCart} size="lg"/>
                  <span className="absolute -top-3 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{ quantity }</span>
                </Link>
              </div> } 
              { dataUser 
                ? <UserMenu /> 
                : <>
                  <Link to="/login" >
                    <button
                      className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex gap-2 items-center py-1 px-3">
                      Log In <FontAwesomeIcon icon={faSignIn} />
                    </button>
                  </Link>
                </> 
              }
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;