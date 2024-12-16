import { NavLink } from 'react-router-dom'
import { useDebouncedCallback } from "use-debounce"
import Select from "react-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faRecycle, faTrashAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { mySwal } from '../utils/sweetalert'


function TableHeader({ 
    title,
    type,
    pageName,
    setCheckedAll,
    setCheckedId,
    setPerPage,
    perPage, 
    setPage,
    setSearch,
    selectPerpage,
    fetchDataDestroyAll,
    datas,
    setIsRestore,
    isRestore,
    fetchDataRestoreAll,
    checkedId,
    handleClickBtnAdd,
    setMessage,
}) {
      
    const dispatch = useDispatch()
    const path = location.pathname
    const countIdChecked = () => {
        let id = [];
        (checkedId) && checkedId.forEach(e=> { if(e.checked) id.push(e.id) })
        return id
    }

    const idDelete = countIdChecked()

    const handleKlikHapusBanyak = () => {
        const permanent =  `?permanent=${ isRestore ? `true`: `false` }`
        const msgAlert =  `Anda akan menghapus ${isRestore ? `(Permanent)` : `` } ${ idDelete.length } data!` 
        if(idDelete.length > 0){
           mySwal.fire({
                title: 'Apakah anda yakin?',
                text: msgAlert,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Tidak, batal!',
                reverseButtons: true
            }).then(async (result) => {
            if (result.isConfirmed) {
                setPage(1)
                setCheckedAll(false)
                setCheckedId(null)
                try {
                    const res = await fetchDataDestroyAll({ id: idDelete, permanent }).unwrap()
                    dispatch(setMessage(res.message))
                } catch (error) {
                    console.log(error)
                }
            } 
            else if(result.dismiss === mySwal.DismissReason.cancel) {
                resetChechked()
               mySwal.fire(
                'Cancelled',
                'Aman, data anda tidak jadi di hapus :)',
                'error'
                )
            }
            })
        }else{
            if(datas.length == 0){
                setCheckedAll(false)
            }
            const swalMsg = datas.length == 0 ? "Tidak ada data" : 'Silahkan centang salah satu data :)'
           mySwal.fire(
                'Cancelled',
                swalMsg,
                'error'
            )
        }
    }

    const resetChechked = () => {
        setCheckedAll(false)
        setCheckedId(null)
    }

    const handlePerpage = ({ value }) => {
        setPage(1)
        setPerPage(value)
        localStorage.setItem("cms_perpage_"+pageName,value)
        setCheckedAll(false)
        setCheckedId(null)
    }

    const hancleChangeInptCari = useDebouncedCallback( e =>{
        setPage(1)
        setSearch(e.target.value)
    },700, { maxWait: 2000 })

    const handleChangeRestore = ({ target }) => {
        const { checked } = target
        setCheckedAll(false)
        setCheckedId(null)
        dispatch(setIsRestore(checked))
        setPage(1)
        localStorage.setItem("cms_"+pageName+"_isrestore",checked)
        // refetch()
    }

    const handleClickRestoreMultipel = async () => {
        const idDelete = countIdChecked()
        if(idDelete.length  > 0) {
            try {              
                setPage(1)
                setCheckedAll(false)
                setCheckedId(null)
                const res = await fetchDataRestoreAll({ id: idDelete }).unwrap()
                dispatch(setMessage(res.message))
            } catch (error) {
                console.log(error)
            }
        }else{
            if(datas.length == 0){
                setCheckedAll(false)
            }
            const swalMsg = datas.length == 0 ? "Tidak ada data" : 'Silahkan centang salah satu data :)'
           mySwal.fire(
                'Cancelled',
                swalMsg,
                'error'
            )
        }
    }

    return (
        <>
            <header className="px-5 py-4 border-b border-slate-100 ">
            <div className="flex justify-between">
            <h2 className="font-semibold text-slate-800  flex-initial">{ title }</h2>
            <div className="flex justify-end items-center gap-2  w-auto">
            {/* { (idDelete.length > 0 && isRestore == false) && (
            <NavLink to={toUpdate}>
            <button className=" bg-indigo-800 p-1 rounded-sm 
            border-0 text-slate-300  w-auto
            h-auto text-sm px-3
            font-medium text-center hover:bg-indigo-900
            hover:text-slate-200 "><FontAwesomeIcon  icon={faEdit} /> Edit Banyak</button>
            </NavLink>
            )} */}
            { type != "noButton" &&   <button 
            onClick={handleKlikHapusBanyak}
            className='
            bg-red-800 p-1 rounded-sm 
            border-0 text-slate-300 
            h-auto text-sm  w-auto px-3
            font-medium text-center hover:bg-red-900
            hover:text-slate-200'
            ><FontAwesomeIcon  icon={faTrashAlt} /> Hapus Banyak</button> }
            { isRestore && (
                <button 
                onClick={handleClickRestoreMultipel}
                className='
                bg-sky-800 p-1 rounded-sm 
                border-0 text-slate-300 
                h-auto text-sm  w-auto px-3
                font-medium text-center hover:bg-sky-900
                hover:text-slate-200'
                ><FontAwesomeIcon  icon={faUndoAlt} /> Restore Banyak</button>
            ) }
            
            { !["contact","comment"].includes(path.split("/")[2]) && (
                <>
                { type != "noAdd" && <></> }
                {  type == "modal"
            ?   (<button  
                    onClick={handleClickBtnAdd}
                    className='
                    bg-blue-800 p-1 rounded-sm 
                    border-0 text-slate-300 
                    h-auto text-sm w-auto px-3
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200'
                    ><FontAwesomeIcon  icon={faAdd} /> Tambah
                </button>) 
            :   

                (<>{ (type != "noAdd" && type != "noButton") && (<NavLink 
                    to={to} 
                    className='
                    bg-blue-800 p-1 rounded-sm 
                    border-0 text-slate-300 
                    h-auto text-sm w-auto px-3
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200'
                    ><FontAwesomeIcon  icon={faAdd} />
                    Tambah
                </NavLink>) }</>)
                }
                </>
            ) }
            
            </div>
            </div>
            
            <div className="flex justify-end mt-4 px-1 items-center">
            <div className="flex justify-between gap-1">
            { type != "noButton" &&  <div className="flex justify-between items-center w-auto">
                <label htmlFor="filRestore" className="w-auto px-1 py-1 font-medium "><FontAwesomeIcon size='2x' icon={faRecycle} /></label>
                <input type="checkbox" 
                    // disabled={disabled} 
                    checked={isRestore ? true : false} 
                    onChange={handleChangeRestore} className="mx-auto my-auto " name="filRestore" id="filRestore" 
                />
            </div> }
            <div className="w-auto">
            <Select 
                    options={selectPerpage}
                    // isDisabled={datas.length == 0 ? true : false}
                    defaultValue={selectPerpage.filter(el=> el.value == perPage)}
                    name="perpage" 
                    id="perpage" 
                    className="max-h-md  w-40 rounded-sm h-full text-sm py-0 px-0 m-0"
                    onChange={handlePerpage}
                    placeholder="Select perpage"
                />
            </div>
            <div className="w-full ">
                <input type="text" 
                    // disabled={ disabled } 
                    onChange={hancleChangeInptCari} placeholder="Cari data..." 
                    className="max-w-lg text-sm w-full h-[38px] py-1 rounded-sm" 
                />
            </div>
            </div>
            </div>
            </header>
        </>
        ) 
    }

export default TableHeader