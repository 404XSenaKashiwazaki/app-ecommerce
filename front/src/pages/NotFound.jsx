import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function NotFound({ site }) {
  return (
    <div>
    <Helmet >
        <title>{ site } - Halaman Tidak Ditemukan</title>
    </Helmet>
    <div className="col-span-full xl:col-span-6  shadow-lg rounded-sm border-none  h-screen w-full">
    <div className="w-full h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-red-900 font-semibold text-center mx-0 p-0 mt-0">
        <h4 className="pt-52 font-bold text-5xl">404</h4>
        <h5>Page Not Found</h5>
        <div className="mt-10">
          <Link to={"/"}
              className={`bg-gradient-to-r w-auto from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
              Kembali
          </Link>
        </div>
    </div>
    </div>
  </div>
    
  )
}

export default NotFound