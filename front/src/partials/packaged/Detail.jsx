import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faSearch} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TimeAgo from '../../components/TimeAgo'
import { typeStatusPayments } from "../../utils/Type"
import { Link } from 'react-router-dom'
import { formatRp } from '../../utils/FormatRp'
import { useFindOneProductsPackagedQuery } from '../../features/api/apiPackaged'

const Detail = ({ id, setId, showModal, setShowModal, username  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataPayment  } = useFindOneProductsPackagedQuery({ produkid: id, username }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataPayment?.response?.orders) setData({
      ...dataPayment.response.orders,
      pembeli: dataPayment.response.orders.User.namaDepan +" "+ dataPayment.response.orders.User.namaBelakang,
      email: dataPayment.response.orders.User.email,
      noHp: dataPayment.response.orders.User.UsersDetail.noHp,
      alamat: dataPayment.response.orders.User.UsersDetail.alamat,
      provinsi: dataPayment.response.orders.User.UsersDetail.provinsi,
      kota: dataPayment.response.orders.User.UsersDetail.kota
    })
  },[dataPayment])

  return (
    <>
      <Modal setId={setId} type="md" title={<span><FontAwesomeIcon icon={faSearch}/> Detail</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className=" px-4 h-auto mb-2">
        <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
          Detail Pembelis
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 h-auto mb-2"> 
          <div className="w-full">
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
          </div>
        </div>
        <div className=" p-4 h-auto mb-1">
          <div className="mb-0">
            <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
              Detail Transaksi
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Transaksi ID</p></span>:
                <span className="w-full px-2 "><p>{ data?.Payment.transactionId }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Jumlah Bayar</p></span>:
                <span className="w-full px-2 "><p>{ formatRp(data?.Payment.amount) }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Metode Pembayaran</p></span>:
                <span className="w-full px-2 uppercase"><p>{ data?.Payment.payment_method.replace("_"," ") }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Status Pembayaran</p></span>:
                <div className="w-full ml-2">
                  <span className={`w-auto px-5 uppercase ${ typeStatusPayments(data?.Payment.status) } text-white py-2 rounded-none font-bold text-sm  transition`}>{ (data?.Payment.status == "settlement") ? "paid": data?.Payment.status }</span>
                </div>
              </div>
              <div className="flex justify-between  mb-2">
                <span className="w-1/2 font-bold "><p >Tgl Bayar</p></span>:
                <span className="w-full px-2 flex flex-col gap-1">
                  <p>{  new Date(data?.Payment.createdAt).toString().slice(0,25) }</p>
                  <TimeAgo date={data?.Payment.createdAt}/>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className=" p-4 h-auto mb-7">
          <div className="mb-10">
            <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
              Detail Produk
            </div>
            <div className="w-full mt-2">
              { data?.Products.map(e=> <Link to={`/products/${e.slug}`} key={e.id} className={`cursor-pointer flex justify-between gap-2  mb-4 border-t border-gray-300`}>
                <div className="w-auto mt-2">
                    <img
                        src={ e.ImageProducts[0].url_image ?? "" }
                        alt={ e.ImageProducts[0].nama_produk }
                        className="w-20 rounded-md h-20 "
                    />
                </div>
                <div className={`w-full`}>
                    <div className="mt-2">
                        <p className="text-sm font-medium">{ e.nama_produk.slice(0,25) }..</p>
                        <p className="text-xs mt-1">{ e.desk_produk.slice(0,80) }..</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <p className="text-gray-600 text-sm mt-1 font-semibold">{ formatRp(e.harga_produk) }</p>
                    </div>
                    <div className="flex gap-5">
                        <p className="text-gray-600 text-sm mt-1">Jumlah: { e.OrdersItems.quantity }</p>
                        <p className="text-gray-600 text-sm mt-1 font-semibold">Total: { formatRp(e.OrdersItems.quantity * e.harga_produk) }</p>
                    </div>
                </div>
                </Link>) }
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail