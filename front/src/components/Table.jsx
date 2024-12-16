import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ButtonPagination from "./ButtonPagination"

function Table({ posts, paginateOptions }) {

  const [ isRestore, setIsRestore ] = useState(JSON.parse(localStorage.getItem("cms_"+paginateOptions.pageName+"_isrestore")) || false)
  const handleChecked = (evnt,targetId) => {
    const { checked } = evnt.target 
    const t = (paginateOptions.checkedId) ? paginateOptions.checkedId : posts.map(el=> ({id: el.id, checked: false}))
    const id = t.map(e=> {
      if(targetId != "all") return (targetId == e.id) ? { ...e, checked } : e
      return { ...e, checked }
    });

    paginateOptions.setCheckedId(id);
    const tw = id.filter(e=> e.checked == true);
    (tw.length == posts.length) ? paginateOptions.setCheckedAll(true) : paginateOptions.setCheckedAll(false)
  }

  const handleDestroy = (e,title,slug) => {
    e.preventDefault()
    paginateOptions.mySwal.fire({
      title: 'Apakah anda yakin?',
      text: "Anda akan menghapus data: "+title+"?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batal!',
      reverseButtons: true
  }).then(async (result) => {
  if (result.isConfirmed) {
      const permanent = `?permanent=${ paginateOptions.isRestore ? `true`: `false` }`
      paginateOptions.setPage(0)
      paginateOptions.setCheckedAll(false)
      try {
         await paginateOptions.destroy({ slug, permanent }).unwrap()
      } catch (error) {
          console.log(error)
      }
  } 
  else if(result.dismiss ===paginateOptions.mySwal.DismissReason.cancel) {
      paginateOptions.mySwal.fire(
      'Cancelled',
      'Aman, data anda tidak jadi di hapus :)',
      'error'
      )
  }
  })
  }

  const handleRestore = async (e,slug) => {
    e.preventDefault()
    try {
     await paginateOptions.restore({ slug }).unwrap()
     paginateOptions.refetch()
    } catch (error) {
      console.log(error)
    }
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
                          disabled={ posts.length < 1 ? true : false } 
                          checked={  paginateOptions.checkedAll } 
                          onChange={(e) => handleChecked(e,"all")}  id="select_id_episode" className="w-3 h-3 border-slate-400" />
                      </div>
                    </div>
                  </th>
                  { paginateOptions.tableHeader.map((header,hi)=> {
                    return (
                      <th className="p-2 whitespace-nowrap" key={hi}>
                      <div className="font-semibold text-left">{ header.title }</div>
                      </th>
                    )
                  }) }
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {
                posts.length > 0 && posts.map((post,index) => {
                  return (
                    <tr key={post.id}>
                      <td className="p-2 whitespace-nowrap max-w-[30px] overflow-hidden">
                        <div className="flex items-center">
                          <div className="w-full h-full shrink-0">
                            <input type="checkbox"  
                              name={ post.id } 
                              value={post.id} 
                              checked={ (paginateOptions.checkedId) && paginateOptions.checkedId[index]?.checked || false } 
                              onChange={e => handleChecked(e,post.id)}  id="select_id_episode" className="w-3 h-3 border-slate-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0 mr-2 mt-2 sm:mr-3">
                            <img className="rounded-sm w-[40px] max-h-[40px]" src={post.image_url} width="40" height="40" alt={post.title} />
                          </div>
                          <div className="font-medium text-slate-800">{post.title}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">
                          
                          {
                            (post.status == "Publish")
                            ? (<span className="bg-blue-700 hover:bg-blue-900 p-1 rounded-sm 
                            border-0 text-slate-300 
                            text-sm block w-20
                            font-medium text-center 
                            hover:text-slate-200 ">{ post.status }</span>)
                            : (<span className="bg-red-700 hover:bg-red-900 p-1 rounded-sm 
                            border-0 text-slate-300 
                            text-sm block w-20
                            font-medium text-center 
                            hover:text-slate-200 ">{ post.status }</span>)
                          }
                        </div> 
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{ post.views ? post.views : 0 }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center p-1">
                            <NavLink to={`/api/posts/series/detail/${ post.slug }`}>
                              <button 
                              className='
                              bg-cyan-600 p-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-16
                              font-medium text-center hover:bg-cyan-900
                              hover:text-slate-200 mr-1'
                              >Detail</button>
                            </NavLink>
                            { 
                              (paginateOptions.isRestore) 
                              ? (<button 
                                onClick={(e) => handleRestore(e,post.slug)}
                                className='
                                bg-sky-800 p-1 rounded-sm 
                                border-0 text-slate-300  w-16
                                h-auto text-sm  
                                font-medium text-center hover:bg-sky-900
                                hover:text-slate-200 mr-1'
                                >Restore</button>)
                              : (<NavLink to={ `/api/posts/series/edit/${ post.slug }` } >
                                  <button 
                                  className='
                                  bg-indigo-800 p-1 rounded-sm 
                                  border-0 text-slate-300  w-16
                                  h-auto text-sm  
                                  font-medium text-center hover:bg-indigo-900
                                  hover:text-slate-200 mr-1'
                                  >Edit</button>
                                </NavLink>)
                            }
                            
                            <button 
                              onClick={(e) => handleDestroy(e, post.title,post.slug)}
                              className='
                              bg-red-600 p-1 rounded-sm 
                              border-0 text-slate-300  w-16
                              h-auto text-sm  
                              font-medium text-center hover:bg-red-900
                              hover:text-slate-200' 
                              >Hapus</button>
                        </div>
                      </td>
                    </tr>
                  )
                 })
                 
                }
              </tbody>
            </table>
            { posts.length > 0 ? 
              <>
                 <ButtonPagination 
                  data={posts} 
                  page={paginateOptions.page} 
                  totalsPage={paginateOptions.totalsPage}
                  perPage={paginateOptions.perPage}
                  totals={paginateOptions.totals}
                  handleClikPaginate={paginateOptions.handleClikPaginate}
                />
              </> 
              : <>
                <div className="bg-red-800 text-slate-200 p-2 w-full">Tidak ada data</div>
              </>
            }
          </div>
        </div>
    </>
  )
}

export default Table