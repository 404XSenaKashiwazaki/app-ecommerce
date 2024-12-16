import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import SidebarLinkGroup from './SidebarLinkGroup'
import { useDispatch, useSelector } from 'react-redux'

import { useLogoutMutation } from '../features/api/apiAuthSlice'
import { setMessage, setRemoveState, tokenSelector } from '../features/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faCogs, faComments, faCreditCard, faHome, faList, faMessage, faMoneyBill, faPaperPlane, faPercent, faPowerOff, faShop, faShoppingBag, faShoppingCart, faSignIn, faSignOutAlt, faSignal, faStore, faTachometerAlt, faTags, faTh, faUserCircle, faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons'

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate()
  const { pathname } = location;
  const dispatch = useDispatch()
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const { site } = useSelector(state=> state.sites)
  const token = useSelector(tokenSelector)
  const { dataUser } = useSelector(state => state.auth)
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');
  const [postsMenu, setPostsMenu] = useState(localStorage.getItem("sidebar_posts") ? JSON.parse(localStorage.getItem("sidebar_posts")) : false)
  const [ logout, { data,isLoading, isSuccess, isError } ] = useLogoutMutation()
 
  const [ roles, setRoles ] = useState([])

  useEffect(() => {
    if(dataUser?.roles) setRoles(dataUser.roles.map(e=>e.name.toLowerCase()))
  },[dataUser])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleClickLogout = async (e) => {
    e.preventDefault()
    try {
      await logout().unwrap()
      dispatch(setRemoveState())
      dispatch(setMessage("Anda telah logout"))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }


  const pathName = pathname.split("/")[1]
  const posts = pathname.split("/")[3]
  const posts1 = pathname.split("/")[2]
  const posts2 = pathname.split("/")[4]

  const sidebarPosts = () => {
    setPostsMenu(false)
    localStorage.setItem("sidebar_posts",false)
  }
  
  return (!isError)  &&  (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-gradient-to-r from-blue-400 to-purple-500 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex gap-2 mb-10 pr-3 sm:px-2 items-center">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/api/dashboard" className="block">
            <div>
                <img src={site?.logo_url || "http://localhost:8000/sites/default.jpg"} className="rounded-sm" width="32" height="32" alt={site?.title} />
            </div>
          </NavLink>
          <span className="text-lg uppercase text-slate-50 font-bold">{ site?.title }</span>
        </div>

        {/* Links */}
        <div className="space-y-8">

          { (token && roles.includes("admin","penjual") && pathName == "api") 
          ? (<>
            {/* Pages group */}
            <div>
            <h3 className="text-xs uppercase text-slate-900 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block"> Menu</span>
            </h3>
            <ul className="mt-3">
              {  }
              {/* Dashboard */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('dashboard') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/dashboard"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between ">
                    <div className="grow flex items-center">
                      
                      <div className="shrink-0 h-6 w-6">
                      <FontAwesomeIcon className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-900'
                          }`} size="1x" icon={faTachometerAlt} />
                      </div>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Dashboard
                      </span>
                    </div>
                    {/* Badge */}
                    {/* <div className="flex flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">4</span>
                    </div> */}
                  </div>
                </NavLink>
              </li>

               {/* products */}
               <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('products') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/products"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('discounts') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('products') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faShop} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Products
                    </span>
                  </div>
                </NavLink>
                </li>
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('discounts') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/discounts"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('discounts') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('discounts') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faPercent} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Discounts
                    </span>
                  </div>
                </NavLink>
                </li>
                {/* orders */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('orders') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/orders"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('orders') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('orders') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faShoppingCart } />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Orders
                    </span>
                  </div>
                </NavLink>
                </li>
                {/* pembayaran */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('transactions') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/transactions"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('transactions') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('transactions') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faSignal } />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Transactions
                    </span>
                  </div>
                </NavLink>
                </li>
                {/* contact */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('contact') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/contact"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('contact') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('contact') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faMessage} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Contacts
                    </span>
                  </div>
                </NavLink>
              </li>
            
               {/* comments */}
                {/* <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('comment') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/comment"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('comment') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('comment') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faComments} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Comments
                    </span>
                  </div>
                </NavLink>
              </li> */}
                {/* role */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('roles') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/roles"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('roles') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('roles') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUserShield} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Roles
                    </span>
                  </div>
                </NavLink>
                </li>
               {/* users */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('users') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/users"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('users') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('users') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUsers} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Users
                    </span>
                  </div>
                </NavLink>
              </li>
                  {/* sites */}
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('site') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/api/site?p=Site Settings"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('site') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('site') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faCogs} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Sites
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
            </div>
          </>) 
          : (<>
          <ul className="mt-3">
             {/* akun */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${(pathname.includes('home') || pathName == "" || pathname.includes("products"))  && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/"
                  className={`block text-slate-50 truncate transition duration-150 ${
                    pathname.includes('home') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('home') || pathname.includes("products") ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faHome} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Home
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* akun */}
          
            { (dataUser) && <>
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0  ${pathname.includes('cart') || pathname.includes('checkouts') ? 'bg-slate-900' :  ``}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to={`/cart/${dataUser.username}`}
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('cart') || pathname.includes('checkouts') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/cart' || pathname.includes('cart') || pathname.includes('checkouts') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faShoppingCart} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Keranjang
                    </span>
                  </div>
                </NavLink>
              </li>
            </> }
          </ul> 
          </>)}

          { (token) ? <>

           {/* More group */}
            <div>
            <h3 className="text-xs uppercase text-slate-900 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Seettings</span>
            </h3>
            <ul className="mt-3">
              {/* akun */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('profile') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to={`${token && roles.includes("admin","penjual") && pathName == "api" ? `/api/profile/${dataUser.username}?p=Profile Settings` : `/profile/${dataUser.username}?p=Profile Settings`}`}
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('users') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/profile' || pathname.includes('profile') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUserCircle} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Profile
                    </span>
                  </div>
                </NavLink>
              </li>
              
              { pathName != "api"  && <SidebarLinkGroup activecondition={pathname.includes('posts')} >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        
                        className={`block text-slate-200 truncate transition duration-150  px-3 m-0 py-2 rounded-sm mb-0.5 last:mb-0  ${
                          pathname.includes('orders') && pathName != "api" ? 'hover:text-slate-200 ' : 'hover:text-white ' 
                        } ${ pathname.includes('orders') && `bg-slate-900` }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setPostsMenu(!postsMenu)
                          localStorage.setItem("sidebar_posts",!postsMenu)
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center">
                          <div className="shrink-0 h-6 w-6">
                            <FontAwesomeIcon className={`fill-current ${
                                  (pathname === '/orders' || pathname.includes("order") || pathname.includes('orders')) && pathName != "api" ? 'text-indigo-500' : 'text-slate-900'
                                }`} size="1x" icon={faBagShopping} />
                            </div>
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Pesanan
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg onClick={(e) => { 
                              setPostsMenu(!postsMenu)
                              localStorage.setItem("sidebar_posts",!postsMenu)

                              }} className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-50 ${(open && pathName != "api")  && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        
                        <ul className={`pl-9 mt-1 ${(postsMenu == false ) && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              
                              to={`/orders/${dataUser.username}/belum-bayar`}
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (posts  == "belum-bayar" ? 'text-slate-50' : 'text-slate-900 hover:text-slate-200')
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Belum bayar
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to={`/orders/${dataUser.username}/dikemas`}
                              className={({ isActive }) =>
                              {
                                
                                return 'block transition duration-150 truncate ' + (posts == "dikemas" ? 'text-slate-50' : 'text-slate-900 hover:text-slate-200')
                              }
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Dikemas
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to={`/orders/${dataUser.username}/dikirim`}
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (posts  == "dikirim" ? 'text-slate-50' : 'text-slate-900 hover:text-slate-200')
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                               Dikirim
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to={`/orders/${dataUser.username}/selesai`}
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (posts == "selesai"? 'text-slate-50' : 'text-slate-900 hover:text-slate-200')
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                               Selesai
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to={`/orders/${dataUser.username}/dibatalkan`}
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (posts  == "dibatalkan" ? 'text-slate-50' : 'text-slate-900 hover:text-slate-200')
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                               Dibatalkan
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> }
              {/* logout */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('logout') && 'bg-slate-900'} cursor-pointer`}>
                <div
                  onClick={(e) => handleClickLogout(e)}
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('logout') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/logout' || pathname.includes('logout') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faPowerOff} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Logout
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            </div>
          </> : <>
          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-slate-900 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">More</span>
            </h3>
            <ul className="mt-3">
              {/* logout */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('login') && 'bg-slate-900'}`}>
                <Link
                  to="/login"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('login') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex h-full items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/' || pathname.includes('login') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faSignIn} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Log In
                    </span>
                  </div>
                </Link>
              </li>
            
            </ul>
          </div>
          </> }

        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-900" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-900" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Sidebar;
