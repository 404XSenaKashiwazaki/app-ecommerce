import React, { useEffect, useState } from "react"
import { useFindAllOrderBackQuery } from "../features/api/apiOrders"
import { formatRp } from '../utils/FormatRp'
import TimeAgo from '../components/TimeAgo'
import { typeBtn } from "../utils/Type"

const SummaryChart = () => {
    const [ data, setData ] = useState([])
    const { data: dataOrders,isError, isLoading, error } = useFindAllOrderBackQuery({ restores: false, search:"", page: 1, perPage: 5 })
    
    useEffect(() => {
        if(dataOrders?.response){
            const { orders } = dataOrders.response
            setData(orders)
        }
    },[ dataOrders ])

    console.log({  data });
    
    return (
        <div className="p-4 bg-white rounded-md shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Pesanan Terbaru</h3>
        <div className="overflow-x-auto pb-5">
            <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs  font-semibold uppercase text-slate-400 bg-slate-50">
                    <tr>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Pembeli</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Produk</div>
                    </th>
                    {/* <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Status</div>
                    </th> */}
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Qty</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Tanggal</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Tagihan</div>
                    </th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-slate-100">
                {
                data.length > 0 && data.map((d,index) => {
                    return (
                        <tr key={d.id}>
                        <td className="p-2 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="font-medium text-xs text-slate-800">{ d.User.namaDepan+" "+d.User.namaBelakang }</div>
                            </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                            <div className="text-start text-xs font-medium"> { (d.Products && d.Products.length > 0) && d.Products.map(e2=> <p key={e2.id} className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">{ e2.nama_produk }</p>) }</div>
                        </td>
                        {/* <td className="p-2 whitespace-nowrap">
                            <div className="text-start text-xs font-medium"> <span className={`w-full px-1 ${ typeBtn(d.status) } text-white py-1 w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-none font-bold text-xs uppercase transition`}>{ d.status }</span></div>
                        </td> */}
                        <td className="p-2 whitespace-nowrap">
                            <div className="text-start text-xs font-medium"> { (d.Products && d.Products.length > 0) && <p>{ d.Products.length }</p> }</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                            <div className="text-start text-xs font-medium flex flex-col gap-1"><TimeAgo date={d.createdAt} /> </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                            <div className="text-start text-xs  font-medium"> { formatRp(d.total_price) }</div>
                        </td>
                        
                        </tr>
                    )
                }) 
                }
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default SummaryChart
 