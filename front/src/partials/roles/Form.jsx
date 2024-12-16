import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useFindOneRolesQuery, useStoreMultipelRolesMutation, useUpdateMultipelRolesMutation } from "../../features/api/apiRoleSlice"
import { useEffect } from "react"
import { setMessage } from "../../features/rolesSlice"
import Modal from "../../components/Modal_"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        name: "",
        desk:"",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ roles: [newForm] })
    const { data } = useFindOneRolesQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateMultipelRolesMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMultipelRolesMutation()

    useEffect(() => {
        if(data?.response?.roles) setForm({ roles: [{
            roles_id: data.response.roles.id,
            name: data.response.roles.name,
            desk: data.response.roles.desk,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        e.preventDefault()
        const { name,value } = e.target
    
        const [...list] = form.roles;
        list[i][name] = value
        setForm({ roles: list })
    }

    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.roles.map(val => ({...val, error: ""}))
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
            setForm({ roles: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.roles

        const newList = list.map(() => newForm)
        setForm({ roles: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ roles: [...form.roles, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.roles

        list.splice(i,1)
        setForm({ roles: list })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Roles</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Roles</span>
    }

    return (
        <>
        <Modal setId={setId} type="sm" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.roles.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="w-full mb-2">
                            <label htmlFor="name" className="font-semibold">Nama</label>
                            <input type="text" onChange={(e) => handleChange(e,index)} value={item.name} name="name" id="name" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan Nama"/>
                            <ErrorMsg message={item.error?.name || ""} />
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="desk" className="font-semibold">Deskripsi</label>
                            <textarea  onChange={(e) => handleChange(e,index)} value={item.desk} name="desk" id="desk" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Masukan Deskripsi"/>
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
                        { index == (form.roles.length -1) && (<>
                        
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