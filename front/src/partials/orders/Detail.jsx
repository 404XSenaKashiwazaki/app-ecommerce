import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faCheckSquare, faImage, faList, faSearch, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFindOneOrderBackQuery } from '../../features/api/apiOrders'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn } from "../../utils/Type"
import { Link } from 'react-router-dom'
import { formatRp } from '../../utils/FormatRp'

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataOrders  } = useFindOneOrderBackQuery({ id }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataOrders?.response?.orders) setData({
      ...dataOrders.response.orders,
      pembeli: dataOrders.response.orders.User.namaDepan +" "+ dataOrders.response.orders.User.namaBelakang,
      email: dataOrders.response.orders.User.email,
      noHp: dataOrders.response.orders.User.UsersDetail.noHp,
      alamat: dataOrders.response.orders.User.UsersDetail.alamat,
      provinsi: dataOrders.response.orders.User.UsersDetail.provinsi,
      kota: dataOrders.response.orders.User.UsersDetail.kota
    })
  },[dataOrders])

  console.log({ data});
  
  return (
    <>
      <Modal setId={setId} type="md" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Orders</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className=" px-4 h-auto mb-2">
        <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
          Detail Pembeli
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 h-auto mb-2"> 
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Transaksi ID</p></span>:
              <span className="w-full px-2 "><p>{ data?.transactionId }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Pembeli</p></span>:
              <span className="w-full px-2"><p>{ data?.pembeli }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Email</p></span>:
              <span className="w-full px-2"><p>{ data?.email }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >No Hp/Wa </p></span>:
              <span className="w-full px-2"><p>{ data?.noHp }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Status Pesanan</p></span>:
              <div className="w-full ml-2">
                <span className={`w-auto px-5 ${ typeBtn(data?.status) } text-white py-2 rounded-none font-bold text-sm  transition`}>{ data?.status }</span>
              </div>
            </div>
            <div className="flex justify-between  mb-2">
              <span className="w-1/2 font-bold "><p >Tgl Pesan</p></span>:
              <span className="w-full px-2 flex flex-col gap-1">
                <p>{  new Date(data?.createdAt).toString().slice(0,25) }</p>
                <TimeAgo date={data?.createdAt}/>
              </span>
            </div>
          </div>
        </div>
        <div className=" p-4 h-auto mb-7">
          <div className="mb-10">
            <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
              Detail Pengiriman 
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >No Resi </p></span>:
                <span className="w-full px-2"><p>{ data?.resi }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Kurir </p></span>:
                <span className="w-full px-2"><p>{ data?.kurir }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Ongkir </p></span>:
                <span className="w-full px-2"><p>{ formatRp(data?.ongkir) }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Provinsi</p></span>:
                <span className="w-full px-2"><p>{ data?.provinsi }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Kota</p></span>:
                <span className="w-full px-2"><p>{ data?.kota }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Alamat </p></span>:
                <span className="w-full px-2"><p>{ data?.alamat }</p></span>
              </div>
            </div>
          </div>
          <div className="mb-5 mt-o relative pt-4">
            <h1 className="font-bold text-lg mb-0"><span><FontAwesomeIcon icon={faList}/> Products</span></h1>
          </div>
          { (data) && data.Products.map(e=> (<div key={e.id} className="grid grid-row-2">
            <Link to={`/products/${e.slug}`} className="flex gap-5 p-2 w-full mb-5 shadow-md border border-gray-100" >
              <div className="w-1/5 rounded-lg ">
                  <img src={e.ImageProducts[0].url_image} alt={e.nama_produk} className="w-full h-20 object-fill border-r border-gray-100" />
              </div>
              <div className="w-full">
                  <p className="text-md font-medium">{ e.nama_produk }</p>
                  <p className="text-sm font-medium mt-1">{ e.desk_produk }</p>
                  <div className="mt-2 flex flex-row gap-10">
                    <p className="text-sm font-medium">{ formatRp(e.harga_produk) }</p>
                    <p className="text-sm "font-medium>{ e.OrdersItems.quantity }x</p>
                  </div>
                  <p className="text-md font-medium mt-1">Total: { formatRp(e.OrdersItems.price) }</p>
              </div>
            </Link>
          </div>)) }
        </div>
      </Modal>
    </>
  )
}

export default Detail