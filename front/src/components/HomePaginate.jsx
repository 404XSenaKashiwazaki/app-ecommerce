import ReactPaginate from 'react-paginate'

const HomePaginate = ({ data,page,totalsPage,perPage,totals,setPage,setPerpage,handleClikPaginate }) => {

    
    return <>
      { data.length > 0 ? <div  className="flex items-center justify-between  px-4 py-3 sm:px-6 mt-7" key={ perPage || totals }>
        <ReactPaginate
            containerClassName="flex gap-1"
            breakLabel="..."
            nextLabel={
              (page != totalsPage && data.length > 0) && <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-indigo-400 ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 focus:z-10  focus:outline-offset-0">Next </div>
            }
            onPageChange={handleClikPaginate}
            pageRangeDisplayed={5}
            pageCount={totalsPage}
            pageClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-900 ring-1 ring-inset ring-indigo-300 hover:text-black hover:bg-indigo-50 focus:z-10  focus:outline-offset-0"
            previousLabel={
                page != 1 && <div className="relative inline-flex items-center rounded-l-md px-2 py-2 text-indigo-400 ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 focus:z-10  focus:outline-offset-0">Previous</div>
            }
            activeClassName="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-10  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
      </div>  : <div className="bg-red-800 text-slate-200 p-2 w-full">Tidak ada data</div> }
    </> 
    
}

export default HomePaginate