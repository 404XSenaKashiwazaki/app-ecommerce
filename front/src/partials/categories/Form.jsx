import { useDispatch } from "react-redux"
import { useCreateCategoriesSlugMutation, useFindOneCategoriesQuery, useStoreCategoriesMutation, useUpdateCategoriesMutation } from '../../features/api/apiCategoriesSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { setMessage } from "../../features/categoriesSlice"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import Modal from "../../components/Modal_"


const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        title:"",
        slug: "",
        desc: ""
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ categories: [newForm] })
    
    const { data, isError } = useFindOneCategoriesQuery({ slug: id  },{ skip: (id) ? false : true })
    const [ update, { isLoading: loadingUpdate }] = useUpdateCategoriesMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreCategoriesMutation()
    const [ slug ] = useCreateCategoriesSlugMutation()

    useEffect(() => {
        if(data?.response?.categori) setForm({ categories: [{  
            categories_id: data.response.categori.id,
            title: data.response.categori.title,
            slug: data.response.categori.slug,
            desc: data.response.categori.desc, 
        }] })
    }, [data])

    const handleChange = (e,i) => {
      e.preventDefault()
      const { name,value } = e.target
  
      const list = form.categories
      console.log(list);
      list[i][name] = value
      // console.log(i);
      setForm({ categories: list })
    }
    
    const hancleChangeInptCari = useDebouncedCallback((e,i)=>{
       e.preventDefault()
       createSlug(e.target.value,i)
    },900, { maxWait: 5000 })

    const createSlug = async (title,i) => {
        const list = form.categories
        try {
            const res = await slug({ title }).unwrap()
            list[i].slug = res.response.slug 
            setForm({ categories: list })
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickSave = async (e) => {
        e.preventDefault()
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
        
            setShowModal(false)
        } catch (error) {
            const inpt = form.categories.map(val => ({...val, error: ""}))
            let msg = []
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err,errIndex) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const name = err.param.match(/\.([A-Za-z]+)/)[1]
                    
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter,filterIndex) => {
                        console.log(filter[0] == indexErr);
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [name]: d  }
                
                })
            }
            setForm({ categories: inpt })
        }
    }

    const handleClickReset = (e,i) => {
        e.preventDefault()
        const list = form.categories
        list[i] = newForm
        console.log(list);
        setForm({ categories: list })
    }

    const handleClickAddForm = (e) => {
      e.preventDefault()
      // setForm({ categories: [...form.categories, newForm ] }) tidak berhasil di form yg jumlah inputnya sedikit
      setForm({ categories: [...form.categories, {...newForm }] })
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const list = form.categories
        list.splice(i,1)
        setForm({ categories: list })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Categories</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Categories</span>
    }

    return (
        <> 
         <Modal setId={setId} type="sm" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
            <div className="w-full mb-1 p-4 h-auto">
            { form.categories.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-0"></div>) }
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="w-full sm:w-2/2 ml-1 mt-10 sm:mt-0">
                        <div className="w-full mb-2">
                            <label htmlFor="title" className="font-semibold">Title</label>
                            <input type="text" onChange={(e) => {
                                handleChange(e,index);
                             (!id) && hancleChangeInptCari(e,index)
                            }} value={item.title} name="title" id="title" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan Title"/>
                            <ErrorMsg message={item.error?.title || ""} />
                        </div>
                      
                        <div className="w-full mb-2">
                            <label htmlFor="slug" className="font-semibold">Slug</label>
                            <input type="text" value={item.slug} name="slug" id="slug" readOnly className="w-full h-8 border-slate-600 rounded-sm bg-slate-400" placeholder="Slug"/>
                            <ErrorMsg message={item.error?.slug || ""} />
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="desc" className="font-semibold">Deskripsi</label>
                            <textarea  onChange={(e) => handleChange(e,index)} value={item.desc} name="desc" id="desc" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Masukan Deskripsi"/>
                            <ErrorMsg message={item.error?.desc || ""} />
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
                        { index == (form.categories.length -1) && (<>
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