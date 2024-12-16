import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/ordersSlice'
import { useDestroyProductsMutation, useFindAllProductsQuery, useRestoreProductsMutation } from "../features/api/apiProductsSlice"
import Table from '../partials/orders/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faUsers } from '@fortawesome/free-solid-svg-icons'
import ButtonPagination from '../components/ButtonPagination'
import Add from "../partials/orders/Form"
import Detail from '../partials/orders/Detail'
import FormAddImage from '../partials/orders/FormImage'
import { useDestroyOrderBackMutation, useFindAllOrderBackQuery, useRestoreOrderBackMutation } from '../features/api/apiOrders'
import ContactModal from '../components/ContactModal'
import { Helmet } from 'react-helmet'

const Orders = ({ site }) => {
  const dispatch = useDispatch()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
    {label: 50, value: 50},
    {label: 100, value: 100}
  ]
  const selector = useSelector(state=>state.orders)
  const { isRestore, message } = selector
  const { dataUser } = useSelector(state=> state.auth)
  const storagePerpage = localStorage.getItem("cms_perpage_orders") || 5
  const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
  const [ page, setPage ] = useState(1)
  const [ checkedAll, setCheckedAll ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ checkedId, setCheckedId ] = useState(null)
  const [ showModal, setShowModal ] = useState(false)
  const [ showModalAddImage, setShowModalAddImage ] = useState(false)
  const [ showModalDetail, setShowModalDetail ] = useState(false)
  const [ showModalContact, setShowModalContact ] = useState(false)
  const [ data, setData ] = useState([])
  const [ options, setOptions ] = useState({})
  const [ id, setId ] = useState(null)
  const [ totalsFilters, setTotalsFilters ] = useState(0)
  const { data: dataOrders,isError, isLoading, error } = useFindAllOrderBackQuery({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
  const [ destroyMultipel ] = useDestroyOrderBackMutation()
  const [ restoreMultipel ] = useRestoreOrderBackMutation()
  const [ itemContact, setItemContact ] = useState(null)

  useEffect(() => {
    console.log(message);
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])

  useEffect(() => {
    if(dataOrders?.response){
      const { orders, ...options} = dataOrders.response
      setData(orders)
      setOptions(options)
    }
  },[ dataOrders ])


  if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
  if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

  const handleClikPaginate = (op) => {
    const { selected } = op
    setPage(selected + 1)
    
    setCheckedId(null)
    setCheckedAll(false)
    localStorage.setItem("cms_page_orders",selected + 1)
  }

  const handleClickAddForm = (e) => {
    e.stopPropagation()
    setShowModal(true)
  } 
  

  return (
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
        <Helmet>
            <title>{ site } - Orders</title>
        </Helmet>
        {/* table header */}
        { showModal && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
        { showModalDetail && <Detail id={id} setId={setId} showModal={showModalDetail} setShowModal={setShowModalDetail}/> }
        { showModalAddImage && <ContactModal title={"Conntact"} id={id} itemContact={itemContact} showModal={showModalAddImage} setShowModal={setShowModalAddImage } /> }

        <TableHeader 
          title={<span className="text-md"><FontAwesomeIcon  icon={faBagShopping}/> Data Orders</span>}
          type="noAdd"
          pageName="orders"
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
          setShowModalDetail={setShowModalDetail}
          setId={setId}
          setMessage={setMessage}
          setShowModalAddImage={setShowModalAddImage}
          dataUser={dataUser}
          setItemContact={setItemContact}
        />
        {/* end table */}
        {/* pagination */}
        { 
          <ButtonPagination 
          data={data} 
          page={options.page}
          totalsPage={options.totalsPage}
          perPage={options.perPage}
          totals={options.totals}
          handleClikPaginate={handleClikPaginate}
          totalsFilters={totalsFilters}
        />
        }
        {/* end pagination */}
      </div>
  )
}

export default Orders