import React, { useEffect, useState } from "react";
import { useShowSlidersQuery } from "../features/api/apiSlidersSlice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import { formatDiskon, formatRp } from "../utils/FormatRp";
const PopularProducts = ({ populars }) => {
  const [ banners, setBanners ] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex == banners.length - 1 ? 0 : prevIndex + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners])


  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 3, // Number of items visible at a time
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
    },
}

  return (
    <div className="relative w-full  mx-0 overflow-hidden">
      <Carousel  
        responsive={responsive}
        infinite={true} // Carousel loops infinitely
        autoPlay={true} // Autoplay enabled
        autoPlaySpeed={4000} // Speed of autoplay
      // Show navigation arrows
        arrows={true}
        swipeable={true} // Enable swipe on touch devices
        draggable={true} // Enable dragging with mouse
        className="p-0 m-0 w-full"
        showDots={true}
        dotListClass=""
        itemClass="px-1 py-3 z-50" >
      { (populars.length > 0) && populars.map((p) => (
          <Link to={`/products/${p.slug}`} key={p.id} className="grid grid-cols-2 p-2 gap-2 mx-1 relative  bg-white shadow-lg rounded-sm hover:scale-95 duration-100">
             <img
              src={p.ImageProducts[0].url_image}
              alt={p.nama_produk}
              className="w-20 h-20 object-fill "
            />
            <span className="ml-2 absolute -top-1 -right-1 text-sm font-light text-red-500 px-2 py-0 bg-slate-800 rounded-sm">Diskon{ p?.Diskon?.diskon  } %</span>
            <div className="flex flex-col justify-center items-center  bg-opacity-10 text-slate-900 w-full h-full mt-2">
              <h2 className="text-sm font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-900">{p.nama_produk}</h2>
                <div className="text-xs mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-900 flex flex-row">
                {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 cursor-pointer } text-xs ${
                    index < p.rating ? "text-yellow-500" : "text-gray-300"
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
              <div className="flex justify-between gap-1 my-1 mx-0 w-full">
                <p className="text-xs w-full font-light overflow-hidden text-ellipsis whitespace-nowrap text-gray-900">{ formatRp(formatDiskon(p.harga_produk, p?.Diskon?.diskon)) }</p>
                <p className="text-xs font-extralight w-full overflow-hidden text-ellipsis whitespace-nowrap line-through text-gray-900">{ formatRp(p.harga_produk) }</p>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  )
}

export default PopularProducts
