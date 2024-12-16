import React from "react";
import { formatDiskon, formatRp } from "../utils/FormatRp";

const TopSellingProducts = ({ data }) => {
    if(!data || data.length == 0) return <></> 
    return (
        <div className="p-4 bg-white rounded-md shadow-md">
        <h3 className="text-lg font-semibold text-gray-700   rounded-t-md">Produk Terlaris</h3>
        <ul className="mt-4 space-y-4 ">
            {data.map((product, index) => (
            <li key={index} className="flex gap-5 items-center bg-slate-50 rounded-md shadow-md p-2">
                <div>
                    <img className="w-14 h-14 object-cover" src={ product.ImageProducts[0].url_image } alt={ product.nama_produk } />
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">{product.nama_produk}</p>
                    <p className="text-xs text-gray-500">{ product.desk_produk }</p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="grid grid-cols-2 gap-1">
                            <p className="text-sm font-medium text-gray-600 ">{ formatRp(formatDiskon(product.harga_produk, product.Diskon.diskon)) }</p>
                            <p className="text-xs w-auto text-red-600 px-1 py-0">{ product.Diskon.diskon}%</p>
                        </div>
                        <p className="text-sm font-medium text-gray-600 line-through">{ formatRp(product.harga_produk) }</p>
                    </div>
                </div>
                {/* <p className="text-gray-600">⭐ {product.rating}</p> */}
            </li>
            ))}
        </ul>
        </div>
    )
}

export default TopSellingProducts
