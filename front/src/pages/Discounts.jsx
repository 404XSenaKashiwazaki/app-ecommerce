import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/dicountsSlice'
import Table from '../partials/discounts/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import Modal from '../components/Modal_'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPercent, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons'
import { createBrowserHistory } from 'history'
import ButtonPagination from '../components/ButtonPagination'
import { useDestroyMultipelRolesMutation, useFindAllRolesQuery, useRestoreMultipelRolesMutation } from '../features/api/apiRoleSlice'
import Add from "../partials/discounts/Form"
import { useDestroyMultipelDiscountsMutation, useFindAllDiscountsQuery, useRestoreMultipelDiscountsMutation } from "../features/api/apiDiscountsSlice"
import { Helmet } from 'react-helmet'


function Discounts({ site }) {
  
  const dispatch = useDispatch()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
    {label: 50, value: 50},
    {label: 100, value: 100}
  ]
  const selector = useSelector(state=>state.discounts)
  const { isRestore, message } = selector
  const storagePerpage = localStorage.getItem("cms_perpage_discounts") || 5
  const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
  const [ page, setPage ] = useState(1)
  const [ checkedAll, setCheckedAll ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ checkedId, setCheckedId ] = useState(null)
  const [ id, setId ] = useState(null)
  const [ showModal, setShowModal ] = useState(false)
  const [ data, setData ] = useState([])
  const [ options, setOptions ] = useState({})
  const { data: dataDiscounts,isError, isLoading, error } = useFindAllDiscountsQuery({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
  const [ destroyMultipel ] = useDestroyMultipelDiscountsMutation()
  const [ restoreMultipel ] = useRestoreMultipelDiscountsMutation()
 
  const histosy = createBrowserHistory()

  useEffect(() => {
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])

  useEffect(() => {
    if(dataDiscounts?.response){
      const { discounts, ...options} = dataDiscounts.response
      setData(discounts)
      setOptions(options)
    }
  },[ dataDiscounts ])


  if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
  if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

  const handleClikPaginate = (op) => {
    const { selected } = op
    setPage(selected + 1)
    
    setCheckedId(null)
    setCheckedAll(false)
    localStorage.setItem("cms_page_discounts",selected + 1)
  }

  const handleClickAddForm = (e) => {
    e.stopPropagation()
    setShowModal(true)
  } 

  return (
    <div>
      <Helmet>
            <title>{ site } - Discounts</title>
        </Helmet>
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      {/* table header */}
      { showModal && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
        <TableHeader 
          title={ <span className="text-md"><FontAwesomeIcon  icon={faPercent}/> Data Discounts</span> }
          type="modal"
          pageName="discounts"
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
          handleClickBtnAdd={handleClickAddForm}
          setMessage={setMessage}
        />
        {/* end table header */}
        {/* table */}
        <Table 
          data={data}
          setShowModal={setShowModal}
          checkedAll={checkedAll}
          setCheckedAll={setCheckedAll}
          setCheckedId={setCheckedId}
          destroy={destroyMultipel}
          restore={restoreMultipel}
          setPage={setPage}
          checkedId={checkedId}
          isRestore={isRestore}
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

export default Discounts