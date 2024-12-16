import { useDispatch } from "react-redux"
import { useFindOneProductsQuery, useStoreImageProductsMutation, useStoreProductsMutation, useUpdateProductsMutation } from '../../features/api/apiProductsSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/productsSlice"
import Modal from "../../components/Modal_"

const FormAddImage = ({ id, setId, showModal, setShowModal }) => {
    const dispatch = useDispatch()
    const { data, isError } = useFindOneProductsQuery({ slug: id  },{ skip: (id) ? false : true })
    const [ update, { isLoading: loadingUpdate }] = useUpdateProductsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreImageProductsMutation()
    const [ ProductId, setProductId ] = useState(null)
    const newForm =  [{
        nama_image: "gambar-produk.png",
        url_image: "http://localhost:8000/products/gambar-produk.png",
        ProductId: ProductId,
        error: null
    }]
    const [ form, setForm ] = useState({ products: [] })

    useEffect(() => {
        if(data?.response?.products) {
            setForm({ products: [...data.response.products.ImageProducts.map(e=> ({...e, namaImageOld: e.nama_image,urlImageOld: e.url_image,error: null}))]} ) 
            setProductId(data.response.products.id)
        }
    }, [data])

    console.log(form);

    
    const handleChangeFile = (e,i) => {
        e.preventDefault()
        const files = e.target.files[0]

        const reader = new FileReader
        const [...list] = form.products
        
        if(files?.size > 5*1000*1000){
            list[i].error = {
                nama_image: "File yang di upload terlalu besar!"
            }
            list[i] = {
                nama_image: "gambar-produk.png",
                url_image: "http://localhost:8000/products/gambar-produk.png",
                ProductId
            }
            setForm({ products: list })
        }else{
            const err = list[i].error
            list[i].error = { ...err, nama_image: null }

            reader.addEventListener("load", () => {
                list[i] = {
                    ...list[i],
                    nama_image: files,
                    url_image: reader.result,
                    ProductId: ProductId
                }
                setForm({ products: list })
            })
            if(files) reader.readAsDataURL(files)
        }  
    }

    const handleClickSave = async (e) => {
        e.preventDefault()
        try {
            const res = await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.products.map(val => ({...val, error: ""}))
            let msg = []
            console.log({ error });
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err,errIndex) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const name = err.param.match(/\.([A-Za-z]+_[A-Za-z]+|[A-Za-z]+)/)[1]
            
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter,filterIndex) => {
                        console.log(filter[0] == indexErr);
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [name]: d  }
                
                })
            }
            setForm({ products: inpt })
        }
    }

    const handleClickReset = (e,i) => {
        e.preventDefault()
        const list = form.products
        list[i] = newForm
        console.log(list);
        setForm({ products: list })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        // setForm({ products: [...form.products, newForm ] }) tidak berhasil di form yg jumlah inputnya sedikit
        
        setForm({ products: [...form.products, ...newForm]  })
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const list = form.products
        list.splice(i,1)
        setForm({ products: list })
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
        return <span><FontAwesomeIcon icon={faPlus}/> Tambah Gambar Products</span>
    }

    return (
        <> 
        <Modal setId={setId} type="lg" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
            <div className="w-full mb-1 p-4 h-auto">
            { form.products.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-0"></div>) }
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="w-full sm:w-2/2 ml-1 mt-10 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-9">
                            <div className="w-full mb-10">
                                <div className="shadow-xl h-80">
                                    <img src={ item.url_image } alt="" className="w-full h-full"/>
                                    <div className="w-full mb-2 mt-2">
                                        <label htmlFor="poster" className="font-semibold">Gambart Produk</label>
                                        <input type="file" onChange={(e) => handleChangeFile(e,index)} name="image_produk" id="image_produk" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Gambar Produk"/>
                                        <ErrorMsg message={item.error?.image_produk || ""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex">
                        <button 
                            type='button'
                            onClick={(e) => handleClickReset(e,index)}
                            className='
                            bg-red-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-red-900 mr-1'
                            > <span><FontAwesomeIcon icon={faRefresh} /> Reset</span> 
                        </button>
                        { (index != 0) && (<>
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
                        </>) }
                        { index == (form.products.length -1) && (<button 
                            type='button'
                            onClick={handleClickAddForm}
                            className='
                            bg-indigo-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-indigo-900 mr-1'
                            > <span><FontAwesomeIcon icon={faPlus} /> Tambah Form</span> 
                        </button>) }
                        </div>
                        </div>
                    </div>
                </div>
                )
            })  }
            </div>
            </Modal>
        </>
    ) 
}

export default FormAddImage