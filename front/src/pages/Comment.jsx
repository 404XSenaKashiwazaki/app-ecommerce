import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/commentSlice'
import { 
  useFindAllComment_Query,
  useDeleteAllComment_Mutation,
  useRestoreAllComment_Mutation,
 } from '../features/api/apiCommentSlice'
import Table from '../partials/comment/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import Detail from '../partials/comment/Detail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { createBrowserHistory } from 'history'
import ButtonPagination from '../components/ButtonPagination'
import { Helmet } from 'react-helmet'

function Comment() {
  
  const dispatch = useDispatch()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
    {label: 50, value: 50},
    {label: 100, value: 100}
  ]
  const selector = useSelector(state=>state.comments)
  const { isRestore, message } = selector
  const storagePerpage = localStorage.getItem("cms_perpage_comments") || 5
  const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
  const [ page, setPage ] = useState(1)
  const [ checkedAll, setCheckedAll ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ checkedId, setCheckedId ] = useState(null)
  const [ id, setId ] = useState(null)
  const [ showModalDetail, setShowModalDetail ] = useState(false)
  const [ data, setData ] = useState([])
  const [ options, setOptions ] = useState({})
  const { data: dataComments,isError, isLoading, error } = useFindAllComment_Query({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
  const [ destroyMultipel ] = useDeleteAllComment_Mutation()
  const [ restoreMultipel ] = useRestoreAllComment_Mutation()
 
  const histosy = createBrowserHistory()

  useEffect(() => {
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])

  useEffect(() => {
    if(dataComments?.response){
      const { comments, ...options} = dataComments.response
      setData(comments)
      setOptions(options)
    }
  },[ dataComments ])


  if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
  if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

  const handleClikPaginate = (op) => {
    const { selected } = op
    setPage(selected + 1)
    
    setCheckedId(null)
    setCheckedAll(false)
    localStorage.setItem("cms_page_comments",selected + 1)
  }

  return (
    <div>
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
        {/* table header */}
        { showModalDetail && <Detail id={id} setId={setId} showModal={showModalDetail} setShowModal={setShowModalDetail}/> }
        <TableHeader 
          title={ <span className="text-md"><FontAwesomeIcon  icon={faUsers}/> Data Comments</span> }
          type="modal"
          pageName="comments"
          search={search}
          setCheckedAll={setCheckedAll}
          setCheckedId={setCheckedId}
          setPerPage={setPerPage}
          perPage={perPage} 
          setPage={setPage}
          setSearch={setSearch}
          selectPerpage={selectPerpage}
          fetchDataDestroyAll={destroyMultipel}
          datas={data}
          setIsRestore={setIsRestore}
          isRestore={isRestore}
          fetchDataRestoreAll={restoreMultipel}
          checkedId={checkedId}
          setMessage={setMessage}
        />
        {/* end table header */}
        {/* table */}
        <Table 
          data={data}
          checkedAll={checkedAll}
          setCheckedAll={setCheckedAll}
          setCheckedId={setCheckedId}
          destroy={destroyMultipel}
          restore={restoreMultipel}
          setPage={setPage}
          checkedId={checkedId}
          isRestore={isRestore}
          setShowModalDetail={setShowModalDetail}
          setId={setId}
          setMessage={setMessage}
        />
        {/* end table */}
        {/* pagination */}
        { data.length > 0 ? 
          <>
            <ButtonPagination 
              data={data} 
              page={options.page}
              totalsPage={options.totalsPage}
              perPage={options.perPage}
              totals={options.totals}
              handleClikPaginate={handleClikPaginate}
            />
          </> 
          : <>
            <div className="bg-red-800 text-slate-200 p-2 w-full">Tidak ada data</div>
          </>
        }
        {/* end pagination */}
      </div>
    </div>
  )
}

export default Comment