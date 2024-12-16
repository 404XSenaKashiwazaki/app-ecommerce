import { faEnvelope, faMessage, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { faPencil, faPhone, faReply, faSignInAlt, faSpinner, faTasks, faTrash, faTriangleExclamation, faUser, faUserCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ErrorMsg from "../components/ErrorMsg"
import { 
    useFindAllContactQuery,
    useStoreContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation
} from  "../features/api/apiContactSlice"
import { removeMessage, setMessage } from "../features/contactSlice"
import { Toast } from "../utils/sweetalert"
import HomePaginate from '../components/HomePaginate'
import { useNavigate } from "react-router-dom"
import TimeAgo from "../components/TimeAgo"
import { Helmet } from 'react-helmet'
const Contact = ({ site }) => {
    const dispatch = useDispatch()
    const [ perPage,setPerPage ] = useState(5)
    const [ page, setPage ] = useState(1)
    const [ search, setSearch ] = useState("")
    const [ totals, setTotals ] = useState(null)
    const [ totalsPage, setTotalsPage ] = useState(null)
    const [ contacts, setContracts ] = useState([])
    const [ contact, {isLoading: isLoadingSotore} ] = useStoreContactMutation()
    const [ update, {isLoading: isLoadingUpdate} ] = useUpdateContactMutation()
    const [ destroy, { isLoading: isLoadingDestroy } ] = useDeleteContactMutation()
    const [ restore, { isLoading: isLoadingRestore } ] = useDeleteContactMutation()
    const { dataUser } = useSelector(state=> state.auth)
    const { message } = useSelector(state=> state.contacts)
    const { data: dataContact } = useFindAllContactQuery({ username: dataUser?.username, search: "",page,perPage })
    const [ user,setUser ] = useState(null)
    const [msg,setMsg] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])

    useEffect(() => {
        if(dataUser) {
            setUser({
                UserId: dataUser.id,
                email: dataUser.email,
                username: dataUser.username,
                content: "",
                error: null
            })
        }
    },[dataUser])

    useEffect(() => {
        // console.log(dataOngoing);
        if(dataContact?.response?.contacts) {
            const { contacts, totals,offset, page, perPage,totalsPage  } = dataContact.response
            setPage(page)
            setPerPage(perPage)
            setTotals(totals)
            setTotalsPage(totalsPage)
            setContracts(contacts)
        }
    },[  dataContact ])

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
            console.log({ user });
            
            const res = await contact({ data: user, userid: dataUser?.id ? dataUser.id : null }).unwrap()        
            dispatch(setMessage(res.message))
            setUser(prev => ({ ...prev,error: null, isi: "" }))
        } catch (error) {
            console.log(error);
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
                user.error = null
                const name = e.param.match(/([A-Za-z]+)/)[0]
                
                msg.push(e.msg)
                user.error = { [name.toLowerCase()]: [...new Set(msg)] }
            })
            console.log(user);
            setUser(user)
        }
    }

    const handleClickDelete = async (id) => {
        try {
            const res = await destroy({ id, username: dataUser.username }).unwrap()
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
        }
    }

    const handleClikPaginate = ({ selected }) => {
        setPage(selected + 1)
    }

    const CardContact = ({c,style,styleContent}) => (<div key={c.id} className="mb-3">
        <div className={style}>
            <div
                className="flex gap-1">
                {/* <img src={c.Order.User.UsersDetail.profileUrl} className="w-5 h-5 rounded-full"/>  */}
                <img src={ c.User.UsersDetail.profileUrl} className="w-5 h-5 rounded-full"/> 
                <p className="text-md font-semibold">{ c.username  }</p>
            </div>
            <p className={styleContent}>{ c.content  || ""}</p>
            <div className="text-xs flex justify-end px-2">
                <TimeAgo date={c?.createdAt}/>
            </div>
        </div>
        { (c.Contacts) && c.Contacts.map(c2 => <CardContact key={c2.id} c={c2} style={`mt-0 mb-0 flex items-start flex-col`} styleContent={`w-auto font-light text-sm bg-slate-200 text-slate-500 py-2 px-5`}/>) }
    </div>) 
    if(!dataContact) return <></>
    return(
        <div className="mx-1 max-w-xl h-auto box-border mt-0  shadow-2xl rounded-sm">
        <Helmet>
            <title>{ site } - Contact</title>
        </Helmet>
        {/* card epiosode terbaru */}
        <div className="w-full">
            { msg && (
                <div className="bg-red-800 text-slate-900 p-2 w-full mb-4"><FontAwesomeIcon icon={faTriangleExclamation} /> { msg }</div>
            ) }
            <div className="flex justify-between mb-3">
                <div className="my-4">
                    <h1 className="text-lg font-bold text-slate-900 mx-4"><FontAwesomeIcon  icon={faMessage} /> Contact { (dataContact?.response?.contacts && dataUser) && dataContact.response.contacts.length }</h1>
                </div>
            <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
            </div>
            </div>
            <div className="flex flex-col md:justify-between gap-5">
                <div className="mx-4">
                <div className="my-2 p-1">
                    <label htmlFor="username" className="text-slate-900"><FontAwesomeIcon icon={faUser} /> Username</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={user?.username || ""}
                        type="text" 
                        name="username" 
                        id="username"
                        readOnly={true}
                        placeholder="Masukan username"
                        disabled={ (!dataUser) ? true : false }
                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" />
                        <ErrorMsg message={user?.error?.username || ""} />
                </div>
                <div className="my-2 p-1">
                    <label htmlFor="email" className="text-slate-900 mb-5"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                    <input 
                        onChange={(e) => handleCange(e)}
                        value={user?.email || ""}
                        type="email" 
                        name="email" 
                        id="email"
                        readOnly={true}
                        placeholder="Masukan email"
                        // disabled={ (!dataUser) ? true : false }
                        className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" />
                        <ErrorMsg message={user?.error?.email || ""} />
                </div>
                <div className="my-2 p-1">
                    <label htmlFor="isi" className="text-slate-900"><FontAwesomeIcon icon={faMessage} /> Pesan</label>
                    <textarea
                        onChange={(e) => handleCange(e)}
                        value={user?.content || ""}
                        type="text" 
                        name="content" 
                        id="isi"
                        cols="30"
                        // disabled={(!dataUser) ? true : false}
                        placeholder="Masukan pesan"
                        className="w-full h-[100px] text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border" >
                        
                        </textarea>
                        <ErrorMsg message={user?.error?.content} />
                </div>
                <div className="mx-1 flex justify-end">
                    { (!dataUser) 
                        ? (<div><div className="w-auto px-5 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                        hover:text-slate-900"><FontAwesomeIcon icon={faTriangleExclamation}/> Untuk melakukan contact silahkan login terlebih dahulu</div>
                        </div>)
                        : (<button 
                            onClick={handleClickSave}
                            className={`w-auto bg-gradient-to-r ${isLoadingSotore ? `cursor-not-allowed` : `cursor-pointer`}  from-purple-500 to-blue-500 text-white font-bold py-1 px-5 text-sm rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
                            { isLoadingSotore ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faPaperPlane } /> Kirim</span> }
                        </button>)
                    }
                </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 mt-3 mx-4"></div>
                <div className="px-5">
                    <div className=" mt-0  text-slate-500 bg-slate-50 px-5 py-5 h-96 max-h-96 overflow-auto">
                        {/*  */}
                        { dataContact?.response?.contacts && dataContact.response.contacts.map(c=> <CardContact key={c.id} c={c} style={`flex flex-col gap-1 items-end`} styleContent={`w-auto font-light text-sm  bg-cyan-100 text-slate-500 py-2 px-5`}/>)  }
                        {/*  */}
                    </div>
                </div>
                <div className="mt-5 mb-5 flex justify-end ">
                {/* pagination  */}
                { contacts.length  > 0 ? 
                <>
                    <HomePaginate
                    data={contacts}
                    setPage={setPerPage} 
                    page={page} 
                    totalsPage={totalsPage}
                    perPage={perPage}
                    totals={totals}
                    handleClikPaginate={handleClikPaginate}
                    />
                </> 
                : <>
                    <div className="bg-red-800 text-slate-50 p-2 w-full mx-5"><FontAwesomeIcon icon={faTriangleExclamation} /> Tidak ada data</div>
                </>
                }
              {/* pagination */}
            </div>
            </div>
        </div>

    </div>
    )
}

export default Contact