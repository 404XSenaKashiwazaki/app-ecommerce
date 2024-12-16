import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/contactSlice'
import Table from '../partials/contact/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import Modal from '../components/Modal_'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import ButtonPagination from '../components/ButtonPagination'
import Add from "../partials/contact/Form"
import Detail from '../partials/contact/Detail'
import { useFindAllContact_Query, useDeleteContact_Mutation, useRestoreContact_Mutation } from '../features/api/apiContactSlice'
import { Helmet } from 'react-helmet'

function Comment({ site }) {
  
  const dispatch = useDispatch()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
    {label: 50, value: 50},
    {label: 100, value: 100}
  ]
  const selector = useSelector(state=>state.contacts)
  const { isRestore, message } = selector
  const storagePerpage = localStorage.getItem("cms_perpage_contacts") || 5
  const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
  const [ page, setPage ] = useState(1)
  const [ checkedAll, setCheckedAll ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ checkedId, setCheckedId ] = useState(null)
  const [ id, setId ] = useState(null)
  const [ showModal, setShowModal ] = useState(false)
  const [ showModalDetail, setShowModalDetail ] = useState(false)
  const [ data, setData ] = useState([])
  const [ options, setOptions ] = useState({})
  const { data: dataContacts,isError, isLoading, error } = useFindAllContact_Query({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
  const [ destroyMultipel ] = useDeleteContact_Mutation()
  const [ restoreMultipel ] = useRestoreContact_Mutation()

  useEffect(() => {
    if(message) Toast.fire({ text: message, icon: "success"})
    dispatch(removeMessage())
  },[dispatch, message])

  useEffect(() => {
    if(dataContacts?.response){
      const { contacts, ...options} = dataContacts.response
      setData(contacts)
      setOptions(options)
    }
  },[ dataContacts ])


  if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
  if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

  const handleClikPaginate = (op) => {
    const { selected } = op
    setPage(selected + 1)
    
    setCheckedId(null)
    setCheckedAll(false)
    localStorage.setItem("cms_page_contacts",selected + 1)
  }

  const handleClickAddForm = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <div>
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
        <Helmet>
            <title>{ site } - Contacts</title>
        </Helmet>
        {/* table header */}
        { showModal && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
        { showModalDetail && <Detail id={id} setId={setId} showModal={showModalDetail} setShowModal={setShowModalDetail}/> }
        <TableHeader 
          title={ <span className="text-md"><FontAwesomeIcon  icon={faUsers}/> Data Contacts</span> }
          type="modal"
          pageName="contacts"
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