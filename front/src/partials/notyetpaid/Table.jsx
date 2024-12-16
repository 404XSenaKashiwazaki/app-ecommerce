import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faContactBook, faContactCard, faDollarSign, faEdit,faMessage,faMoneyCheckDollar,faPlus,faSearch, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux"
import { mySwal } from '../../utils/sweetalert'
import { formatRp } from '../../utils/FormatRp'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn, typeStatusPayments } from "../../utils/Type"

function Table({ 
  data,
  setItemContact,
  setShowModalDetail,
  setId,
  handleClickPayment,
  handleCancelOrders,
  setShowContact,
  dataUser,
  }) {
  const dispatch = useDispatch()

  const handleCancel = (e, transactionId) => {
    e.preventDefault()
    mySwal.fire({
      title: 'Apakah anda yakin?',
      text: "Anda akan membatalkan pesanan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batal!',

      reverseButtons: true
  }).then(async (result) => {
  if (result.isConfirmed) {
      handleCancelOrders(transactionId)
  } 
  else if(result.dismiss ===mySwal.DismissReason.cancel) {
      mySwal.fire(
      'Cancelled',
      'Aman, Pesanan anda tidak jadi di batalkan:)',
      'error'
      )
  }
  })
  }

  const handleClickDetail = (e,slug) => {
    e.preventDefault()
    setId(slug)
    setShowModalDetail(true)
  }

  return (
    <>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs  font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                <th className="p-2 whitespace-nowrap ">
                    <div className="font-semibold text-left">
                      <div className="w-full h-full shrink-0">
                      </div>
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Produk</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Status</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Qty</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Tanggal</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Total Bayar</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-center">Actions</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {
                data.length > 0 && data.map((d,index) => {
                  return (
                    <tr key={d.id}>
                      <td className="p-2 whitespace-nowrap max-w-[30px] overflow-hidden">
                        <div className="flex items-center">
                          <div className="w-full h-full shrink-0">
          
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { (d.Order.Products && d.Order.Products.length > 0) && d.Order.Products.map(e2=> <p key={e2.id} className="font-medium text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap">{ e2.nama_produk }</p>) }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> <span className={`w-full px-4 ${ typeStatusPayments(d.status) } text-white py-1 rounded-none font-bold text-sm  transition uppercase `}>{ (d.status == "settlement") ? "paid": d.status }</span></div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { (d.Order.Products && d.Order.Products.length > 0) && <p>{ d.Order.Products.length }</p> }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium flex flex-col gap-1"> <span>{  new Date(d.createdAt).toString().slice(3,25) }</span> <TimeAgo date={d.createdAt} /> </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { formatRp(d.Order.total_price) }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center p-1">
                            <button 
                              onClick={(e) => handleClickDetail(e,d.transactionId)}
                              className='
                              bg-cyan-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-cyan-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faSearch} /></button>
                          <button 
                              onClick={(e) => {
                                const dataBank = JSON.parse(d.va_numbers)
                                handleClickPayment({
                                  payment_date: d.payment_date,
                                  payment_method: d.payment_method,
                                  amount: d.amount,
                                  bank:  dataBank[0].bank,
                                  kode: dataBank[0].va_number,
                                })
                              }}
                              className='
                              bg-sky-800 px-4 py-1 rounded-sm 
                              border-0 text-slate-300  w-auto
                              h-auto text-sm  
                              font-medium text-center hover:bg-sky-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faMoneyCheckDollar} /></button>
                            <button 
                              onClick={(e) => handleCancel(e,d.transactionId)}
                              className='
                              bg-red-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-red-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faCancel} /></button>
                              <button 
                              onClick={(e) => {
                                const products = d.Order.Products.map(p=>({ 
                                  produk: p.nama_produk,
                                  harga: p.harga_produk,
                                  slug: p.slug,
                                  desk: p.desk_produk
                                }))
                                setItemContact({
                                  username: d.Order.User.username,
                                  email: d.Order.User.email,
                                  transactionId: d.transactionId,
                                  profileUrl: dataUser.detailUsers.profileUrl,
                                  content: "",
                                  products
                                })
                                setId(d.transactionId)
                                setShowContact(true)
                              }}
                              className='
                              bg-cyan-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-cyan-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faMessage} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                }) 
                }
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default Table