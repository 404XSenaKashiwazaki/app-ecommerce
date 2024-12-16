import { useEffect, useState } from 'react'
import { useFindOneContact_Query, useUpdateContact_Mutation } from '../../features/api/apiContactSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../../features/contactSlice'
import { setModalClose } from "../../features/modalSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faSave, faSpinner, } from '@fortawesome/free-solid-svg-icons'
import ErrorMsg from '../../components/ErrorMsg'


const Add = () => {
  const dispatch = useDispatch()
  const { modalDataId, modalShow } = useSelector(state=>state.modal)
  const [ input, setInput ] = useState({
    email: "",
    isi: "",
    tanggapan: "",
    UserId: "",
    error: null
  })
  const { data, isSuccess, isError, error, isLoading} = useFindOneContact_Query({ contactid : modalDataId  },{ skip: (modalDataId) ? false: true })
  const [ update, { isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate, isLoading: isLoadingUpdate } ] = useUpdateContact_Mutation()
 

  const handleSave = async (e) => {
    e.preventDefault()
    try {

      const res = await update({ data: input, id: data.response.contacts.id }).unwrap() 
      console.log(res);
      dispatch(setMessage(res.message))
      dispatch(setModalClose())
    } catch (error) {
      const msg = []
      if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
        input.error = []
        const name = e.param.match(/([A-Za-z]+)/)[0]
        
        msg.push(e.msg)
        input.error = { [name.toLowerCase()]: [...new Set(msg)] }
      })

      setInput(input)
    }
  }

  const handleChange = async (e) => {
    const { name, value,checked } = e.target
    input[name] = value
    setInput(prev => ({...prev, input}))
  } 

  const handleChaneReset = (e,i) => {
    e.preventDefault()
    setInput({
      email: "",
      isi: "",
      tanggapan: "",
      UserId: "",
      error: null
    })
  }


  useEffect(() => {
    if(data?.response?.contacts) setInput({
      email: data.response.contacts.email,
      isi: data.response.contacts.isi,
      tanggapan: data.response.contacts.tanggapan,
      UserId: data.response.contacts.UserId,
      id: data.response.contacts.id,
      error: null
     })
  },[ data ])

  return (
    <div className='w-full mb-0'> 
    <div className='flex flex-col md:flex-row gap-10'>
        <div className="shadow-2xl rounded-sm px-7 py-5 bg-slate-100 flex-initial w-full overflow-hidden">
            <div className="p-0 mb-2">
              <h3 className="font-bold"><span><FontAwesomeIcon icon={faMessage}/> Form Tanggapan Contact</span></h3>
            </div>

            {/* form  */}
            <div className="flex flex-col">
            <div className="bg-slate-100 p-2 items-center flex flex-col md:flex-row justify-start gap-2 md:gap-5 mb-3 w-full">
              <label 
                  htmlFor="title"
                  className="flex-initial w-full md:w-[50%] mx-4">
                  Email
              </label>
              <input 
                  type="text" 
                  readOnly
                  className="w-full border-none" 
                  value={input?.email} />
              </div>
              <ErrorMsg message={input?.error?.email} />
            </div>
            <div className="flex flex-col">
            <div className="bg-slate-100 p-2 items-center flex flex-col md:flex-row justify-start gap-2 md:gap-5 mb-3 w-full">
              <label 
                  htmlFor="title"
                  className="flex-initial w-full md:w-[50%] mx-4">
                  Isi
              </label>
              <textarea
                  type="text" 
                  readOnly
                  className="w-full border-none" 
                  value={input?.isi} />
              </div>
              <ErrorMsg message={input?.error?.isi} />
            </div>
            <div className="flex flex-col">
            <div className="bg-slate-100 p-2 items-center flex flex-col md:flex-row justify-start gap-2 md:gap-5 mb-3 w-full">
              <label 
                  htmlFor="title"
                  className="flex-initial w-full md:w-[50%] mx-4">
                  Tanggapan
              </label>
              <textarea
                  onChange={(e) => handleChange(e)}
                  type="text" 
                  name='tanggapan'
                  className="w-full border-none" 
                  value={input?.tanggapan} />
              </div>
              <ErrorMsg message={input?.error?.tanggapan} />
            </div>
            <div className="flex justify-end">
            <button 
                  onClick={handleSave}
                  className="w-auto px-3 py-1 text-sm text-slate-50 bg-indigo-800 font-medium text-center hover:bg-indigo-900
                  hover:text-slate-200">
                  { isLoadingUpdate ? <span><FontAwesomeIcon icon={ faSpinner } /> </span> : <span><FontAwesomeIcon icon={ faSave } /> Simpan</span> }
              </button>
            </div>
            {/* </form> */}
        </div>
    </div>
    </div>
  )
}

export default Add