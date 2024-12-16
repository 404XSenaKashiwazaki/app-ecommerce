import { faSave, faSpinner } from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect, useState } from "react"
import { useFindSiteQuery, useStoreSiteMutation, useUpdateSiteMutation } from "../../features/api/apiSitesSlice"
import { useDispatch, useSelector } from "react-redux"
import { removeMessage, setMessage } from "../../features/siteSlice"
import { Toast } from "../../utils/sweetalert"
import FormInputSiteModal from "../../components/FormInputSiteModal"


const Form = () => {
    const dispatch = useDispatch()
    const { message, site } = useSelector(state => state.sites)
    const [ update, { data:dataUpdate, isError:isErrorUpdate,isLoading:isLoadingUpdate,error:errorUpdate } ] = useUpdateSiteMutation()
    const [ store, { data:dataStore, isError:isErrorStore,isLoading:isLoadingStore, error:errorStore } ] = useStoreSiteMutation()
    const [ showModal, setShowModal ] = useState(false)
    const [ type, setType ] = useState("ganti")
    const [ input,setInput ] = useState({
        title: "",
        about: "",
        dmca: "",
        privacy_police:"",
        logo: "http://localhost:8000/site/logo-default.png",
        logoPreview: "http://localhost:8000/site/logo-default.png",
        error: null
    })

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    useEffect(() => {

    if(site) setInput({
        id: site.id,
        title: site.title,
        about: site.deskripsi,
        dmca: site.dmca,
        privacy_police: site.privacy_police,
        logo: site.logo,
        fileOld: site.logo,
        logoPreview: site.logo_url,
        logoPreviewOld: site.logo_url,
        error: null
    })
    },[ site ])

    const handleCange = ({ target }) => {
        const { name,value } = target
        setInput(prev => ({...prev, [name]:value}))
    }

    const handleChaneInputFile = (e) => {
        e.preventDefault()

        const files = e.target.files[0]
        const reader = new FileReader
        let logo
        let logoPreview
        let error
        // console.log(parseInt(files.size) > 1*1000*1000);
        if(files?.size > 1*1000*1000){
        error = {
            poster: "File yang di upload terlalu besar!"
        }
        logo = "http://localhost:8000/sites/default.jpg"
        logoPreview = "http://localhost:8000/sites/default.jpg"
        setInput(prev => ({...prev, logoPreview,logo, error}))
        }else{
        const err = input.error
        logo = files
        error = { ...err, logo: null }
        reader.addEventListener("load", () => {
            logoPreview = reader.result
            setInput(prev => ({...prev, logoPreview, logo, error}))
        })
        if(files) reader.readAsDataURL(files)
        }  
    }

    const handleClickSave = async () => {
        try {
        console.log(input);
        
            const res = (input.id) ?  await update({ data: input, id: input.id }).unwrap() :  await store({ data: input }).unwrap()
            dispatch(setMessage(res.message))
        } catch (error) {
        const msg = []
        if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
            input.error = []
            const name = e.param.match(/([A-Za-z]+_[A-Za-z]+|[A-Za-z]+)/)[0]
            console.log({name});
            
            msg.push(e.msg)
            input.error = { [name.toLowerCase()]: [...new Set(msg)] }
        })

        setInput(input)
        }
    }

    console.log({ input });
    

    return (
        <div className="p-3">
        { showModal && <FormInputSiteModal type={type} setInput={setInput} input={input} setShowModal={setShowModal} showModal={showModal} /> }
        <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-initial w-full h-auto md:w-[50%]">
                <img src={input?.logoPreview} className="w-full md:h-60 md:object-fill h-80 object-cover border-slate-200 border-2" alt="" />
                <div className="w-full flex items-center gap-1 mx-4 md:justify-center sm:mx-0 xs:mx-0 mt-4">
                    <button
                        onClick={() => { 
                            setType("ganti")
                            setShowModal(true)
                        }}
                        className="ml-4 md:ml-0 sm:ml-0 xs:ml-0 px-4 bg-indigo-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                        Ganti Logo
                    </button>
                    <button 
                        onClick={() => {
                            setType("hapus")
                            setShowModal(true)
                        }}
                        disabled={input.logo == "default.jpg" ? true : false }
                        className={`px-4 text-red-500 bg-slate-200  py-1 rounded-sm font-bold text-sm hover:bg-slate-600 transition ${ input.logo == "default.jpg" && `cursor-not-allowed` }`}>Hapus</button>
                </div>
            </div>
            <div className="w-full">
            <div className="flex-initial  w-full mb-1">
            <div className="flex flex-col">
            <div className="bg-slate-100 p-1 items-center flex flex-col md:flex-row justify-start gap-2 md:gap-5 mb-3 w-full">
            <label 
                htmlFor="title"
                className="flex-initial w-full md:w-[50%] mx-2">
                Title
            </label>
            <input 
                onChange={(e) => handleCange(e)}
                type="text" 
                name="title" 
                className="w-full border-none p-1" 
                placeholder="Masukan title site"
                value={input?.title} />
            </div>
            <ErrorMsg message={input?.error?.title} />
            </div>
            <div className="bg-slate-100 px-3 py-4 mt-3 mb-3">
                <label htmlFor="deskripsi" className="mx-0"> About </label>
                <textarea 
                    onChange={(e) => handleCange(e)}
                    className="w-full border-none"
                    name="about" 
                    id="deskripsi" 
                    cols="30"
                    value={input?.about} 
                    rows="2">
                </textarea>
                <ErrorMsg message={input?.error?.about} />
            </div>
            </div>
            <div className=" w-full">
            <div className="bg-slate-100 px-3 py-4 mt-0 mb-3">
                <label htmlFor="dmca" className="mx-0"> Dmca </label>
                <textarea 
                    onChange={(e) => handleCange(e)}
                    className="w-full border-none"
                    name="dmca" 
                    id="dmca" 
                    cols="30"
                    value={input?.dmca} 
                    rows="2">
                </textarea>
                <ErrorMsg message={input?.error?.dmca} />
            </div>
            <div className="bg-slate-100 px-3 py-2 mt-0 mb-3">
                <label htmlFor="privacy_police" className="mx-0"> Privacy Plolice</label>
                <textarea 
                    onChange={(e) => handleCange(e)}
                    className="w-full border-none"
                    name="privacy_police" 
                    id="privacy_police" 
                    cols="30"
                    value={input?.privacy_police} 
                    rows="2">
                </textarea>
                <ErrorMsg message={input?.error?.privacy_police} />
            </div>
            </div>
            <div className="flex justify-end p-1 mt-5 mb-10 w-full ">
            { site 
            ?   <button 
                    onClick={handleClickSave}
                    className="w-auto px-3 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                    hover:text-slate-200">
                    { isLoadingUpdate ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faSave } /> Simpan</span> }
                </button>
            :  <button 
                    onClick={handleClickSave}
                    className="w-auto px-3 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                    hover:text-slate-200">
                    { isLoadingStore ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faSave } /> Sian</span> }
                </button>

            }
            </div>
            </div>
        </div>
        </div>
        </div>
    )
}

export default Form