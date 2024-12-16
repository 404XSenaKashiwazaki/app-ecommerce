import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const TabSite = ({ site, slider }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get('p')    
    const [activeTab, setActiveTab] = useState(page ? page : "Site Settings")
    const { dataUser } = useSelector(state=> state.auth)
    const pathName = pathname.split("/")[1]
    

    const handleClick = (name) => {
        setActiveTab(name)
        navigate("/api/site?p="+name)
    }
    return (
        <div className="w-full">
        {/* Tab buttons */}
        <div className="flex border-b border-gray-200">
            <button
            className={`w-1/2 py-2 text-start text-md font-medium ${
                activeTab === 'Site Settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => handleClick("Site Settings")}
            >
            Sites
            </button>
            <button
            className={`w-1/2 py-2 text-start text-md font-medium ${
                activeTab === 'Slider Settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => handleClick("Slider Settings")}
            >
            Slider Settings
            </button>
        </div>

        {/* Tab content */}
        <div className="p-0">
            {activeTab === 'Site Settings' && (
            <div className="mt-5">
                { site }
            </div>
            )}
            {activeTab === 'Slider Settings' && (
            <div className="mt-5">
                { slider }
            </div>
            )}
        </div>
        </div>
    )
}

export default TabSite
