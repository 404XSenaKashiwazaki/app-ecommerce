import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const TabProductsDetail = ({ desk, rat}) => {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  const queryParams = new URLSearchParams(location.search)
  const page = queryParams.get('p')    
  const [activeTab, setActiveTab] = useState(page ? page : "deskripsi")

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          className={`w-1/2 py-2 text-start ${
            activeTab === 'deskripsi'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => {
            setActiveTab('deskripsi')
            navigate("/products/"+slug+"?p=deskripsi")
          }}
        >
          Deskripsi
        </button>
        <button
          className={`w-1/2 py-2 text-start ${
            activeTab === 'penilaian'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => {
            setActiveTab('penilaian')
            navigate("/products/"+slug+"?p=penilaian")
          }}
        >
          Penilaian
        </button>
      </div>

      {/* Tab content */}
      <div className="p-0">
        {activeTab === 'deskripsi' && (
          <div className="mt-2">
            <h2 className="text-sm font-semibold mb-2">Deskripsi</h2>
            <p className="text-sm">{ desk }</p>
          </div>
        )}
        {activeTab === 'penilaian' && (
          <div>
            { rat }
          </div>
        )}
      </div>
    </div>
  )
}

export default TabProductsDetail
