import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/productsSlice'
import { useDestroyProductsMutation, useFindAllProductsQuery, useRestoreProductsMutation } from "../features/api/apiProductsSlice"
import Table from '../partials/products/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import ButtonPagination from '../components/ButtonPagination'
import Add from "../partials/products/Form"
import Detail from '../partials/products/Detail'
import FormAddImage from '../partials/products/FormImage'
import { Helmet } from 'react-helmet'

const Products = ({ site }) => {
  const dispatch = useDispatch()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
    {label: 50, value: 50},
    {label: 100, value: 100}
  ]
  const selector = useSelector(state=>state.products)
  const { isRestore, message } = selector
  const storagePerpage = localStorage.getItem("cms_perpage_products") || 5
  const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
  const [ page, setPage ] = useState(1)
  const [ checkedAll, setCheckedAll ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ checkedId, setCheckedId ] = useState(null)
  const [ showModal, setShowModal ] = useState(false)
  const [ showModalAddImage, setShowModalAddImage ] = useState(false)
  const [ showModalDetail, setShowModalDetail ] = useState(false)
  const [ data, setData ] = useState([])
  const [ options, setOptions ] = useState({})
  const [ id, setId ] = useState(null)
  const [ totalsFilters, setTotalsFilters ] = useState(0)
  const { data: dataProducts,isError, isLoading, error } = useFindAllProductsQuery({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
  const [ destroyMultipel ] = useDestroyProductsMutation()
  const [ restoreMultipel ] = useRestoreProductsMutation()
 

  useEffect(() => {
    console.log(message);
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])

  useEffect(() => {
    if(dataProducts?.response){
      const { products, ...options} = dataProducts.response
      setData(products)
      setOptions(options)
    }
  },[ dataProducts ])


  if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
  if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

  const handleClikPaginate = (op) => {
    const { selected } = op
    setPage(selected + 1)
    
    setCheckedId(null)
    setCheckedAll(false)
    localStorage.setItem("cms_page_products",selected + 1)
  }

  const handleClickAddForm = (e) => {
    e.stopPropagation()
    setShowModal(true)
  } 
  
  console.log(dataProducts);
  
  return (
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
        <Helmet >
            <title>{ site } - Data Products</title>
        </Helmet>
        {/* table header */}
        { showModal && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
        { showModalDetail && <Detail id={id} setId={setId} showModal={showModalDetail} setShowModal={setShowModalDetail}/> }
        { showModalAddImage && <FormAddImage  showModal={showModalAddImage} setShowModal={setShowModalAddImage} setId={setId} id={id}/> }

        <TableHeader 
          title={ <span className="text-md"><FontAwesomeIcon  icon={faUsers}/> Data Products</span> }
          type="modal"
          pageName="products"
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

export default Products