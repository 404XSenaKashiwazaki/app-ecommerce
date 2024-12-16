import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSearch, faSyncAlt, faTrashAlt, faUserAltSlash, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useActiveUsersMutation, useNonActiveUsersMutation } from '../../features/api/apiUserSlice'
import { useDispatch } from "react-redux"
import { mySwal } from '../../utils/sweetalert'


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
 }) {
  // console.log({ ds});
  const  [ active ] = useActiveUsersMutation()
  const [ nonActive ] = useNonActiveUsersMutation()
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
        //  refetch()
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
    //  refetch()
    } catch (error) {
      console.log(error)
    }
  }

  const  handleActive = async (e,id) => {
    try {
      const res = await active({ userid: id }).unwrap()
      dispatch(setMessage(res?.message))
    } catch (error) {
      console.log(error)
    }
  }

  const  handleNonActive = async (e,id) => {
    try {
      const res = await nonActive({ userid: id }).unwrap()
      dispatch(setMessage(res?.message))
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickEdit = (e,id) => {
    e.preventDefault()
    setId(id)
    setShowModal(true)
  }

  const handleClickDetail = (e,id) => {
    e.preventDefault()
    setId(id)
    setShowModalDetail(true)
  }

  return (
    <>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
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
                    <div className="font-semibold text-left">Fullname</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Email</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Status</div>
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
                              value={d.id} 
                              checked={ (checkedId) && checkedId[index]?.checked || false } 
                              onChange={e => handleChecked(e,d.id)}  id="select_id_users" className="w-3 h-3 border-slate-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-slate-800">{d.namaDepan + " "+ d.namaBelakang}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium ">{ d.email }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">
                          
                          {
                            (d.isActive == 1)
                            ? (<span className="bg-blue-700 hover:bg-blue-900 p-1 rounded-sm 
                            border-0 text-slate-300 
                            text-sm block w-auto py-1 px-1
                            font-medium text-center 
                            hover:text-slate-200 "><FontAwesomeIcon icon={faUserCheck}/> AKTIF</span>)
                            : (<span className="bg-red-700 hover:bg-red-900 p-1 rounded-sm 
                            border-0 text-slate-300 
                            text-sm block w-auto py-1 px-2
                            font-medium text-center 
                            hover:text-slate-200 "><FontAwesomeIcon icon={faUserAltSlash}/> NONAKTIF</span>)
                          }
                        </div> 
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center p-1">
                              <button 
                                onClick={(el) => handleClickDetail(el,d.id)}
                                className='
                                bg-cyan-600 px-4 py-1 rounded-sm 
                                border-0 text-slate-300 
                                h-auto text-sm w-auto
                                font-medium text-center hover:bg-cyan-900
                                hover:text-slate-200 mr-1'
                                ><FontAwesomeIcon icon={faSearch} /> Detail</button>
                              {
                              (d.isActive != 1) 
                              ? (<button 
                                onClick={(e) => handleActive(e,d.id)}
                                className='
                                bg-blue-700 px-2 py-1 rounded-sm 
                                border-0 text-slate-300  w-auto 
                                h-auto text-sm  
                                font-medium text-center hover:bg-blue-900
                                hover:text-slate-200 mr-1'
                                ><FontAwesomeIcon icon={faUserCheck} /></button>)
                                : (<button 
                                  onClick={(e) => handleNonActive(e,d.id)}
                                  className='
                                  bg-red-700 px-2 py-1 rounded-sm 
                                  border-0 text-slate-300  w-auto 
                                  h-auto text-sm  
                                  font-medium text-center hover:bg-blue-900
                                  hover:text-slate-200 mr-1'
                                  ><FontAwesomeIcon icon={faUserAltSlash} /></button>)
                              }
                            { 
                              (isRestore) 
                              ? (<button 
                                onClick={(e) => handleRestore(e,d.id)}
                                className='
                                bg-sky-800 px-4 py-1 rounded-sm 
                                border-0 text-slate-300  w-auto 
                                h-auto text-sm  
                                font-medium text-center hover:bg-sky-900
                                hover:text-slate-200 mr-1'
                                ><FontAwesomeIcon icon={faSyncAlt} /> Restore</button>)
                              : (
                                  <button 
                                  onClick={(el) => handleClickEdit(el,d.id)}
                                  className='
                                  bg-indigo-800 px-4 py-1 rounded-sm 
                                  border-0 text-slate-300  w-auto
                                  h-auto text-sm  
                                  font-medium text-center hover:bg-indigo-900
                                  hover:text-slate-200 mr-1'
                                  ><FontAwesomeIcon icon={faEdit} /> Edit</button>
                                )
                            }
                            
                            <button 
                              onClick={(e) => handleDestroy(e, `${d.namaDepan} ${d.namaBelakang}`,d.id)}
                              className='
                              bg-red-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300  w-auto
                              h-auto text-sm  
                              font-medium text-center hover:bg-red-900
                              hover:text-slate-200' 
                              ><FontAwesomeIcon icon={faTrashAlt} /> Hapus</button>
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