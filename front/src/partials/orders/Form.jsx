import { useDispatch, useSelector } from "react-redux"
import { useFindOneOrderBackQuery, useUpdateOrderBackMutation } from '../../features/api/apiOrders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPaperPlane, faPlusSquare, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Modal from "../../components/Modal_"
import { useEffect, useState } from "react"
import { typeBtn } from "../../utils/Type"
import ErrorMsg from "../../components/ErrorMsg"
import { setMessage } from "../../features/ordersSlice"


const Form = ({ id, setId, showModal, setShowModal }) => {
    const dispatch = useDispatch()
    const status = ["pending","dikemas","diperjalanan","selesai","cancel"]
    const [ data, setData ] = useState(null)
    const { data: dataOrders  } = useFindOneOrderBackQuery({ id }, { skip: (id) ? false : true })
    const [ update, { isLoading: loadingUpdate }] = useUpdateOrderBackMutation()
    const [ form, setForm ] = useState({
        orders: [{ 
            resi: "",
            orderId: "",
            status: ""
        }]
    })
    useEffect(() => {
        if(dataOrders?.response?.orders) {
            setForm({ orders: [{ resi: dataOrders.response.orders.resi,orderId: dataOrders.response.orders.id , status: dataOrders.response.orders.status }]})
            setData({
            ...dataOrders.response.orders,
            pembeli: dataOrders.response.orders.User.namaDepan +" "+ dataOrders.response.orders.User.namaBelakang,
            email: dataOrders.response.orders.User.email,
            noHp: dataOrders.response.orders.User.UsersDetail.noHp,
            alamat: dataOrders.response.orders.User.UsersDetail.alamat,
            provinsi: dataOrders.response.orders.User.UsersDetail.provinsi,
            kota: dataOrders.response.orders.User.UsersDetail.kota
            })
        }
    },[dataOrders])

    const handleClickSave = async () => {
        try {
            const res = await update(form).unwrap()
            dispatch(setMessage(res.message))
            setShowModal(false)
        } catch (error) {
            console.log(error)
            
        }
    }

    if(!dataOrders?.response?.orders) return <></>

    const ButtonModal = () => {
        return (
            <div>
                <button 
                    type='button'
                    onClick={handleClickSave}
                    className='
                    bg-blue-800 py-1 px-2 rounded-sm 
                    border-0 text-white
                    h-auto text-sm w-auto
                    font-medium text-center hover:bg-blue-900 mr-1'
                    > { (loadingUpdate) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPaperPlane} /> Simpan</span> }
                </button>
                <button 
                    type='button'
                    onClick={() => setShowModal(false)}
                    className='
                    bg-slate-800 py-1 px-4 rounded-sm 
                    border-0 text-white
                    h-auto text-sm w-auto
                    font-medium text-center hover:bg-slate-900 mr-1'
                    > Batal
                </button>
            </div>
        )
    }

    const ModalTitle = () => <span><FontAwesomeIcon icon={faEdit}/> Edit Status Order</span>

    const handleChange = (e,i,type="input",single=false) => {
        const { name,value, checked } = e.target
        const list = form.orders

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
                if(name == "status") list[i].status = (dataOrders?.response?.orders.status) ? dataOrders.response.orders.status : "pending"
            }
        }

        setForm({ orders: list })
    }

    return (
        <> 
            <Modal setId={setId} type="sm" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
                <div className="w-full mb-1 p-4 h-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="w-1/2 font-bold"><p >Transaksi ID</p></span>:
                        <span className="w-full px-2"><p>{ data?.transactionId }</p></span>
                    </div>
                    <div className="mt-3">
                        { form.orders.length > 0 && form.orders.map((item,i) => (<div key={i}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="w-1/2 font-bold"><p >Status Pesanan </p></span>:
                            <div className="w-full ml-2">
                                <span className={`w-auto px-5 ${ typeBtn(item.status) } text-white py-2 rounded-none font-bold text-sm uppercase transition`}>{ item.status }</span>
                            </div>
                        </div>
                        <div className="w-full mb-2">
                            <label htmlFor="resi" className="font-semibold">No Resi</label>
                            <input type="text" onChange={(e) => handleChange(e,0,"input",true)} value={item.resi} name="resi" id="resi" className="w-full h-8 border-slate-600 rounded-sm" placeholder="Masukan resi"/>
                            <ErrorMsg message={item.error?.resi || ""} />
                        </div>
                        <div className="w-full my-2 mt-3">
                        <label htmlFor="status" className="font-semibold">Status Pesanan</label>
                        <div className="w-full grid grid-cols-2 h-auto px-5 py-2 border-[1px] border-slate-600 rounded-sm shadow-lg">
                            { status.map((status,i) => <div className="flex gap-1 items-center uppercase" key={i}><input checked={item.status == status} onChange={(e) => handleChange(e,0,"checkbox",true)} type="checkbox" className="p-1" value={status}  name="status" id="status" />{ status }</div>) }
                        </div>
                        <ErrorMsg message={item.error?.status || ""} />
                    </div></div>)) }
                    </div>
                </div>
            </Modal>
        </>
    ) 
}

export default Form