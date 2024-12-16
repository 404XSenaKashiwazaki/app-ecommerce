import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faCheckSquare, faImage, faList, faSearch, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFindOneOrderBackQuery } from '../../features/api/apiOrders'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn, typeStatusPayments } from "../../utils/Type"
import { Link } from 'react-router-dom'
import { formatRp } from '../../utils/FormatRp'
import { useFindOnePaymentsBackQuery } from '../../features/api/apiPaymentsSlice'

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataPayment  } = useFindOnePaymentsBackQuery({ id }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataPayment?.response?.payments) setData({
      ...dataPayment.response.payments,
      pembeli: dataPayment.response.payments.Order.User.namaDepan +" "+ dataPayment.response.payments.Order.User.namaBelakang,
      email: dataPayment.response.payments.Order.User.email,
      noHp: dataPayment.response.payments.Order.User.UsersDetail.noHp,
      alamat: dataPayment.response.payments.Order.User.UsersDetail.alamat,
      provinsi: dataPayment.response.payments.Order.User.UsersDetail.provinsi,
      kota: dataPayment.response.payments.Order.User.UsersDetail.kota
    })
  },[dataPayment])

  return (
    <>
      <Modal setId={setId} type="md" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Transactions</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className=" px-4 h-auto mb-2">
        <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
          Detail Pembayar
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 h-auto mb-2"> 
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Pesanan ID</p></span>:
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
          </div>
        </div>
        <div className=" p-4 h-auto mb-7">
          <div className="mb-10">
            <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
              Detail Transaksi
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Transaksi ID</p></span>:
                <span className="w-full px-2 "><p>{ data?.transactionId }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Jumlah Bayar</p></span>:
                <span className="w-full px-2 "><p>{ formatRp(data?.amount) }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Metode Pembayaran</p></span>:
                <span className="w-full px-2 uppercase"><p>{ data?.payment_method.replace("_"," ") }</p></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-1/2 font-bold"><p >Status Payments</p></span>:
                <div className="w-full ml-2">
                  <span className={`w-auto px-5 uppercase ${ typeStatusPayments(data?.status) } text-white py-2 rounded-none font-bold text-sm  transition`}>{ (data?.status == "settlement") ? "paid": data?.status }</span>
                </div>
              </div>
              <div className="flex justify-between  mb-2">
                <span className="w-1/2 font-bold "><p >Tgl Bayar</p></span>:
                <span className="w-full px-2 flex flex-col gap-1">
                  <p>{  new Date(data?.createdAt).toString().slice(0,25) }</p>
                  <TimeAgo date={data?.createdAt}/>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail