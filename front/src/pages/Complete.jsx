import React, { useEffect, useReducer, useState } from 'react'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useFindAnimeCompleteQuery } from '../features/api/apiHomeSlice';
import MenuSearchHome from '../components/MenuSearchHome'
import CardSeries from '../components/CardSeries'
import HomePaginate from '../components/HomePaginate';
function Complete() {
    const [ perPage,setPerPage ] = useState(12)
    const [ page, setPage ] = useState(1)
    const [ search, setSearch ] = useState("")
    const [ totals, setTotals ] = useState(null)
    const [ totalsPage, setTotalsPage ] = useState(null)
    const [ others,setOthers ] = useState(null)
    const [ complete, setComplete ] = useState([])
    const { data: dataComplete } = useFindAnimeCompleteQuery({ search ,page, perPage })

    useEffect(() => {
      if(dataComplete?.response?.series) {
        const { series, totals,offset, page, perPage,totalsPage  } = dataComplete.response
        setPage(page)
        setPerPage(perPage)
        setTotals(totals)
        setTotalsPage(totalsPage)
        setComplete(series)
      }
    },[  dataComplete ])
    
    const handleClikPaginate = ({ selected }) => {
        setPage(selected + 1)
    }

    return (
        <div className="mx-1 h-auto md:mx-auto md:w-fit box-border mt-10">
        <MenuSearchHome setSearch={setSearch} />
        {/* card epiosode terbaru */}
        <div className="md:w-[850px] mx-5 shadow-2xl">
            <div className="flex justify-end mb-3">
               <div>
                    <h1 className="text-sm md:font-semibold text-slate-50 btn btn-sm bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800 px-4">COMPLETE</h1>
               </div>
               <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
               </div>
            </div>
            <div className="w-full h-full overflow-hidden grid grid-cols-1 justify-center md:grid-cols-2 gap-5 md:px-5">
            { complete && complete.map(e=> <Link key={e.id_series} to={"/anime/"+e?.slug_series} > <CardSeries item={e}/></Link>) }
           
           
            </div>
            <div className="mt-5 mb-5 flex justify-end ">
              {/* pagination  */}
              { complete.length > 0 ? 
              <>
                 <HomePaginate
                  data={complete}
                  setPage={setPerPage} 
                  page={page} 
                  totalsPage={totalsPage}
                  perPage={perPage}
                  totals={totals}
                  handleClikPaginate={handleClikPaginate}
                />
              </> 
              : <>
                <div className="bg-red-800 text-slate-200 p-2 w-full"> <FontAwesomeIcon icon={faTriangleExclamation} /> Tidak ada data</div>
              </>
            }
              {/* pagination */}
            </div>
        </div>

        </div>
    )
}

export default Complete