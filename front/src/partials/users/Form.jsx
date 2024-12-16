import { useDispatch } from "react-redux"
import { useFindOneUsersQuery, useStoreMultipelUsersMutation, useUpdateMultipelUsersMutation } from "../../features/api/apiUserSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useFindAllRolesQuery } from "../../features/api/apiRoleSlice"
import { useEffect } from "react"
import { setMessage } from "../../features/usersSlice"
import Modal from "../../components/Modal_"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const newForm = {
        namaDepan: "",
        namaBelakang: "",
        username: "",
        email: "",
        password: "",
        noHp: "",
        alamat: "",
        desc:"",
        role: [],
        isActive: false,
        profile : "default.jpg",
        profileUrl: "http://localhost:8000/profile/default.jpg",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ users: [newForm] })
    const [ roles, setRoles ] = useState([])
    const { data } = useFindOneUsersQuery({ id },{ skip: (id) ? false : true }) 
    const { data: dataRoles } = useFindAllRolesQuery({ search: "", page: 1, perPage: 10 })
    const [ update, { isLoading: loadingUpdate }] = useUpdateMultipelUsersMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMultipelUsersMutation()

    useEffect(() => {
        if(dataRoles?.response?.roles) setRoles(dataRoles?.response?.roles)
    },[dataRoles?.response?.roles])

    useEffect(() => {
        if(data?.response?.users) setForm({ users: [{
            namaDepan: data.response.users.namaDepan,
            namaBelakang: data.response.users.namaBelakang,
            username: data.response.users.username,
            email: data.response.users.email,
            password: "",
            passwordOld: data.response.users.password,
            noHp: data.response.users?.UsersDetail?.noHp,
            alamat: data.response.users?.UsersDetail?.alamat,
            desc: data.response.users?.UsersDetail?.desc,
            role: data.response.users?.Roles?.map(e=> e.id),
            isActive: data.response.users.isActive,
            profile : data.response.users?.UsersDetail?.profile,
            profileUrl: data.response.users?.UsersDetail?.profileUrl,
            profileUrlOld: data.response.users?.UsersDetail?.profileUrl,
            profileOld: data.response.users?.UsersDetail?.profile,
            users_id: data.response.users.id,
            error: null
        }] })
    },[ data?.response?.users ])

    const handleChange = (e,i) => {
        e.preventDefault()
        const { name,value } = e.target
    
        const [...list] = form.users;
        list[i][name] = value
        setForm({ users: list })
    }

    const handleChangeFile = (e,i) => {
        e.preventDefault()
        const files = e.target.files[0]

        const reader = new FileReader
        const [...list] = form.users
        
        if(files?.size > 5*1000*1000){
            list[i].error = {
                profile: "File yang di upload terlalu besar!"
            }
            list[i].profile = "default.jpg"
            list[i].profileUrl = "http://localhost:8000/profile/default.jpg"
            setForm({ users: list })
        }else{
            console.log(list[i].profile);
            const err = list[i].error
            list[i].profile = files
            list[i].error = { ...err, profile: null }
            console.log(list[i]);
            console.log(list[0]);
            reader.addEventListener("load", () => {
                list[i].profileUrl = reader.result
                setForm({ users: list })
            })
            if(files) reader.readAsDataURL(files)
        }  
    }

    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            console.log(res);
            dispatch(setMessage(res?.message))
            setShowModal(false)
            // console.log(form);
        } catch (error) {
            const inpt = form.users.map(val => ({...val, error: ""}))
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
            setForm({ users: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.users

        const newList = list.map((item) => {
            return newForm
        })
        setForm({ users: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ users: [...form.users, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.users

        list.splice(i,1)
        setForm({ users: list })
    }

    const handleChangeStatus = (e,i) => {
        const [...list] = form.users
        list[i].isActive = e.target.checked

        setForm({ users: list })
    }

    const handleChangeRole = (e,i) => {
        const [...list] = form.users
        let roles = list[i].role
        
        const index = roles.indexOf(parseInt(e.target.value));
        (e.target.checked) ? roles.push(parseInt(e.target.value)) : roles.splice(index,1)

        list[i].role = roles
        setForm({ users: list })
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

    const ModalTitle = () => (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Users</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Users</span>

    return (
        <> 
            <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
            <div className="w-full mb-1 p-4 h-auto">
            { form.users.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div className="w-full sm:w-1/2 mb-10">
                            <div className="shadow-xl h-80">
                                <img src={item.profileUrl} alt="" className="w-full h-full"/>
                                <div className="w-full mb-2 mt-2">
                                    <label htmlFor="profile" className="font-semibold">Profile</label>
                                    <input type="file" onChange={(e) => handleChangeFile(e,index)} name="profile" id="profile" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Foto Profile"/>
                                    <ErrorMsg message={item.error?.profile || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-2/2 ml-1 mt-10 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <div className="w-full my-2">
                                <label htmlFor="namaDepan" className="font-semibold">Nama Depan</label>
                                <input type="text" onChange={(e) => handleChange(e,index)} value={item.namaDepan} name="namaDepan" id="namaDepan" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan nama depan"/>
                                <ErrorMsg message={item.error?.namaDepan || ""} />
                            </div>
                            <div className="w-full my-2">
                                <label htmlFor="namaBelakang" className="font-semibold">Nama Belakang</label>
                                <input type="text" onChange={(e) => handleChange(e,index)} value={item.namaBelakang} name="namaBelakang" id="namaBelakang" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan nama belakang"/>
                                <ErrorMsg message={item.error?.namaBelakang || ""} />
                            </div>
                        </div>
                        <div className="w-full mb-2">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input type="email" onChange={(e) => handleChange(e,index)} value={item.email} name="email" id="email" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan Email"/>
                            <ErrorMsg message={item.error?.email || ""} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <div className="w-full my-2">
                                <label htmlFor="username" className="font-semibold">Username</label>
                                <input type="text" onChange={(e) => handleChange(e,index)} value={item.username} name="username" id="username" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan username"/>
                                <ErrorMsg message={item.error?.username || ""} />
                            </div>
                            <div className="w-full my-2">
                                <label htmlFor="password" className="font-semibold">Password</label>
                                <input type="password" onChange={(e) => handleChange(e,index)} value={item.password} name="password" id="password" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan Password"/>
                                <ErrorMsg message={item.error?.password || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <div className="w-full my-2">
                                <label htmlFor="role" className="font-semibold">Role</label>
                                <div className="w-full h-auto px-1 py-2 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                { roles.map((role,i) => <div className="flex gap-1 items-center" key={role.id}><input checked={ item.role.indexOf(role.id) != -1 ? true : false || false} onChange={(e) => handleChangeRole(e,index)} type="checkbox" className="p-1" value={role.id}  name="role" id="role" />{ role.name }</div>) }
                                </div>
                                <ErrorMsg message={item.error?.role || ""} />
                            </div>
                            <div className="w-full my-2 flex gap-1 flex-col">
                                <div>
                                <label htmlFor="isActive" className="font-semibold">status</label>
                                <div className="w-20 sm:w-full flex items-center gap-1 h-auto p-1 border-[1px] border-slate-600 rounded-sm shadow-lg">
                                <input type="checkbox" checked={ item.isActive || false} onChange={(e) => handleChangeStatus(e,index)} className="p-1" name="isActive" id="isActive" />Active
                                </div>
                                </div>
                                <div>
                                <label htmlFor="noHp" className="font-semibold">No Hp</label>
                                <input type="number" onChange={(e) => handleChange(e,index)} value={item.noHp} name="noHp" id="noHp" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan No Hp"/>
                                <ErrorMsg message={item.error?.noHp || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="alamat" className="font-semibold">Alamat</label>
                            <textarea  onChange={(e) => handleChange(e,index)} value={item.alamat} name="alamat" id="alamat" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Masukan Alamat"/>
                            <ErrorMsg message={item.error?.alamat || ""} />
                        </div>
                        <div className="w-full my-2">
                            <label htmlFor="desc" className="font-semibold">Deskripsi</label>
                            <textarea  onChange={(e) => handleChange(e,index)} value={item.desc} name="desc" id="desc" className="w-full min-h-10 border-slate-600 rounded-sm" placeholder="Masukan Deskripsi"/>
                            <ErrorMsg message={item.error?.desc || ""} />
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
                        { index == (form.users.length -1) && (<>
                        
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
            </Modal>
        </>
    ) 
}

export default Form