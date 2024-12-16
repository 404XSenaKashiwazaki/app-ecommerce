import { faEnvelope, faMessage, faPaperPlane, faReply, faSlash, faStar, faStarHalf, faThumbsUp, faTrash, faUser, faUserCircle, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Modal from "./Modal_"
import { useState } from 'react'
import { useEffect } from 'react'
import ErrorMsg from './ErrorMsg'
import { useDispatch, useSelector } from 'react-redux'
import { useFindAllContactOrdersQuery, useStoreContactOrdersMutation } from '../features/api/apiContactOrdersSlice'
import TimeAgo from './TimeAgo'
import { removeMessage, setMessage } from "../features/rateItSlice"
import { Toast } from '../utils/sweetalert'
import { Link } from 'react-router-dom'
import { formatRp } from '../utils/FormatRp'
import Rating from './Rating'
import { useFindOneProductsRateItQuery, useFindProductsRatingRateItQuery, useStoreProductsRateItMutation } from '../features/api/apiRateItSlice'


const RatingModal = ({ id,itemContact,showModal, setShowModal }) => {
    const selector = useSelector(state=>state.contactOrders)
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ error: null, ...itemContact })
    const { data } = useFindProductsRatingRateItQuery({ username: itemContact.username, orderid: itemContact.OrderId},{ skip: (id) ? false : true })
    const [ sendRating ] = useStoreProductsRateItMutation()
    const {  message } = selector
    const [ rating, setRating ] = useState([1,2,3,4,5])
    const [ review, setReview ] = useState('')

    useEffect(() => {
        if(data?.response?.ratings){ 
            const mergedArray = data.response.ratings.map(item1 => {
            const match = itemContact.products.find(item2 => item2.ProductId === item1.ProductId)
                return match ? { ...item1, ...match } : item1
            })
            setForm(prev => ({...prev, products:mergedArray}))
        }
    },[ data ])
    
    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message ])

    const ModalTitle = () =>  <span className="px-2"><FontAwesomeIcon icon={faStar}/> Beri nilai </span>

    const handleClickSend = async (e,data,i) => {
        let products = {};
        products[i] = data
        e.preventDefault()
        try {
            console.log({ products });
            
            const res = await sendRating({ data: { products }, username: form.username}).unwrap()
            console.log({ res });
            
            // dispatch(setMessage(res.message))
            // setShowModal(false)
        } catch (error) {
            console.log(error)
            const inpt = form.products
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
            console.log(inpt);
            
        }
    }

    const handleChange = (ee, id) => {
        const { name,value } = ee.target
        setForm(prev => ({...prev, products: prev.products.map(e => (id == e.ProductId ? ({ ...e ,reviews: value}) : ({ ...e }))) }))
    }

    if(!form.products) return <></>
    return (
        <> 
            <Modal mt="mt-10" type="sm" title={<ModalTitle />}  button="" setId={() => {}} showModal={showModal} setShowModal={setShowModal}>
                <div className="px-4 mt-2">
                    <div>
                        { form.products.map((e,i)=> <div  key={e.id}>

                            <Link to={`/products/${e.slug}`} className={`cursor-pointer flex justify-between gap-2  mb-4 border-t border-gray-300`}>
                        <div className="w-auto mt-2">
                            <img
                                src={ e.imageProducts ?? "" }
                                alt={ e.produk }
                                className="w-20 rounded-md h-20 "
                            />
                        </div>
                        <div className={`w-full`}>
                            <div className="mt-2">
                                <p className="text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium">{ e.produk }</p>
                                <p className="text-xs w-full overflow-hidden text-ellipsis whitespace-nowrap mt-1">{ e.desk }</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-gray-600 text-sm mt-1 font-semibold">{ formatRp(e.harga) }</p>
                            </div>
                            <div className="flex gap-5">
                                <p className="text-gray-600 text-sm mt-1">Jumlah: { e.qty }</p>
                                <p className="text-gray-600 text-sm mt-1 font-semibold">Total: { formatRp(e.total) }</p>
                            </div>
                        </div>
                        </Link>
                        <div className="w-full mb-2">
                            <p>Kualitas Produk</p>
                            <Rating 
                                setForm={setForm} 
                                id={e.id} 
                                dbRating={e?.Rating?.rating || 0}
                                disabled={(e?.Rating) ? true : false}
                            />
                            <ErrorMsg message={e?.error?.ratings || ""} />
                        </div>
                        <div className="w-full mb-0">
                            <textarea disabled={(e?.Rating) ? true : false }  
                            onChange={ (ef) => handleChange(ef, e.id)} value={form.content || e?.Rating?.review} name="content" id="content" className={` ${ (e?.Rating) && `cursor-not-allowed`} w-full min-h-10 border-slate-600 rounded-sm`} placeholder="Tulis pesan"/>
                            <ErrorMsg message={e?.error?.reviews || ""} />
                        </div>
                        <div className="flex justify-end ">
                            <div className="mb-3">
                            <button 
                                onClick={(ee) => handleClickSend(ee,form.products[i],i)}
                                disabled={(e?.Rating) ? true : false }  
                                className={`
                                ${ (e?.Rating) && `cursor-not-allowed`}
                                bg-sky-800 px-5 py-1 rounded-sm 
                                border-0 text-slate-300  w-auto 
                                h-auto text-sm  
                                font-medium text-center hover:bg-sky-900
                                hover:text-slate-200`}
                                ><FontAwesomeIcon icon={faPaperPlane} /> Kirim</button>
                            </div>
                        </div>
                        </div>) }
                        
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default RatingModal