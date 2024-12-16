import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/dicountsSlice"
import Modal from "../../components/Modal_"
import { useFindOneDiscountsQuery, useStoreMultipelDiscountsMutation, useUpdateMultipelDiscountsMutation } from "../../features/api/apiDiscountsSlice"
import { formatDate } from "../../utils/Utils"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        diskon: "",
        deskripsi:"",
        tanggal_mulai: "",
        tanggal_berakhir: "",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ discounts: [newForm] })
    const { data } = useFindOneDiscountsQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateMultipelDiscountsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMultipelDiscountsMutation()

    useEffect(() => {
        if(data?.response?.discounts) setForm({ discounts: [{
            discounts_id: data.response.discounts.id,
            diskon: data.response.discounts.diskon,
            deskripsi: data.response.discounts.deskripsi,
            tanggal_mulai: data.response.discounts.tanggal_mulai,
            tanggal_berakhir: data.response.discounts.tanggal_berakhir,
            tanggal_mulai_old: data.response.discounts.tanggal_mulai,
            tanggal_berakhir_old: data.response.discounts.tanggal_berakhir,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        e.preventDefault()
        const { name,value } = e.target
    
        const [...list] = form.discounts;
        list[i][name] = value
        setForm({ discounts: list })
    }

    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            console.log({ error });
            
            const inpt = form.discounts.map(val => ({...val, error: ""}))
            let msg = []
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const name = err.param.match(/\.([A-Za-z]+)/)[1]
                    
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter) => {
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [name]: d  }
                
                })
            }
            setForm({ discounts: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.discounts

        const newList = list.map(() => newForm)
        setForm({ discounts: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ discounts: [...form.discounts, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.discounts

        list.splice(i,1)
        setForm({ discounts: list })
    }

    const ButtonModal = () => {
        return (
            <div>
            { id 
                ? <>

                    <button 
                        type='button'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingUpdate) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Simpan</span> }
                    </button>
                </>
                : <> 
                    <button 
                        type='submit'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingAdd) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Tambah</span> }
                    </button>
                </>
            }
            </div>
        )
    }

    const ModalTitle = () => {
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Discounts</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Discounts</span>
    }

    return (
        <>
        <Modal mt={"mt-5"} setId={setId} type="sm" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.discounts.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="w-full mb-2">
                            <label htmlFor="diskon" className="font-semibold">Diskon</label>
                            <input 
                                type="number" 
                                onChange={(e) => handleChange(e,index)} 
                                value={item.diskon} 
                                name="diskon" 
                                id="diskon" 
                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                placeholder="Masukan Diskon"/>
                            <ErrorMsg message={item.error?.diskon || ""} />
                        </div>
                        <div className="w-full mb-2">
                            <label htmlFor="tanggal_mulai" className="font-semibold">Tanggal Mulai</label>
                            <input 
                                type="date" 
                                onChange={(e) => handleChange(e,index)} 
                                value={formatDate(item.tanggal_mulai)} 
                                name="tanggal_mulai" 
                                id="tanggal_mulai" 
                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" />
                            <ErrorMsg message={item.error?.tanggal_mulai || ""} />
                        </div>
                        <div className="w-full mb-2">
                            <label htmlFor="tanggal_berakhir" className="font-semibold">Tanggal Berakhir</label>
                            <input 
                                type="date" 
                                onChange={(e) => handleChange(e,index)} 
                                value={formatDate(item.tanggal_berakhir)} 
                                name="tanggal_berakhir" 
                                id="tanggal_berakhir" 
                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" />
                            <ErrorMsg message={item.error?.tanggal_berakhir || ""} />
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="deskripsi" className="font-semibold">Deskripsi</label>
                            <textarea 
                                onChange={(e) => handleChange(e,index)} 
                                value={item.deskripsi} 
                                name="deskripsi" 
                                id="deskripsi" 
                                placeholder="Masukan Deskripsi"
                                className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                />
                            <ErrorMsg message={item.error?.deskripsi || ""} />
                        </div>
                        { (index != 0) && (<div className="mt-4 ">
                        <button 
                            type='button'
                            onClick={(e) => handleClickDeleteForm(e,index)}
                            className='
                            bg-red-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-red-900 mr-1'
                            > <span><FontAwesomeIcon icon={faTrash} /> Hapus</span> 
                        </button>
                        </div>) }

                        <div className="mt-4 flex justify-between gap-1 items-center">
                        { index == (form.discounts.length -1) && (<>
                        
                        <div>
                       { !id &&  <button 
                            type='button'
                            onClick={handleClickAddForm}
                            className='
                            bg-indigo-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-indigo-900 mr-1'
                            > <span><FontAwesomeIcon icon={faPlus} /> Tambah Form</span> 
                        </button> }
                        </div>
                        <div>
                        <button 
                            type='button'
                            onClick={handleClickReset}
                            className='
                            bg-red-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-red-900 mr-1'
                            > <span><FontAwesomeIcon icon={faRefresh} /> Reset</span> 
                        </button>
                        </div>

                        </>) }
                        </div>
                    </div>
                )
            })  }
            </div>
        </div>
        </Modal>
        </>
    ) 
}

export default Form