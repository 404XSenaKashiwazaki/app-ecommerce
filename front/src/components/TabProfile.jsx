import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const TabProfile = ({ profile, password }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get('p')    
    const [activeTab, setActiveTab] = useState(page ? page : "Profile Settings")
    const { dataUser } = useSelector(state=> state.auth)
    const pathName = pathname.split("/")[1]
    

    const handleClick = (name) => {
        setActiveTab(name)
        navigate(`${dataUser.roles.map(e=>e.name.toLowerCase()).includes("admin","penjual") && pathName == "api" ? `/api/profile/${dataUser.username}?p=${name}` : `/profile/${dataUser.username}?p=${name}`}`)
    }
    return (
        <div className="w-full max-w-md ">
        {/* Tab buttons */}
        <div className="flex border-b border-gray-200">
            <button
            className={`w-1/2 py-2 text-start text-md font-medium ${
                activeTab === 'Profile Settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => handleClick("Profile Settings")}
            >
            Profile
            </button>
            <button
            className={`w-1/2 py-2 text-start text-md font-medium ${
                activeTab === 'Password Settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => handleClick("Password Settings")}
            >
            Password Settings
            </button>
        </div>

        {/* Tab content */}
        <div className="p-0">
            {activeTab === 'Profile Settings' && (
            <div className="mt-5">
                { profile }
            </div>
            )}
            {activeTab === 'Password Settings' && (
            <div className="mt-5">
                { password }
            </div>
            )}
        </div>
        </div>
    )
}

export default TabProfile
