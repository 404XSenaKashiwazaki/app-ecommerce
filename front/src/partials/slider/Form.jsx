import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/sliderSlice"
import Modal from "../../components/Modal_"
import { useFindOneSlidersQuery, useStoreMultipelSlidersMutation, useUpdateMultipelSlidersMutation } from "../../features/api/apiSlidersSlice"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        title: "",
        image: "default.jpg",
        imageUrl: "http://localhost:8000/slider/default.jpg",
        desk:"",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ sliders: [newForm] })
    const { data } = useFindOneSlidersQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateMultipelSlidersMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMultipelSlidersMutation()

    useEffect(() => {
        if(data?.response?.slider) setForm({ sliders: [{
            sliders_id: data.response.slider.id,
            title: data.response.slider.title,
            image: data.response.slider.image,
            imageUrl: data.response.slider.imageUrl,
            desk: data.response.slider.desk,
            imageUrlOld: data.response.slider.imageUrl,
            imageOld: data.response.slider.image,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        e.preventDefault()
        const { name,value } = e.target
    
        const [...list] = form.sliders;
        list[i][name] = value
        setForm({ sliders: list })
    }

    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.sliders.map(val => ({...val, error: ""}))
            let msg = []
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const title = err.param.match(/\.([A-Za-z]+)/)[1]
                    
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter) => {
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [title]: d  }
                
                })
            }
            setForm({ sliders: inpt })
        }
    }

    const handleChangeFile = (e,i) => {
        e.preventDefault()
        const files = e.target.files[0]

        const reader = new FileReader
        const [...list] = form.sliders
        
        if(files?.size > 5*1000*1000){
            list[i].error = {
                image: "File yang di upload terlalu besar!"
            }
            list[i].image = "default.jpg"
            list[i].imageUrl = "http://localhost:8000/slider/default.jpg"
            setForm({ users: list })
        }else{
            console.log(list[i].image);
            const err = list[i].error
            list[i].image = files
            list[i].error = { ...err, image: null }
            console.log(list[i]);
            console.log(list[0]);
            reader.addEventListener("load", () => {
                list[i].imageUrl = reader.result
                setForm({ sliders: list })
            })
            if(files) reader.readAsDataURL(files)
        }  
    }


    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.sliders

        const newList = list.map(() => newForm)
        setForm({ sliders: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ sliders: [...form.sliders, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.sliders

        list.splice(i,1)
        setForm({ sliders: list })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Slider</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Slider</span>
    }

    return (
        <>
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.sliders.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-7 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="flex gap-2">
                            <div className="w-full">
                                <div>
                                    <img src={ item.imageUrl } alt={ item.title } className="rounded-sm w-80 h-80"/>
                                </div>
                            </div>
                            <div className="w-full flex-initial">
                                <div className="w-full mb-2">
                                    <label htmlFor="title" className="font-semibold">Title</label>
                                    <input type="text" onChange={(e) => handleChange(e,index)} value={item.title} name="title" id="title" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Title Slider"/>
                                    <ErrorMsg message={item.error?.title || ""} />
                                </div>
                                <div className="w-full mb-2 mt-2">
                                    <label htmlFor="image" className="font-semibold">Image</label>
                                    <input type="file" onChange={(e) => handleChangeFile(e,index)} name="image" id="image" className="w-full rounded-sm border border-slate-400 p-1" placeholder="Foto image"/>
                                    <ErrorMsg message={item.error?.image || ""} />
                                </div>
                                <div className="w-full my-2">
                                    <label htmlFor="desk" className="font-semibold">Deskripsi</label>
                                    <textarea  onChange={(e) => handleChange(e,index)} value={item.desk} name="desk" id="desk" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Deskripsi Slider"/>
                                    <ErrorMsg message={item.error?.desk || ""} />
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
                                { index == (form.sliders.length -1) && (<>
                                
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