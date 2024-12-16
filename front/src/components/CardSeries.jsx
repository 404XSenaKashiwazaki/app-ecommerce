import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDiskon, formatRp } from "../utils/FormatRp"
import { removeMessage, setMessage, setOptions, setQuantity } from "../features/shoppingCartSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Toast } from "../utils/sweetalert"

const CardSeries = ({ items }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const selector = useSelector(state=>state.shoppingCart)
    const { dataUser } = useSelector(state=> state.auth)
    const { message, options } = selector
    
    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
      },[dispatch, message])
    
    const fnDispatch = options => dispatch(options)  

    const fnTotalPrice = data => data.reduce((acu,cure) => acu + cure.total, 0)

    const handleAddToCart =  async ({id, harga_produk, nama_produk, desk_produk,ImageProducts,slug},quantity, UserId, username) => {

        if(options && options?.orders) {
            const orders_item = options.orders?.orders_item.map((e,i) => {
                const quantityOld = e.quantity + quantity
                const price = harga_produk * quantityOld
                if(e.ProductId == id) return { ...e, quantity: quantityOld, total: price }
                return e
            })
    
            if (!options.orders.orders_item.some(e => e.ProductId === id)) {
        
            const price = harga_produk * quantity
            orders_item.push({
                ProductId: parseInt(id),
                // price: harga_produk,
                quantity: quantity,
                // desk_produk: desk_produk,
                // nama_produk: nama_produk,
                // slug: slug,
                // image_products: ImageProducts[0].url_image,
                // total: price 
            });
        }
    
        const total_price = fnTotalPrice(orders_item)
        
        // fnDispatch(setOptions({ orders: {...options.orders, orders_item, total_price }}))
        fnDispatch(setOptions({ orders: {...options.orders, orders_item }}))
        fnDispatch(setMessage("Produk berhasil ditambahkan"))
        fnDispatch(setQuantity(orders_item.length))
        
        }else{
            const orders = {
                UserId: parseInt(UserId),
                status: "Pending",
                orders_item: [{
                    ProductId: parseInt(id),
                    // price: harga_produk,
                    quantity: quantity,
                    // desk_produk: desk_produk,
                    // nama_produk: nama_produk,
                    // slug: slug,
                    // image_products: ImageProducts[0].url_image,
                    // total: harga_produk * quantity
                }]
            }
            const total_price = fnTotalPrice(orders.orders_item)

            // fnDispatch(setOptions({ orders: { ...orders,  total_price } }))
            fnDispatch(setOptions({ orders: { ...orders } }))
            fnDispatch(setMessage("Produk berhasil ditambahkan"))
            fnDispatch(setQuantity(orders.orders_item.length))
        }
    }

    return (
        items.map(item => (
            <div key={item.id} className="w-full md:h-auto md:w-44 overflow-hidden  bg-white p-0 shadow-lg rounded-sm hover:scale-95 duration-100">
            <Link to={`/products/${item.slug   }`}>
                {/* Product Image */}
                <img
                    className="w-full h-36 "
                    src={ item?.ImageProducts[0].url_image }
                    alt="Thor Collectible"
                />
                {/* Product Details */}
                <div className="px-2 mt-1">
                    <div className="flex flex-col ">
                        <h2 className="text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900">{ item?.nama_produk }</h2>
                    </div>

                    {/* Price and Buy Button */}
                    <div className="mt-1">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-900">{ formatRp(formatDiskon(item.harga_produk, item.Diskon.diskon)) }</span>
                        <div className="flex gap-1">
                            <span className="ml-0  text-xs line-through text-gray-500 ">{ formatRp(item.harga_produk) }</span>
                            {Array.from({ length: 5 }, (_, index) => (
                                <div key={index} className="flex items-center ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 cursor-pointer } text-xs ${
                                    index < item.rating ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z"
                                    />
                                </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
            </Link>
            <div className="my-2 mx-2">
                <button onClick={() =>  (dataUser) ? handleAddToCart(item,1,dataUser.id,dataUser.username) : navigate("/login")} className="bg-gradient-to-r w-full from-purple-500 to-blue-500 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-1 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                    <FontAwesomeIcon icon={faCartShopping} /> Masukkan Keranjang
                </button>
            </div>
        </div>
        ))
    )
}
export default CardSeries