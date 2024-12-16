import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'


const EmptyShoppingCart = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 md:-mt-56 lg:mt-56 xl:-mt-24">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Keranjang Anda Kosong</h2>
            <p className="text-gray-700 mb-6">
                Sepertinya Anda belum menambahkan produk apapun ke keranjang belanja Anda.
            </p>
            <div className="flex justify-center gap-0 my-5">
                <img
                    src="http://localhost:8000/success/cart.png"
                    alt="Empty Cart"
                    className="w-24 h-24 mb-4"
                />
            {/* <img
                src="http://localhost:8000/success/baka.gif"
                    alt="Empty Cart"
                    className="w-24 h-24 mb-4"
                /> */}
            </div>
            <Link
                to="/"
                className="bg-gradient-to-r w-auto from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                <FontAwesomeIcon icon={faCartShopping} /> Lanjutkan Belanja
            </Link>
            </div>
        </div>
    )
}

export default EmptyShoppingCart