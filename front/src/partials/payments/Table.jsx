import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faPlus,faSearch, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux"
import { mySwal } from '../../utils/sweetalert'
import { formatRp } from '../../utils/FormatRp'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn, typeStatusPayments } from "../../utils/Type"

function Table({ 
  data,
  setShowModal,
  setShowModalDetail,
  checkedAll,
  setCheckedAll,
  setCheckedId,
  destroy,
  restore,
  setPage,
  checkedId,
  isRestore,
  setId,
  setMessage,
  setShowModalAddImage
  }) {
  const dispatch = useDispatch()
  const handleChecked = (evnt,targetId) => {
    const { checked } = evnt.target 
    const t = (checkedId) ? checkedId : data.map(el=> ({id: el.id, checked: false}))
    const id = t.map(e=> {
      if(targetId != "all") return (targetId == e.id) ? { ...e, checked } : e
      return { ...e, checked }
    });

    setCheckedId(id);
    const tw = id.filter(e=> e.checked == true);
    (tw.length == data.length) ? setCheckedAll(true) : setCheckedAll(false)
  }

  const handleDestroy = (e,title,id) => {
    e.preventDefault()
    mySwal.fire({
      title: 'Apakah anda yakin?',
      text: "Anda akan menghapus data: "+title+"?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batal!',
      reverseButtons: true
  }).then(async (result) => {
  if (result.isConfirmed) {
      const permanent = `?permanent=${ isRestore ? `true`: `false` }`
      try {
        const res =  await destroy({ id, permanent }).unwrap()
        dispatch(setMessage(res?.message))
        setPage(1)
        setCheckedAll(false)
      } catch (error) {
          console.log(error)
      }
  } 
  else if(result.dismiss ===mySwal.DismissReason.cancel) {
      mySwal.fire(
      'Cancelled',
      'Aman, data anda tidak jadi di hapus :)',
      'error'
      )
  }
  })
  }

  const handleRestore = async (e,id) => {
    e.preventDefault()
    try {
      const  res = await restore({ id }).unwrap()
      dispatch(setMessage(res?.message))
    } catch (error) {
      console.log(error)
    }
  }


  const handleClickEdit = (e,slug) => {
    e.preventDefault()
    setId(slug)
    setShowModal(true)
  }

  const handleClickDetail = (e,slug) => {
    e.preventDefault()
    setId(slug)
    setShowModalDetail(true)
  }

  
  const handleAddImage = (e,slug) => {
    e.preventDefault()
    setId(slug)
    setShowModalAddImage(true)
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
                        <input type="checkbox" 
                          disabled={ data.length < 1 ? true : false } 
                          checked={  checkedAll } 
                          onChange={(e) => handleChecked(e,"all")}  id="select_id_users" className="w-3 h-3 border-slate-400" />
                      </div>
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Pembeli</div>
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
                            <input type="checkbox"  
                              name={ d.id } 
                              value={ d.id} 
                              checked={ (checkedId) && checkedId[index]?.checked || false } 
                              onChange={e => handleChecked(e,d.id)}  id="select_id_episode" className="w-3 h-3 border-slate-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-slate-800">{ d.Order.User.namaDepan+" "+d.Order.User.namaBelakang }</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { (d.Order.Products && d.Order.Products.length > 0) && d.Order.Products.map(e2=> <p key={e2.id} className="font-medium">{ e2.nama_produk.slice(0,10) }...</p>) }</div>
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
                              onClick={(e) => handleClickDetail(e,d.id)}
                              className='
                              bg-cyan-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-cyan-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faSearch} /> Detail</button>
                            { 
                              (isRestore) 
                              &&(<button 
                                onClick={(e) => handleRestore(e,d.id)}
                                className='
                                bg-sky-800 px-4 py-1 rounded-sm 
                                border-0 text-slate-300  w-auto
                                h-auto text-sm  
                                font-medium text-center hover:bg-sky-900
                                hover:text-slate-200 mr-1'
                                ><FontAwesomeIcon  icon={faSyncAlt} /> Restore</button>)
                            
                            }
                            
                            <button 
                              onClick={(e) => handleDestroy(e, d.Order.User.namaDepan+" "+d.Order.User.namaBelakang,d.id)}
                              className='
                              bg-red-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300  w-auto
                              h-auto text-sm  
                              font-medium text-center hover:bg-red-900
                              hover:text-slate-200' 
                              ><FontAwesomeIcon  icon={faTrashAlt} /> Hapus</button>
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