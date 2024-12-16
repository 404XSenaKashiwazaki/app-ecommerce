import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useChargeTransactionNotPaidMutation, useFindConfirmPaymentQuery } from "../features/api/apiNotYetPaid"
import { useSelector } from 'react-redux'
import { formatRp } from "../utils/FormatRp"
import { Helmet } from 'react-helmet'

const PaymentConfirm = () => {
  const { transactionId } =  useParams()
  const { dataUser } = useSelector(state=> state.auth)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const textToCopy = "Ini adalah teks yang akan disalin"
  const [ data, setData ] = useState(null)
  const { data: dataConfirm } = useFindConfirmPaymentQuery({ username: dataUser?.username, transactionid: transactionId }, { skip: (dataUser) ? false : true })
  const [ chargeTransaction, { isLoading } ] = useChargeTransactionNotPaidMutation()

  useEffect(() => {
    if(dataConfirm?.response?.orders) {
      const dataBank = JSON.parse(dataConfirm.response.orders.va_numbers)
      setData({
        payment_date: dataConfirm.response.orders.payment_date,
        payment_method: dataConfirm.response.orders.payment_method,
        amount: dataConfirm.response.orders.amount,
        bank:  dataBank[0].bank,
        kode: dataBank[0].va_number,
      })
    }
  },[ dataConfirm ])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000) 
    }) 
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-center max-w-md py-3 gap-1 mx-auto">
        <div className="w-full bg-white p-6 shadow-md rounded-lg ">
          <h1 className="text-lg font-bold mb-6"><FontAwesomeIcon icon={faMoneyCheckDollar} /> Infor Pembayaran</h1>
            <p className="text-md font-medium">Total Pembayaran: <span className="text-lg font-bold text-indigo-700">{ formatRp(data?.amount)  }</span> </p>
          <div>
            <p className="uppercase mt-4 font-bold text-md">{ data?.bank }</p>
            <div className="mt-3">
              <p className="text-sm">Kode Pembayaran</p>
              
              { data?.bank == "gopay" ? <div>
                <img onClick={() => handleCopy(data.kode)} src={data.kode} className="cursor-pointer" />
              </div> : <p onClick={() => handleCopy(data.kode)}  className="text-lg font-bold text-indigo-700 cursor-pointer">{ data?.kode }</p>}
              {/*  */}
              <p onClick={() => handleCopy(data.kode)} className="text-xs font-semibold text-gray-800 mb-4 cursor-pointer">
                Salin Kode Pembayaran ke Clipboard
              </p>
              {copied && (
                  <p className="mt-2 text-sm text-green-600">
                    Kode Pembayaran berhasil disalin ke clipboard!
                  </p>
                )}
            </div>
          </div>
          <div className="mt-8 w-full">
            <Link to="/" >
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Ok!</button>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default PaymentConfirm