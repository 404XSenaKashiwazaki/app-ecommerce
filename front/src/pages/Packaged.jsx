import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setMessage} from '../features/packagedSlice'
import Table from '../partials/packaged/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesPacking } from '@fortawesome/free-solid-svg-icons'
import ButtonPagination from '../components/ButtonPagination'
import Detail from '../partials/packaged/Detail'
import { useNavigate } from 'react-router-dom'
import { 
  useStoreContactMutation,
} from  "../features/api/apiContactSlice"
import ContactModal from '../components/ContactModal'
import { useCancelProductsPackagedMutation, useFindAllProductsPackagedQuery } from '../features/api/apiPackaged'
import { Helmet } from 'react-helmet'

const Packaged = ({ site }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectPerpage = [
    {label: 5, value: 5},
    {label: 25, value: 25},
        {label: 50, value: 50},
        {label: 100, value: 100}
    ]
    const selector = useSelector(state=>state.packaged)
    const { dataUser } = useSelector(state=> state.auth)
    const { isRestore, message } = selector
    const storagePerpage = localStorage.getItem("cms_perpage_packaged") || 5
    const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)
    const [ page, setPage ] = useState(1)
    const [ checkedAll, setCheckedAll ] = useState(false)
    const [ search, setSearch ] = useState("")
    const [ checkedId, setCheckedId ] = useState(null)
    const [ showModalDetail, setShowModalDetail ] = useState(false)
    const [ data, setData ] = useState([])
    const [ options, setOptions ] = useState({})
    const [ id, setId ] = useState(null)
    const [ totalsFilters, setTotalsFilters ] = useState(0)
    const { data: dataNotPaid, isError, isLoading, error  } = useFindAllProductsPackagedQuery({ username: dataUser?.username, restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: (navigate || isRestore),skip: (dataUser) ? false: true })
    const [ cancelTransaction ] = useCancelProductsPackagedMutation()
    const [ contact, {isLoading: isLoadingSotore} ] = useStoreContactMutation()
    const [ msg, setMsg ] = useState()
    const [ user,setUser ] = useState(null)
    const [ showContact, setShowContact ] = useState(false)
    const [ itemContact, setItemContact ] = useState(null)

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        if(msg) Toast.fire({  text: msg, icon: "error"})
        dispatch(removeMessage())
        setMsg("")
    },[dispatch, message, msg])

    useEffect(() => {
        if(dataNotPaid?.response){
        const { orders, ...options} = dataNotPaid.response
        setData(orders)
        setOptions(options)
        }
    },[ dataNotPaid ])

    useEffect(() => {
        if(dataUser) {
            setUser({
                userId: dataUser.id,
                email: dataUser.email,
                username: dataUser.username,
                content: "",
                error: null
            })
        }
    },[dataUser])

    if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
    if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

    const handleClikPaginate = (op) => {
        const { selected } = op
        setPage(selected + 1)
        setCheckedId(null)
        setCheckedAll(false)
        localStorage.setItem("cms_page_packaged",selected + 1)
    }

    const handleCancelOrders = async transactionId => {
        try {
            const res = await cancelTransaction({ data: { transactionId },username: dataUser.username }).unwrap()
            console.log({ res });
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error)
            setMsg(error.data.errors[0].msg)
        }
    }

    const handleContact = async () => {
        try {
            const res = await contact({ data: user, userid: dataUser?.id ? dataUser.id : null }).unwrap()        
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
            <Helmet >
                <title>{ site } - Dikemas</title>
            </Helmet>
            {/* table header */}
            { showModalDetail && <Detail username={dataUser.username} id={id} setId={setId} showModal={showModalDetail} setShowModal={setShowModalDetail}/> }
            { showContact && <ContactModal title={"Hubungi penjual"} id={id} itemContact={itemContact} showModal={showContact} setShowModal={setShowContact} /> }

            <TableHeader 
            title={ <span className="text-md"><FontAwesomeIcon  icon={faBoxesPacking}/> Dikemas</span> }
            type="noButton"
            pageName="packaged"
            search={search}
            setCheckedAll={setCheckedAll}
            setCheckedId={setCheckedId}
            setPerPage={setPerPage}
            perPage={perPage} 
            setPage={setPage}
            setSearch={setSearch}
            selectPerpage={selectPerpage}
            fetchDataDestroyAll=""
            datas={data}
            setIsRestore=""
            isRestore={isRestore}
            fetchDataRestoreAll=""
            checkedId={checkedId}
            handleClickBtnAdd=""
            setMessage={setMessage}
            />
            {/* end table header */}
            {/* table */}
            <Table 
                data={data}
                setItemContact={setItemContact}
                setShowModalDetail={setShowModalDetail}
                setId={setId}
                handleCancelOrders={handleCancelOrders}
                handleContact={handleContact}
                setShowContact={setShowContact}
                dataUser={dataUser}
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

export default Packaged
