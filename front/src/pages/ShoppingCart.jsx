import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDiskon, formatRp } from '../utils/FormatRp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { setOptions, setRemoveOption, removeQuantity, setJumlah,setQuantity } from "../features/shoppingCartSlice"
import EmptyShoppingCart from '../components/EmptyShoppingCart'
import { useFindAllProductsCartsQuery } from '../features/api/apiShoppingCart'
import { Helmet } from 'react-helmet'

const ShoppingCart = ({ site }) => {
    const dispatch = useDispatch()
    const [ shippingCost, setShippingCost ] = useState(5.00)
    const [ promoCode, setPromoCode ] = useState('')
    const [ total, setTotal ] = useState(0) 
    const [ carts, setCarts ] = useState([])
    const [ productId, setProductId ] = useState([])
    const [ qty, setQty ] = useState(0)
    const [ username, setUsername ] = useState("")
    const [ checkedId, setCheckedId ] = useState(null)
    const [ checkedAll, setCheckedAll ] = useState(false)
    const selector = useSelector(state=>state.shoppingCart)
    const { dataUser } = useSelector(state=> state.auth)
    const { options } = selector    
    const { data } = useFindAllProductsCartsQuery({ username: dataUser?.username, productId },{ skip: (productId.length == 0)})

    useEffect(() => {

        if(options?.orders) {
            setProductId(options.orders.orders_item.map(e=> e.ProductId))
            setQty(options.orders.orders_item.length)
            setCheckedId(options.orders.orders_item.map(e=> ({ ProductId: e.ProductId, checked: true })))
            setCheckedAll(true)
        }
        
        if(data?.response?.products && options?.orders?.orders_item.length > 0) {
            const res = data.response.products.map((e,i)=> {
                const quantity = options.orders.orders_item.filter(e2=> (e2.ProductId == e.id))[0]?.quantity
                return {
                    ...options.orders.orders_item[i],
                ProductId: e.id,
                price: formatDiskon(e.harga_produk, e.Diskon.diskon),
                quantity: quantity,
                desk_produk: e.desk_produk,
                nama_produk: e.nama_produk,
                slug: e.slug,
                harga_produk: e.harga_produk,
                stok: e.stok_produk,
                image_products: e.ImageProducts[i].url_image,
                total: formatDiskon(e.harga_produk, e.Diskon.diskon) * quantity
                }
            })
            const totalPrice = res.reduce((acu,cure) => acu + cure.total, 0)
            setTotal(totalPrice)
            setCarts(res)
        }
    },[ data, options ])

    useEffect(() => {
        if(dataUser) setUsername(dataUser.username)
    },[ dataUser ])

    const updateQuantity = (id, quantity) => {
        if(options && options?.orders){
            const shoppingCart = options.orders
            let ordersItem = shoppingCart.orders_item 

            ordersItem = ordersItem.map(e=> {
                if(id == e.ProductId) {
                    const newQuantity = (quantity == -1) ? e.quantity - 1 : e.quantity + 1
                    if(newQuantity < 1) return null
                    const totalPrice = e.price * newQuantity

                    return { ...e, quantity: newQuantity }
                }
                return e
            }).filter(e => e != null)
            
            if(ordersItem.length == 0) {
                dispatch(setRemoveOption())
                setCarts([])
                setCheckedId(null)
                setCheckedAll(false)
                dispatch(removeQuantity())
            }else{
                const totalPrice = ordersItem.reduce((acu,cure) => acu + cure.total, 0)
                dispatch(setOptions({ orders: {...shoppingCart, orders_item: ordersItem }}))
            }
        }
    }

    const handleDelCartProduct = (id) => {
        const shoppingCart = options.orders
        let ordersItem = shoppingCart.orders_item 
        ordersItem = ordersItem.filter(e => e.ProductId != id)

        // const totalPrice = ordersItem.reduce((acu,cure) => acu + cure.total, 0)
        dispatch(setOptions({ orders: {...shoppingCart, orders_item: ordersItem}}))
        setCarts(ordersItem)
        // setCheckedId(ordersItem.map(e=>({ ProductId: e.ProductId, checked: true })))
        // setCheckedAll(true)
        if(ordersItem.length == 0) dispatch(setRemoveOption())
        dispatch(setQuantity(ordersItem.length))
    }

    return  (
    <>
    <Helmet>
        <title>
            { site }- Keranjang Belanja
        </title>
    </Helmet>
    { (options?.orders && carts.length > 0) 
    && ( <div className="flex flex-col md:flex-row md:justify-center py-3 gap-1">
        <div className="w-full bg-white p-6 shadow-md rounded-lg ">
            <h1 className="text-lg font-bold mb-6"><FontAwesomeIcon icon={faShoppingCart} /> Keranjang Belanja</h1>
    
            <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="">
                <tr className="text-left">
                <th className="pb-4 text-sm">Detail Produk</th>
                <th className="pb-4 text-sm">Jumlah</th>
                <th className="pb-4 text-sm">Harga</th>
                <th className="pb-4 text-sm">Sub Harga</th>
                </tr>
            </thead>
            <tbody>
                { carts.map((item, index) => (
                <tr key={item.ProductId} className="border-b">
                    <td className="py-4 xs:w-full w-full  md:w-60 flex items-center space-x-4 " >
                        <Link to={`/products/${item.slug}`} >
                            <img src={item.image_products} alt={item.nama_produk} className="w-16 h-16 " />
                        </Link> 
                        <div className="w-full">
                            <h3 className="font-medium text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap">{item.nama_produk}</h3>
                            <p className=" text-gray-600 text-xs w-full overflow-hidden text-ellipsis whitespace-nowrap">{ item.desk_produk }</p>
                            <button onClick={() => handleDelCartProduct(item.ProductId)} className="text-red-500 text-xs mt-2">Hapus</button>
                        </div>
                    </td>
                    <td className="py-4">
                    <div className="flex items-center">
                        <button onClick={() => updateQuantity(item.ProductId, -1)} className="px-2 py-1 border rounded-l">-</button>
                        <span className="px-4 py-1 border">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.ProductId, 1)} className="px-2 py-1 border rounded-r">+</button>
                    </div>
                    </td>
                    <td className="py-4">
                        <p className="text-sm font-medium">{ formatRp(item.price) }</p>
                        <p className="text-xs line-through">{ formatRp(item.harga_produk) }</p>
                    </td>
                    <td className="py-4">{ formatRp(item.total) }</td>
                </tr>
                )) }
            </tbody>
            </table>
            </div>
    
            <div className="mt-6">
            <Link to="/" className="text-indigo-600 text-sm font-semibold">  <FontAwesomeIcon icon={faArrowLeft} /> Lanjutkan Belanja</Link>
            </div>
        </div>
    
        <div className="md:w-1/3 xs:w-full w-full h-full bg-white p-6 md:ml-6  mt-2 shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-3">Ringkasan Pesanan</h2>
    
            <div className="flex gap-3 mb-4">
            <span className="text-md font-medium">Jumlah: </span>
            <span className="text-md font-medium"> { qty }</span>
            </div>
    
            <div className="flex justify-between font-bold text-lg">
                <div className="border-t border-gray-300 mt-1 pt-2">
                <span className="text-md font-semibold ">Total Pesanan: </span>
                <span className="terxt-sm font-semibold">{ formatRp(total) }</span>
                </div>
            </div>
            <Link to={`/checkouts/${username}`} >
                <button className="w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-1 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">CHECKOUT</button>
            </Link>
        </div>
        </div>) 
    
    }
    { (!options || options.length == 0) && <EmptyShoppingCart /> }
    </>
    )
}

export default ShoppingCart