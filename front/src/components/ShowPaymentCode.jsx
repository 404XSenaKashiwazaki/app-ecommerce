import { faDollar, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Modal from "../components/Modal_"
import { formatRp } from "../utils/FormatRp"

const ShowPaymentCode = ({ vaNumbers,showModal, setShowModal }) => {
    const [copied, setCopied] = useState(false)
    const textToCopy = "Ini adalah teks yang akan disalin"
    const ModalTitle = () =>  <span className="px-2"><FontAwesomeIcon icon={faMoneyCheckDollar}/> Info Pembayaran </span>
    
    const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 3000) 
        }) 
    }

    const ModalButton = () => <button onClick={() => setShowModal(false)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-1 px-5 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Ok!</button>
    
    return (
        <> 
            <Modal mt="mt-28" type="sm" title={<ModalTitle  />}  button={<ModalButton />} setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                <div className="w-full mt mb-1 p-4 h-auto">
                <p className="text-md font-medium">Total Pembayaran: <span className="text-lg font-bold text-indigo-700">{ formatRp(vaNumbers?.amount)  }</span> </p>
                <div>
                    <p className="uppercase mt-4 font-bold text-md">{ vaNumbers?.bank }</p>
                    <div className="mt-3">
                    <p className="text-sm">Kode Pembayaran</p>
                    { vaNumbers?.bank == "gopay" ? <div>
                        <img onClick={() => handleCopy(vaNumbers.kode)} src={vaNumbers.kode} className="cursor-pointer" />
                    </div> : <p onClick={() => handleCopy(vaNumbers.kode)}  className="text-lg font-bold text-indigo-700 cursor-pointer">{ vaNumbers?.kode }</p>}
                    {/*  */}
                    <p onClick={() => handleCopy(vaNumbers.kode)} className="text-xs font-semibold text-gray-800 mb-4 cursor-pointer">
                        Salin Kode Pembayaran ke Clipboard
                    </p>
                    {copied && (
                        <p className="mt-2 text-sm text-green-600">
                            Kode Pembayaran berhasil disalin ke clipboard!
                        </p>
                        )}
                    </div>
                </div>
                </div>
            </Modal>
        </>
    )
}

export default ShowPaymentCode 







