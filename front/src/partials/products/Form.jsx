import { useDispatch, useSelector } from "react-redux"
import { useCreateProductsSlugMutation, useFindOneProductsQuery, useStoreProductsMutation, useUpdateProductsMutation } from '../../features/api/apiProductsSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/productsSlice"
import { useDebouncedCallback } from "use-debounce"
import Modal from "../../components/Modal_"
import { useFindAllCategoriesQuery } from "../../features/api/apiCategoriesSlice"
import { useFindAllDiscountsQuery } from "../../features/api/apiDiscountsSlice"


const Form = ({ id, setId, showModal, setShowModal }) => {
    const status_produk = ["Tersedia","Tidak Tersedia"]
    const { dataUser } = useSelector(state => state.auth)
    const newForm = {
        "kode_produk": "",
        "nama_produk": "",
        "slug": "",
        "merk":"",
        "berat":"",
        "DiskonId": "",
        "stok_produk": "",
        "harga_produk": "",
        "status_produk": "Tersedia",
        "desk_produk": "",
        "image_produk": [{"nama_image": "gambar-produk", "url_image": "http://localhost:8000/products/gambar-produk.png"}],
        "CategoryId": "",
        "UserId": dataUser.id,
        "error": null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ products: [newForm] })
    const [ categories, setCategories ] = useState([])
    const { data, isError } = useFindOneProductsQuery({ slug: id  },{ skip: (id) ? false : true })
    const [ update, { isLoading: loadingUpdate }] = useUpdateProductsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreProductsMutation()
    const { data: dataCategories } = useFindAllCategoriesQuery({ restores: false,page: 1, search: "", perPage: 10  })
    const [ slug ] = useCreateProductsSlugMutation()
    const [ idImage, setIdImage ] = useState(null)
    const [ diskon, setDiskon ] = useState([])
    const { data: dataDiskon } = useFindAllDiscountsQuery({restores: false, search: "", page:1, perPage:200 })

    useEffect(() => {
        if(data?.response?.products) {
            const ImageProducts = data.response.products.ImageProducts[0]
            setForm({ products: [{  
                products_id: data.response.products.id,
                nama_produk: data.response.products.nama_produk,
                kode_produk: data.response.products.kode_produk,
                slug: data.response.products.slug,
                stok_produk: data.response.products.stok_produk,
                harga_produk: data.response.products.harga_produk,
                status_produk: data.response.products.status_produk,
                desk_produk: data.response.products.desk_produk,
                image_produk: (data.response.products.ImageProducts.length > 0) ? [{...ImageProducts,namaImageOld: ImageProducts.nama_image, urlImageOld: ImageProducts.url_image}]: [{ nama_image: "gambar-produk", url_image: "http://localhost:8000/products/gambar-produk.png", ProductId:  data.response.products.id}],
                CategoryId: data.response.products.CategoryId,
                UserId: data.response.products.UserId,
                merk: data.response.products.merk,
                berat: data.response.products.berat,
                DiskonId: data.response.products.DiskonId,
                error: null
            }] })
            setIdImage(data.response.products.ImageProducts[0].id)
        }
        
    }, [data])

    useEffect(() => {
        if(dataDiskon?.response?.discounts) setDiskon(dataDiskon.response.discounts)
    },[ dataDiskon ])

    useEffect(() => {
        if(dataCategories?.response?.categories) setCategories(dataCategories.response.categories.map(item => ({id: item.id, nama: item.nama})))
    },[ dataCategories ])

    const handleChange = (e,i,type="input",single=false) => {
        const { name,value, checked } = e.target
        const list = form.products

        if(type == "input") list[i][name] = value 
        if(type == "checkbox") {
            if(single && checked) {
                list[i][name] = value
            }else{
                let values = [...list[i][name],value]
                if(checked){
                    values = values.filter((f,fi) => values.indexOf(f) == fi) 
                }else{
                    values = values.filter((f,fi) => f != value)
                }
                list[i][name] = (single) ? "" : values
            }
        }

        setForm({ products: list })
        console.log(name);
        
    }
    

    const handleChangeFile = (e,i) => {
        e.preventDefault()
        const files = e.target.files[0]

        const reader = new FileReader
        const [...list] = form.products
        const image_produk = list[i].image_produk[0]
        if(files?.size > 5*1000*1000){
            list[i].error = {
                image_produk: "File yang di upload terlalu besar!"
            }
            list[i].image_produk = [{
                ...list[i].image_produk[0],
                nama_image: "gambar-produk.png",
                url_image: "http://localhost:8000/products/gambar-produk.png",
            }]
            if(id) list[i].image_produk = [{
                ...list[i].image_produk[0],
                id: idImage
            }]
            setForm({ products: list })
        }else{
            const err = list[i].error
            list[i].error = { ...err, image_produk: null }

            reader.addEventListener("load", () => {
                list[i].image_produk = [{
                    ...list[i].image_produk[0],
                    nama_image: files,
                    url_image: reader.result,
                }]
                if(id) list[i].image_produk = [{
                    ...list[i].image_produk[0],
                    id: idImage
                }]
                setForm({ products: list })
            })
            if(files) reader.readAsDataURL(files)
        }  
    }
    
    const hancleChangeInptCari = useDebouncedCallback((e,i)=>{
        e.preventDefault()
        createSlug(e.target.value,i)
    },900, { maxWait: 5000 })

    const createSlug = async (nama_produk,i) => {
        const list = form.products
        try {
            const res = await slug({ nama_produk }).unwrap()
            list[i].slug = res.response.slug 
            setForm({ products: list })
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickSave = async (e) => {
        e.preventDefault()
        try {
            console.log({ form });
            
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.products.map(val => ({...val, error: ""}))
            let msg = []
            
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
        setForm({ products: [...form.products, {...newForm }] })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Products</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Products</span>
    }

    return (
        <> 
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
            <div className="w-full mb-1 p-4 h-auto">
            { form.products.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-0"></div>) }
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="w-full sm:w-2/2 ml-1 mt-10 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <div className="w-full my-2">
                                <div className="w-full">
                                    <label htmlFor="kode_produk" className="font-semibold">Kode Produk</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange(e,index) } 
                                        value={item.kode_produk} 
                                        name="kode_produk" 
                                        id="kode_produk" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                        placeholder="Masukan Kode Produk"
                                    />
                                    <ErrorMsg message={item.error?.kode_produk || ""} />
                                </div>
                                <div className="w-full mt-1">
                                    <label htmlFor="slug" className="font-semibold">Slug Produk</label>
                                    <input type="text" value={item.slug} name="slug" id="slug" readOnly 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" placeholder="Slug"/>
                                    <ErrorMsg message={item.error?.slug || ""} />
                                </div>
                            </div>
                            <div className="w-full my-2 ">
                                <label htmlFor="nama_produk" className="font-semibold">Nama Produk</label>
                                <textarea  
                                    onChange={(e) => {
                                        handleChange(e,index);
                                        (!id) && hancleChangeInptCari(e,index)
                                    }} 
                                    value={item.nama_produk} 
                                    name="nama_produk" 
                                    id="nama_produk" 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                    placeholder="Masukan Nama Produk"
                                />
                                <ErrorMsg message={item.error?.nama_produk || ""} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mb-1">
                            <div className="w-full my-2 ">
                                <label htmlFor="merk" className="font-semibold">Merk Produk</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => handleChange(e,index) } 
                                    value={item.merk} 
                                    name="merk" 
                                    id="merk" 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                    placeholder="Masukan Merk Produk"
                                />
                                <ErrorMsg message={item.error?.merk || ""} />
                            </div>
                            <div className="w-full my-2 ">
                                <label htmlFor="berat" className="font-semibold">Berat Produk</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(e,index) } 
                                    value={item.berat} 
                                    name="berat" 
                                    id="berat" 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                                    placeholder="Masukan Berat Produk"
                                />
                                <ErrorMsg message={item.error?.merk || ""} />
                            </div>
                        </div>
                        <div className="w-full my-1">
                            <label htmlFor="DiskonId" className="font-semibold">Diskon Produk</label>
                            <div className="w-full flex flex-row gap-5 h-auto px-5 py-1 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                { diskon.map((d,i) => <div className="flex flex-row gap-2 text-sm items-center " key={i}><input checked={item.DiskonId == d.id} onChange={(e) => handleChange(e,index,"checkbox",true)} type="checkbox" className="p-1 " value={d.id}  name="DiskonId" id="DiskonId" />{ d.diskon }</div>) }
                            </div>
                            <ErrorMsg message={item.error?.DiskonId || ""} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-9">
                            <div className="w-full mb-10">
                                <div className="shadow-xl h-28">
                                    <img src={item.image_produk[index].url_image} alt="" className="w-28 h-28"/>
                                    <div className="w-full mb-2 mt-2">
                                        <label htmlFor="poster" className="font-semibold">Gambart Produk</label>
                                        <input type="file" onChange={(e) => handleChangeFile(e,index)} name="image_produk" id="image_produk" 
                                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" placeholder="Gambar Produk"/>
                                        <ErrorMsg message={item.error?.image_produk || ""} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="stok_produk" className="font-semibold">Stok Produk</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.stok_produk} 
                                    name="stok_produk" 
                                    id="stok_produk" 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                    placeholder="Masukan Stok Produk"
                                />
                                <ErrorMsg message={item.error?.stok_produk || ""} />
                                <label htmlFor="harga_produk" className="font-semibold">Harga Produk</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.harga_produk} 
                                    name="harga_produk" 
                                    id="harga_produk" 
                                    className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" 
                                    placeholder="Masukan Harga Produk"
                                />
                                <ErrorMsg message={item.error?.harga_produk || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <div className="w-full my-2">
                                <label htmlFor="status_produk" className="font-semibold">Status Produk</label>
                                <div className="w-full flex flex-col gap-1 h-auto px-5 py-1 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                    { status_produk.map((status,i) => <div className="flex gap-1 items-center" key={i}><input checked={item.status_produk == status} onChange={(e) => handleChange(e,index,"checkbox",true)} type="checkbox" className="p-1" value={status}  name="status_produk" id="status_produk" />{ status }</div>) }
                                </div>
                                <ErrorMsg message={item.error?.status_produk || ""} />
                            </div>
                            <div className="w-full  my-2">
                                <label htmlFor="CategoryId" className="font-semibold">Kategori Produk</label>
                                <div className="w-auto flex flex-col gap-1 h-auto px-5 py-1 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                { categories.map((categorie,i) => <div className="flex gap-1 items-center" key={i}><input checked={item.CategoryId == categorie.id.toString()} onChange={(e) => handleChange(e,index,"checkbox",true)} type="checkbox" className="p-1" value={categorie.id}  name="CategoryId" id="CategoryId" />{ categorie.nama }</div>) }
                                </div>
                                <ErrorMsg message={item.error?.CategoryId } />
                            </div>
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="desk_produk" className="font-semibold">Deskripsi</label>
                            <textarea  onChange={(e) => handleChange(e,index)} value={item.desk_produk} name="desk_produk" id="desk_produk" 
                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" placeholder="Masukan Deskripsi"/>
                            <ErrorMsg message={item.error?.desk_produk || ""} />
                        </div>
                        <ErrorMsg message={item.error?.ShopId || ""} />
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
                        { index == (form.products.length -1) && (<>
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
                        </>) }
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

export default Form