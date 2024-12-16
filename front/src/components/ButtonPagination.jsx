import React from 'react'
import ReactPaginate from 'react-paginate'

function ButtonPagination({ data,page,totalsPage,perPage,totals,handleClikPaginate,totalsFilters=0}) {

  return (
    <>
      { data.length > 0 ? 
          <div className="flex md:items-center flex-col md:flex-row md:justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-7">
          <div className="flex flex-col">
            <div>Page { page } dari total {totalsPage} page</div>
            <div>Tampilkan { data.length > 0 ?  data.length : 0 } data dari total { totals } data</div>
          </div>
          <div>
            <ReactPaginate
            forcePage={page - 1}
            containerClassName="flex gap-1"
            breakLabel="..."
            nextLabel={
              page != totalsPage && data.length > 0 ? <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10  focus:outline-offset-0">Next </div> : <></>
            }
            onPageChange={handleClikPaginate}
            pageRangeDisplayed={5}
            pageCount={totalsPage}
            pageClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:text-black hover:bg-gray-50 focus:z-10  focus:outline-offset-0"
            previousLabel={
                page && page != 1 ? <div className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10  focus:outline-offset-0">Previous</div> : <></>
            }
            activeClassName="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-10  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />      
          </div>
        </div>
          : <div className="bg-red-800 text-slate-200 p-2 w-full">Tidak ada data</div>
        }
        
    </>
  )
}

export default ButtonPagination