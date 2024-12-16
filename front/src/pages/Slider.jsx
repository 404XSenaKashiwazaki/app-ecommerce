import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setIsRestore, setMessage} from '../features/sliderSlice'
import Table from '../partials/slider/Table'
import TableHeader from '../components/TableHeader'
import { Toast} from '../utils/sweetalert'
import { createBrowserHistory } from 'history'
import ButtonPagination from '../components/ButtonPagination'
import { useDestroyMultipelSlidersMutation, useFindAllSlidersQuery, useRestoreMultipelSlidersMutation } from "../features/api/apiSlidersSlice"
import Add from "../partials/slider/Form"
import Detail from '../partials/slider/Detail'
import { Helmet } from 'react-helmet'

function Slider() {
    const dispatch = useDispatch()
    const selectPerpage = [
        {label: 5, value: 5},
        {label: 25, value: 25},
        {label: 50, value: 50},
        {label: 100, value: 100}
    ]
    const selector = useSelector(state=>state.sliders)
    const { isRestore, message } = selector
    const storagePerpage = localStorage.getItem("cms_perpage_sliders") || 5
    const [ perPage,setPerPage ] = useState(selectPerpage.filter(sl=> sl.value == parseInt(storagePerpage))[0].value)    
    const [ page, setPage ] = useState(1)
    const [ checkedAll, setCheckedAll ] = useState(false)
    const [ search, setSearch ] = useState("")
    const [ checkedId, setCheckedId ] = useState(null)
    const [ id, setId ] = useState(null)
    const [ showModal, setShowModal ] = useState(false)
    const [ type, setType ] = useState("add")
    const [ data, setData ] = useState([])
    const [ options, setOptions ] = useState({})
    const { data: dataSliders,isError, isLoading, error } = useFindAllSlidersQuery({ restores: isRestore, search, page, perPage },{ refetchOnMountOrArgChange: isRestore})
    const [ destroyMultipel ] = useDestroyMultipelSlidersMutation()
    const [ restoreMultipel ] = useRestoreMultipelSlidersMutation()
    const { site } = useSelector(state=> state.sites)
    const histosy = createBrowserHistory()

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    useEffect(() => {
        if(dataSliders?.response){
            const { sliders, ...options} = dataSliders.response
            setData(sliders)
            setOptions(options)
        }
    },[ dataSliders ])


    if(isError) return <div className="bg-red-600 text-slate-200 p-1 font-medium">{ error }</div>
    if(isLoading) return <div className="bg-sky-600 text-slate-200 p-1 font-medium">request....</div>

    const handleClikPaginate = (op) => {
        const { selected } = op
        setPage(selected + 1)
        
        setCheckedId(null)
        setCheckedAll(false)
        localStorage.setItem("cms_page_sliders",selected + 1)
    }

    const handleClickAddForm = (e) => {
        e.stopPropagation()
        setShowModal(true)
    } 

    return (
        <div>
            <Helmet>
                <title>{ site?.title } - Site</title>
            </Helmet>
            { (showModal && type == "add") && <Add showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
            { (showModal && type == "detail") && <Detail showModal={showModal} setShowModal={setShowModal} setId={setId} id={id}/> }
            {/* table header */}
                <TableHeader 
                    title=""
                    type="modal"
                    pageName="sliders"
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
                    setType={setType}
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
    )
}

export default Slider