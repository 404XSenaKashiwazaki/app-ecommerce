import { faHomeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const OrderSuccess = () => {
    return (
        <div className="flex items-center justify-center min-h-screen md:-mt-20 lg:-mt-20 xl:mt-0">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">Order Sukses!</h2>
                <p className="text-gray-700 mb-6">Terima kasih telah melakukan pembelian. Pesanan Anda sedang diproses.</p>
            <img
                src="http://localhost:8000/success/ddd.png"
                alt="Success"
                className="w-44 h-44 mx-auto mb-10"
            />
            <Link
                to="/"
                className="inline-block bg-gradient-to-r w-auto from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                <FontAwesomeIcon icon={faHomeAlt} /> Kembali ke Home
            </Link>
            
            </div>
        </div>
    )
}

export default OrderSuccess