import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faKey, faPlayCircle, faPowerOff, faSave, faSpinner, faUser, faUserShield, faVideo } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector  } from "react-redux"
import FormInput from "../components/FormInput"
import { useUpdateProfileMutation } from "../features/api/apiProfileSlice"
import { useEffect, useState } from "react"
import { removeMessage, setMessage } from "../features/profileSlice"
import Swal, { Toast, mySwal } from '../utils/sweetalert'
import { setRemoveState, setUser } from "../features/authSlice"
import { faFile, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import ErrorMsg from "../components/ErrorMsg"
import { Link, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../features/api/apiAuthSlice"

const ProfileFront = () => {
    const navigate = useNavigate()
    const { dataUser } = useSelector(state=> state.auth)
    const [ update, { data, isError,isLoading,error } ] = useUpdateProfileMutation()
    const [ logout, { data:dataLogout,isLoading:isLoadingLogout, isSuccess:isSuccessLogout, isError:isErrorLogout } ] = useLogoutMutation()
    const [ input, setInput ] = useState([])
    const { message } = useSelector(state => state.profile)
    const dispatch = useDispatch()

    useEffect(() => {
        if(dataUser) setInput({
            id: dataUser?.id,
            fullname: dataUser.fullname,
            email: dataUser.email,
            password:"",
            noTlpn: dataUser?.detailUser?.noTlpn,
            alamat: dataUser?.detailUser?.alamat,
            profile: dataUser?.detailUser?.profile,
            hobi: dataUser?.detailUser?.hobi,
            desc: dataUser?.detailUser?.desc,
            profileUrl: dataUser?.detailUser?.profileUrl,
            profileOld: dataUser?.detailUser?.profileUrl,
            error: null
        })
    },[dataUser])

    useEffect(() => {
        if(!dataUser) navigate("/")
    },[dataUser])

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    const handleCange = ({ target }) => {
        const { name,value } = target
        setInput(prev => ({...prev, [name]:value}))
    }
    
  const handleChaneInputFile = (e) => {
    e.preventDefault()

    const files = e.target.files[0]
    const reader = new FileReader
    let profile
    let profileUrl
    let error
    console.log(parseInt(files.size) > 1*1000*1000);
    if(files?.size > 1*1000*1000){
      error = {
        poster: "File yang di upload terlalu besar!"
      }
      profile = "default.png"
      profileUrl = "http://localhost:8000/profile/default.png"
      setInput(prev => ({...prev, profile,profileUrl,error}))
    }else{
      const err = input.error
      profile = files
      error = { ...err, profileUrl: null }
      reader.addEventListener("load", () => {
        profileUrl = reader.result
        setInput(prev => ({...prev, profile,profileUrl,error}))
      })
      if(files) reader.readAsDataURL(files)
    }  
  }

    const handleClickSave = async () => {
        try {
            const res = await update({ data: input, username: dataUser.username }).unwrap()
            console.log(res);
        
            dispatch(setUser(res.response))
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickLogout = async () => {
        try {
            await logout().unwrap()
            dispatch(setRemoveState())
            console.log("logout");
            navigate("/")
          } catch (error) {
            console.log(error)
          }
    }

    return(
        <div className="mx-1 h-auto md:mx-auto md:w-fit box-border mt-10 mb-24">
        {/* card epiosode terbaru */}
        <div className="md:w-[850px] mx-5 shadow-2xl">
            <div className="flex justify-between mb-3">
               <div>
                    <h1 className="text-sm md:font-semibold text-slate-50"><FontAwesomeIcon icon={faUser} /> Profile</h1>
               </div>
               <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
               </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-5 p-4  ">
            <div className="flex-initial h-full md:h-[300px] p-1 w-full md:w-[50%] bg-indigo-950 shadow-lg rounded-sm border=none ">
                <img src={input?.profileUrl} className="w-full h-full object-fill" alt="" />
               
            </div>
            <div className="w-full p-0 m-0 text-slate-50 bg-indigo-950 shadow-lg rounded-sm  border-none ">
                <div className="md:p-1 mx:mx-4 mx-0 p-0 mb-4 mt-0">
                    <label htmlFor="fullname" className="text-slate-50"><FontAwesomeIcon icon={faUser} /> Fullname</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={input?.fullname}
                        type="text" 
                        name="fullname" 
                        id="fullname"
                        placeholder="Fullname anda" 
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={input?.error?.fullname} />
                </div>
                <div className="md:p-1 mb-4">
                    <label htmlFor="email" className="text-slate-50"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={input?.email}
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Email anda" 
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={input?.error?.email} />
                </div>
                <div className="md:p-1 mb-4">
                    <label htmlFor="password" className="text-slate-50"><FontAwesomeIcon icon={faKey} /> Password</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="*********" 
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={input?.error?.password} />
                </div>
                <div className="md:p-1 mb-4">
                    <label htmlFor="profile" className="text-slate-50"><FontAwesomeIcon icon={faFile} /> Profile</label>
                    <input 
                        onChange={(e) => handleChaneInputFile(e)}
                        type="file" 
                        name="profile" 
                        id="profile"  
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={input?.error?.poster} />
                </div>
                <div className="flex justify-between p-1 mt-10 mb-10 ">
                    <button 
                        onClick={handleClickLogout}
                        className="w-auto px-3 py-1 text-sm text-slate-50 bg-red-800 font-medium text-center hover:bg-red-900
                        hover:text-slate-200">
                        { isLoading ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faPowerOff } /> Logout</span> }
                    </button>
                    <button 
                        onClick={handleClickSave}
                        className="w-auto px-3 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                        hover:text-slate-200">
                        { isLoading ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faSave } /> Simpan</span> }
                    </button>
               </div>
            </div>
            
        </div>
        {/* <div className="w-full p-0 m-0 text-slate-50 bg-indigo-950 shadow-lg rounded-sm   border-none mt-5 pb-5 mx-1">
        <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div>
            <div className="w-full mt-10 m-3">
                <h1 className="font-semibold text-[12px] md:text-sm text-slate-50"><span><FontAwesomeIcon icon={faThumbsUp} /></span> Video yang di sukai</h1>
            </div>
            <div className="flex m-3 flex-col w-full md:w-[200px] md:h-[150px] p-4 bg-blue-600 shadow-lg rounded-sm text-slate-50 text-sm border-none hover:scale-105 duration-100">
                <div className="flex-initial h-full flex justify-between items-center gap-2">
                <div className="flex flex-col">
                    <span> 30 </span>
                    <span> Video </span>
                </div>
                <div className=''>
                <FontAwesomeIcon size='2x' icon={faVideo} />
                </div>
                </div>
                <div className="w-full h-auto ">
                <Link to={"/anime-like"} >
                <button  
                    className='
                    bg-indigo-700 px-4 py-1 rounded-sm 
                    border-0 text-slate-300  w-full
                    h-auto text-sm  
                    font-medium text-center hover:bg-indigo-600
                    hover:text-slate-200 mr-1'> 
                    <FontAwesomeIcon icon={faArrowRight} /> Lihat
                </button>
                </Link>
                </div>
            </div>
            </div>

            <div>
            <div className="w-full mt-10 m-3">
                <h1 className="font-semibold text-[12px] md:text-sm text-slate-50"><span><FontAwesomeIcon icon={faThumbsDown} /></span> Video yang tidak sukai</h1>
            </div>
            <div className="flex m-3 flex-col w-full md:w-[200px] md:h-[150px] p-4 bg-red-800 shadow-lg rounded-sm text-slate-50 text-sm border-none hover:scale-105 duration-100">
                <div className="flex-initial h-full flex justify-between items-center gap-2">
                <div className="flex flex-col">
                    <span> 3 </span>
                    <span> Video </span>
                </div>
                <div className=''>
                <FontAwesomeIcon size='2x' icon={faVideo} />
                </div>
                </div>
                <div className="w-full h-auto ">
                <Link to={"/anime-dislike"}>
                <button  
                    className='
                    bg-indigo-700 px-4 py-1 rounded-sm 
                    border-0 text-slate-300  w-full
                    h-auto text-sm  
                    font-medium text-center hover:bg-indigo-600
                    hover:text-slate-200 mr-1'> 
                    <FontAwesomeIcon icon={faArrowRight} /> Lihat
                </button>
                </Link>
                </div>
            </div>
            </div>

            <div>
            <div className="w-full mt-10 m-3">
                <h1 className="font-semibold text-[12px] md:text-sm text-slate-50"><span><FontAwesomeIcon icon={faPlayCircle} /></span> Playlis</h1>
            </div>
            <div className="flex m-3 flex-col w-full md:w-[200px] md:h-[150px] p-4 bg-sky-800 shadow-lg rounded-sm text-slate-50 text-sm border-none hover:scale-105 duration-100">
                <div className="flex-initial h-full flex justify-between items-center gap-2">
                <div className="flex flex-col">
                    <span> 5 </span>
                    <span> Video </span>
                </div>
                <div className=''>
                <FontAwesomeIcon size='2x' icon={faVideo} />
                </div>
                </div>
                <div className="w-full h-auto ">
                <Link to={"/anime-playlist"} >
                    <button  
                        className='
                        bg-indigo-700 px-4 py-1 rounded-sm 
                        border-0 text-slate-300  w-full
                        h-auto text-sm  
                        font-medium text-center hover:bg-indigo-600
                        hover:text-slate-200 mr-1'> 
                        <FontAwesomeIcon icon={faArrowRight} /> Lihat
                    </button>
                </Link>
                </div>
            </div>
            </div>

        </div>
        </div> */}
        </div>

    </div>
    )
}

export default ProfileFront