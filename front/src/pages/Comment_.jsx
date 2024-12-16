import { faComments, faEdit, faEnvelope, faMessage, faPaperPlane, faUser } from "@fortawesome/free-regular-svg-icons"
import { faComment, faPencil, faPhone, faReply, faSpinner, faTasks, faTrash, faTriangleExclamation, faUserCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ErrorMsg from "../components/ErrorMsg"
import { 
    useDeleteCommentMutation,
    useFindAllCommentQuery,
    useStoreCommentMutation
} 
from "../features/api/apiCommentSlice"

import { removeMessage, setMessage } from "../features/contactSlice"
import { Toast } from "../utils/sweetalert"
import HomePaginate from '../components/HomePaginate'
import { useNavigate } from "react-router-dom"
import { Helmet } from 'react-helmet'
const Comment = ({ seriid }) => {

    const dispatch = useDispatch()
    const [ perPage,setPerPage ] = useState(6)
    const [ page, setPage ] = useState(1)
    const [ search, setSearch ] = useState("")
    const [ totals, setTotals ] = useState(null)
    const [ totalsPage, setTotalsPage ] = useState(null)
    const [ comments, setComments ] = useState([])
    const [ comment, {isLoading: isLoadingSotore} ] = useStoreCommentMutation()
    const [ destroy, { isLoading: isLoadingDestroy } ] = useDeleteCommentMutation()
    const { dataUser } = useSelector(state=> state.auth)
    const { message } = useSelector(state=> state.contacts)
    const { data: dataComment } = useFindAllCommentQuery({ seriid , search: "",page,perPage })
    const [ user,setUser ] = useState(null)
    const [msg,setMsg] = useState(null)
    const [ input, setInput ] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
      },[dispatch, message])

    useEffect(() => {
        if(dataUser) {
            setUser({
                SeriesId: seriid,
                username: dataUser.username,
                userId: dataUser.id,
                email: dataUser.email,
                content: "",
                seriesId: seriid,
                error: null
            })
        }
    },[dataUser])

    useEffect(() => {
        // console.log(dataOngoing);
        if(dataComment?.response?.comments) {
          const { comments, totals,offset, page, perPage,totalsPage  } = dataComment.response
          setPage(page)
          setPerPage(perPage)
          setTotals(totals)
          setTotalsPage(totalsPage)
          setComments(comments)
        }
      },[  dataComment ])

    const handleCange = ({ target }) => {
        const { name,value } = target
        setUser(prev => ({...prev, [name]:value}))
    }

    
    const handleClickSave = async () => {
        try {
            if(!dataUser?.id) {
               setMsg("Anda harus login terlebih dahulu")
                setTimeout(()=>{
                    setMsg(null)
                },2000)
               return
            }
            const userId = dataUser?.id ? dataUser.id : null
            const res = await comment({ data: user, seriid}).unwrap()        
            dispatch(setMessage(res.message))

            setUser(prev => ({ ...prev,error: null, content: "" }))
        } catch (error) {
            console.log(error);
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
              user.error = null
              const name = e.param.match(/([A-Za-z]+)/)[0]
              msg.push(e.msg)
              
              user.error = { [name.toLowerCase()]: [...new Set(msg)] }
            })
      
            setUser(user)
        }
    }

    const handleClickDelete = async (id) => {
        try {
            const res = await destroy({ id,userid: dataUser.id, seriid}).unwrap()
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
        }
    }

    const handleClikPaginate = ({ selected }) => {
        setPage(selected + 1)
    }

    return(
        <div className="mx-1 h-auto md:mx-auto md:w-fit box-border mt-10 mb-24">
        {/* card epiosode terbaru */}
        <div className="md:w-[850px] mx-0 shadow-2xl">
            { msg && (
                 <div className="bg-red-800 text-slate-200 p-2 w-full mb-4"><FontAwesomeIcon icon={faTriangleExclamation} /> { msg }</div>
            ) }
            <div className="flex justify-between mb-3 mx-5">
               <div>
                    <h1 className="text-sm md:font-semibold text-slate-50"><FontAwesomeIcon icon={faComments} /> Komentar {  dataComment?.response?.comments && dataComment.response.comments.length }</h1>
               </div>
            <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
               </div>
            </div>
            <div className="flex flex-col md:justify-between gap-5">
                <div className="mx-4">
                <div className="md:p-1 mx:mx-4 mx-0 p-0 mb-4 mt-0">
                    <label htmlFor="username" className="text-slate-50 mb-5"><FontAwesomeIcon icon={faUser} /> Username</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={user?.username || ""}
                        type="text" 
                        name="username" 
                        id="username"
                        placeholder="Masukan username"
                        disabled
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={user?.error?.username || ""} />
                </div>
                <div className="md:p-1 mx:mx-4 mx-0 p-0 mb-4 mt-0">
                    <label htmlFor="email" className="text-slate-50 mb-5"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={user?.email || ""}
                        type="email" 
                        name="email" 
                        id="email"
                        placeholder="Masukan email"
                        disabled
                        className="input w-full bg-slate-950 text-slate-50" />
                        <ErrorMsg message={user?.error?.email || ""} />
                </div>
                <div className="md:p-1 mx:mx-4 mx-0 p-0 mb-4 mt-0">
                    <label htmlFor="content" className="text-slate-50"><FontAwesomeIcon icon={faMessage} /> Isi Komentar</label>
                    <textarea
                        onChange={(e) => handleCange(e)}
                        value={user?.content || ""}
                        type="text" 
                        name="content" 
                        id="content"
                        cols="30"
                        placeholder="Masukan komentar anda"
                        className="input w-full h-[200px] bg-slate-950 text-slate-50" >
                        
                        </textarea>
                        <ErrorMsg message={user?.error?.content} />
                </div>
              
                <div className="mx-1 flex justify-end">
                    <button 
                        onClick={handleClickSave}
                        className="w-auto px-5 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                        hover:text-slate-200">
                        { isLoadingSotore ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faPaperPlane } /> Kirim</span> }
                    </button>
                </div>
                </div>
                <div className="h-1 bg-indigo-800 mt-3 mx-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 p-4 pb-5 text-slate-50">
                    {/*  */}
                    { dataComment?.response?.comments && dataComment.response.comments.map(c=> {
                        const date = new Date(c.createdAt).toString().slice(3,25)
                        return (
                            <div key={c.id} className=" my-5">
                                <div className="shadow-2xl mb-1 p-3 hover:scale-105 duration-100">
                                    <div className="mb-2">
                                        <span><FontAwesomeIcon icon={faUser} /> { c.username  || ""  } </span>
                                    </div>
                                    <div className="mb-2">
                                        <span><FontAwesomeIcon icon={faEnvelope} /> { c.email  || ""  } </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex justify-between"><span><FontAwesomeIcon icon={faMessage} /> Komentar</span> <span className="text-[12px]">{ date }</span></span>
                                        
                                        <p className="font-light text-[13px] bg-slate-950 text-slate-50 p-3">{ c.content  || ""}</p>
                                    </div>
                                  
                                   { dataUser.id == c.userId && <div className="flex md:justify-end gap-1 mt-5">
                                        <button 
                                            onClick={() => handleClickDelete(c.id)}
                                            className="w-auto px-3 py-1 text-sm text-slate-50
                                             bg-red-800 font-medium text-center hover:bg-red-900
                                            hover:text-slate-200">
                                            <FontAwesomeIcon icon={faTrash} /> Hapus
                                        </button>
                                    </div> }
                                </div>
                            </div>
                        )
                    })  }
                    {/*  */}
                </div>
                <div className="mt-5 mb-5 flex justify-end ">
                {/* pagination  */}
                { comments.length  > 0 ? 
                <>
                    <HomePaginate
                    data={comments}
                    setPage={setPerPage} 
                    page={page} 
                    totalsPage={totalsPage}
                    perPage={perPage}
                    totals={totals}
                    handleClikPaginate={handleClikPaginate}
                    />
                </> 
                : <>
                    <div className="bg-red-800 text-slate-200 p-2 w-full mx-5"><FontAwesomeIcon icon={faTriangleExclamation} /> Tidak ada data</div>
                </>
                }
              {/* pagination */}
            </div>
            </div>
        </div>

    </div>
    )
}

export default Comment