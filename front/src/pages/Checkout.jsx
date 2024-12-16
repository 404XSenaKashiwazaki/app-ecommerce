import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { formatDiskon, formatRp } from "../utils/FormatRp"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCheckoutMutation, useCreateTransactionMutation, useDeleteOrderCheckoutMutation, useFindAllProductsCartsQuery, useStoreOrdersItemsMutation, useStorePaymentMutation } from "../features/api/apiShoppingCart"
import { setMessage, removeMessage, setRemoveOption, removeQuantity, resetState, resetShoppingCarts, setShoppingCarts } from "../features/shoppingCartSlice"
import { Toast} from '../utils/sweetalert'
import { v4 as uuidv4 } from 'uuid'
import { useSendEmailsCheckoutMutation } from "../features/api/apiSendEmailsSlice"
import Ongkir from "./Ongkir"
import TimeAgo from '../components/TimeAgo'
import { Helmet } from 'react-helmet'
 
const CheckOutPage = ({ site }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { dataUser } = useSelector(state=> state.auth)
    const { username } = useParams()
    const enabled_payments = [
        // ATM / Bank Transfer
        'bca_va',
        'bri_va',
        'mandiri_va',
        'bni_va',
        // GoPay / QRIS
        'gopay',
        'qris',
        // ShopeePay / SPayLater
        // E-wallet
    ]
    const [ form,setForm ] = useState({
        nama: "",
        username: "",
        email: "",
        negara: "",
        provinsi: "",
        kota: "",
        kodePos: "",
        alamat: ""

    })
    const [ email, setEmail ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ promoCode, setPromoCode ] = useState('')
    const selector = useSelector(state=>state.shoppingCart)
    const { options, message, carts } = selector    
    const [ checkout, { isLoading , data: dataCheckout} ] = useCheckoutMutation()
    const [ productId, setProductId ] = useState([])
    const [ total, setTotal ] = useState(0) 
    const [ snapToken, setSnapToken] = useState('')
    const { data } = useFindAllProductsCartsQuery({ username: dataUser?.username, productId },{ skip: (productId.length == 0)})
    const [ createTransaction, { error, isError } ] = useCreateTransactionMutation()
    const [ deleteTransaction ] = useDeleteOrderCheckoutMutation()
    const [ storePayment ] = useStorePaymentMutation()
    const [ sendEmails ] = useSendEmailsCheckoutMutation()
    const [ storeOrdersItems ] = useStoreOrdersItemsMutation()
    const [ selectedProvince, setSelectedProvince ] = useState(9)
    const [ selectedCity, setSelectedCity ] = useState(252)
    const [ shippingCost, setShippingCost ] = useState(null)
    const [ courier, setCourier ] = useState("JNE")
    const couriers = ["JNE","POS","TIKI"]
    const [ courierType, setCourierType ] = useState({
        kurir: "REG",
        harga: 0
    })
    const [ msg, setMsg ] = useState("")
    const [ weight, setWeight ] = useState(1)

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
        script.setAttribute("data-client-key",process.env.VITE_CLIENT_KEY)
        
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    },[ ])

    useEffect(() => {
        if(options?.orders) setProductId(options.orders.orders_item.map(e=> e.ProductId))
        if(data?.response?.products && options?.orders?.orders_item.length > 0) {
            const res = data.response.products.map((e,i)=> {
                setWeight(e.berat)
                const quantity = options.orders.orders_item.filter(e2=> (e2.ProductId == e.id))[0]?.quantity
                return {
                    ...options.orders.orders_item[i],
                ProductId: e.id,
                price: formatDiskon(e.harga_produk, e.Diskon.diskon),
                quantity: quantity,
                desk_produk: e.desk_produk,
                nama_produk: e.nama_produk,
                harga_produk: e.harga_produk,
                slug: e.slug,
                stok: e.stok_produk,
                image_products: e.ImageProducts[i].url_image,
                total: formatDiskon(e.harga_produk, e.Diskon.diskon) * quantity
                }
            })
            const totalPrice = res.reduce((total, item) => total + item.price * item.quantity, 0)
            setTotal(totalPrice)
            dispatch(setShoppingCarts(res))
        }
        if(!options) navigate("/")
    },[ data, options ])

    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        if(msg) Toast.fire({  text: msg, icon: "warning"})
        dispatch(removeMessage())
        setMsg("")
    },[dispatch, message, msg])

    useEffect(() => {
        if(dataUser) setForm({
            nama: dataUser.namaDepan +" "+ dataUser.namaBelakang,
            username: dataUser.username,
            email: dataUser.email,
            negara: dataUser.detailUsers.negara,
            provinsi: dataUser.detailUsers.provinsi,
            kota: dataUser.detailUsers.kota,
            kodePos: dataUser.detailUsers.kodePos,
            alamat: dataUser.detailUsers.alamat
        })
    },[ dataUser ])

    const handleCheckOutPayment = async () => {
        if(form.username == "" || form.email == "" || form.provinsi == "" || form.kota == "" || form.kodePos == "" || form.alamat == "") return setMsg("Detail permbayaran tidak boleh ada yang kosong")
        let successHandled = false
        const orderId = uuidv4()
        const firtsName = dataUser.namaDepan
        const lastName = dataUser.namaBelakang
        const email = dataUser.email
        const phone = dataUser.detailUsers.noHp

        const item_details = carts.map((e) => ({
            id: e.ProductId,
            name: e.nama_produk.slice(0,36),
            price: e.price,
            quantity: e.quantity,
        }))
        item_details.push({
            id: "ONGKIR",
            price: courierType.harga,
            quantity: 1,
            name: "Ongkos Kirim"
        })
        const data = {
            orders: {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: total
                },
                credit_card: {
                    secure: true
                },
                enabled_payments,
                customer_details: {
                    first_name: firtsName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    billing_address: {
                        first_name: firtsName,
                        last_name: lastName,
                        phone: phone,
                        address: form.alamat,
                        city: form.kota,
                        postal_code: form.kodePos,
                        country_code: "IDN"
                    },
                    shipping_address: {
                        first_name: firtsName,
                        last_name: lastName,
                        phone: phone,
                        address: form.alamat,
                        city: form.kota,
                        postal_code: form.kodePos,
                        country_code: "IDN"
                    }
                },
                item_details
            }
        }
        const orders_item = [...data.orders.item_details.map((e, i) => ({
            ...e,
            ProductId: carts[i]?.ProductId || "ongkir",
            price: carts[i]?.price || courierType.harga,
        }))]

        data.orders.orders_item = orders_item
        createTransaction({ data: data ,username: dataUser.username }).then(res => {
            const snapInstance = window.snap
            console.log({ res });
            
            snapInstance.pay(res.data.response.transactionToken, {
                onSuccess: async (result) => {
                    if (successHandled) return
                    successHandled = true
                    dispatch(resetState())
                    dispatch(setRemoveOption())
                    dispatch(removeQuantity())
                    dispatch(resetShoppingCarts())
                    try {
                        await handleStoreData(data,result,`/order/success/${result.transaction_id}`,"success")
                    } catch (error) {console.log(error)}
                },
                onPending: async (result) => {
                    if (successHandled) return
                    successHandled = true
                    dispatch(resetState())
                    dispatch(setRemoveOption())
                    dispatch(removeQuantity())
                    dispatch(resetShoppingCarts())
                    try {
                        await handleStoreData(data,result,`/order/payment-confirm/${result.transaction_id}`,"pending")
                    } catch (error) {console.log(error)}
                },
                onError: function(result) {
                    console.log('Error:', result)
                },
                onClose: async () => {
                    try {
                        // await deleteTransaction({ data: { orderid: id}, username: dataUser.username }).unwrap()
                        console.log('Payment popup closed without completing payment')
                    } catch (error) {console.log(error)}
                    
                }
            })
        }).catch(err=>console.log(err))
    }

    const handleStoreData = async (data,result,navigateUrl,type) => {
        const orders = [{ 
            ...data.orders, 
            UserId: dataUser.id,
            va_numbers: (result.payment_type == "qris") ? [{bank: "gopay",va_number: `https://api.sandbox.midtrans.com/v2/qris/${ result.transaction_id }/qr-code`}] : result.va_numbers,
            transaction_status: result.transaction_status,
            transaction_time: result.transaction_time,
            payment_type: result.payment_type,
            order_id: result.order_id,
            transaction_id: result.transaction_id,
            gross_amount: result.gross_amount,
            customer_details: { ...data.orders.customer_details, username: dataUser.username },
            kurir: courier,
            ongkir: courierType.harga,
        }];
        (type == "pending") 
        ? await checkout({ username: dataUser.username, data: { orders  } }).unwrap()
        : storeOrdersItems({
            username: dataUser.username,
            data: { orders },
        }).unwrap()

        console.log('Success:', result)
        navigate(navigateUrl)
    }

    const handleSelectCourier = (service, value) => {
        setCourierType({ kurir: service, harga: value })
        const total =  carts.reduce((total, item) => total + item.price * item.quantity, 0)
        setTotal(total + value)
    }

    return (
    <div className="flex flex-col md:flex-row justify-center py-3 px-0 md:space-x-4 xs:space-x-0 sm:space-x-0">
        <Helmet>
            <title>{ site } - Checkout</title>
        </Helmet>
        {/* Billing Details */}
        <div className="w-full md:w-2/3 h-1/2 mb-4 bg-white p-6 rounded-lg shadow-lg">
        <Ongkir 
            form={form} 
            setForm={setForm}    
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
            setShippingCost={setShippingCost}
            setSelectedCity={setSelectedCity}
            setSelectedProvince={setSelectedProvince}
            setCourierType={setCourierType}
            courier={courier}
            weight={weight}
            courierType={courierType}
            setTotal={setTotal}
            total={total}
            carts={carts}
        />
        </div>
        {/* Cart Summary */}
        <div className="w-full h-full md:w-1/3 bg-gray-50 p-6  rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
        { (carts.length > 0) &&  <div className="mb-1">
            {
                carts.map((item,index) => <Link to={`/products/${item.slug}`} key={index} className={`cursor-pointer flex justify-between gap-2  mb-4 border-t border-gray-300`}>
                <div className="w-auto mt-2">
                    <img
                        src={ item.image_products ?? "" }
                        alt={ item.nama_produk }
                        className="w-24 rounded-md h-24 "
                    />
                </div>
                <div className={`w-full`}>
                    <div className="mt-2">
                        <p className="text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium">{ item.nama_produk }</p>
                        <p className="text-xs mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap">{ item.desk_produk }</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <p className="text-gray-600 text-sm mt-1 font-semibold">{ formatRp(item.price) }</p>
                        <p className="text-gray-600 text-xs mt-1 font-semibold line-through">{ formatRp(item.harga_produk) }</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-sm mt-1">Jumlah: { item.quantity }</p>
                        <p className="text-gray-600 text-sm mt-1 font-semibold">Total: { formatRp(item.total) }</p>
                    </div>
                </div>
                </Link>
                )
                
            }
        <div className="border-t border-gray-300 mt-4 pt-4"></div>
        <div className="mb-1">
            <label className="block mb-2">Pilih Kurir </label>
            <select
            className="w-full p-1 mb-1 mt-1 block border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => {
                // console.log({ carts });
                
                // const totalPrice = carts.reduce((a, item) => a + item.total, 0)
                // setTotal(totalPrice)
                setCourier(e.target.value)
            }}
            value={courier}
            >
            <option value="">-- Pilih Kurir --</option>
            {couriers.map((c) => (
                <option key={c} value={c}>
                {c}
                </option>
            ))}
            </select>
        </div>
        {shippingCost && (
            <div className="mt-0">
            <h2 className="text-md font-bold">Pengiriman: </h2>
            {shippingCost.map((e) => (
                <div key={ e.code } className="mt-0">
                <p className="text-sm">{e.name}</p>
                <p className="text-sm">Layanan: </p>
                { e.costs.map((e2,i) => <div key={i} className="ml-3">
                    { i == 0 && <div className="border-t border-gray-300 mt-1 pt-1"></div>}
                    <p className="text-sm">{e2.service} - { e2.description }</p>
                    <div className="flex md:flex-row md:justify-between mt-1">
                        <p className="text-xs">
                            Harga: Rp
                            {e2.cost[0].value.toLocaleString("id-ID")}
                        </p>
                        <div className="flex justify-end gap-2">
                            <p className="text-xs">Estimasi: {e2.cost[0].etd} hari</p>
                            <input type="checkbox" checked={ (e2.service == courierType.kurir ) ? true : false } onChange={() => handleSelectCourier(e2.service, e2.cost[0].value)} className="rounded-md"/>
                        </div>
                    </div>
                    <div className="border-t border-gray-300 mt-1 pt-1"></div>
                </div>) }
                </div>
            ))}
            </div>
        )}
        {/* <div className="mb-6 mt-3">
        <label className="block mb-2 text-sm">Promo Code</label>
        <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter your code"
            className="w-full p-1 border rounded mb-2"
        />
        <button className="w-full bg-red-600 text-white py-1 rounded-md hover:bg-red-500 text-sm transition">APPLY</button>
        </div> */}
            <div className="border-t-2 border-gray-300 mt-4 pt-4">
                <p className="text-lg font-bold">Sub total: { formatRp(total)  }</p>
            </div>
        </div> }
        {/*  */}
        <button 
            disabled={courierType.harga == 0 ? true : false}
            onClick={() => {
                if(courierType.harga == "") return setMsg("Silahkan pilih layanan pengiriman terlebih dahulu")
                handleCheckOutPayment()
            }} 
            className={`w-full mt-2 ${courierType.harga == 0 ? `cursor-not-allowed` : `cursor-default`} py-1  bg-gradient-to-r w-full from-purple-500 to-blue-500 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs px-1 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}>
            CHECKOUT
        </button>
        </div>
    </div>
    )
}

export default CheckOutPage