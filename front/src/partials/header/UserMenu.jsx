import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../../utils/Transition';
import UserAvatar from '../../images/user-avatar-32.png';
import { useDispatch, useSelector } from 'react-redux'
import { useLogoutMutation } from '../../features/api/apiAuthSlice'
import { setMessage, setRemoveState } from '../../features/authSlice';

function UserMenu() {
  
  const dispatch = useDispatch()
  const { dataUser } = useSelector(state => state.auth)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate()
  const [ logout, { data,isLoading, isSuccess, isError } ] = useLogoutMutation()
  // close on click outside
  const [ roles, setRoles ] = useState([])

  useEffect(() => {
    if(dataUser?.roles) setRoles(dataUser.roles.map(e=>e.name.toLowerCase()))
  },[dataUser])

  // 
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

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

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img className="w-8 h-8 rounded-full" src={ dataUser && dataUser?.detailUsers?.profileUrl } width="32" height="32" alt="User" />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm  font-medium group-hover:text-slate-800">{ dataUser && dataUser.namaDepan + " " + dataUser.namaBelakang + ""  }</span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">{ dataUser && dataUser.namaDepan + " " + dataUser.namaBelakang + "." }</div>
            <div className="text-xs text-slate-500 italic mt-1">{ dataUser  && dataUser.roles.map(e=> e.name != "USER" && e.name) }</div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
                to={roles.includes("admin","penjual") && pathName == "api" ? `/api/profile/${dataUser.username}?p=Profile Settings` : `/profile/${dataUser.username}?p=Profile Settings`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
                onClick={(e) => handleClickLogout(e)}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default UserMenu;