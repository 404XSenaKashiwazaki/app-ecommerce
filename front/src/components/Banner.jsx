import React, { useEffect, useState } from "react";
import { useShowSlidersQuery } from "../features/api/apiSlidersSlice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"

const BannerSlider = () => {
  const [ banners, setBanners ] = useState([])
  const { data } = useShowSlidersQuery()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if(data?.response?.sliders) setBanners(data.response.sliders)
  },[ data ])

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
        items: 1, // Number of items visible at a time
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
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
        itemClass="px-1" >
      { (banners.length > 0) && banners.map((banner) => (
          <div key={banner.id} className="min-w-full flex-shrink-0">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-52 object-fill"
            />
            <div className="absolute bottom-9 w-full flex flex-col justify-center items-center  bg-opacity-10 text-slate-900 ">
              <h2 className="text-6xl font-bold">{banner.title}</h2>
              <p className="text-2xl">{ banner.desk } </p>
            </div>
          </div>
        ))}
      </Carousel>
      {/* <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        { (banners.length > 0) && banners.map((banner) => (
          <div key={banner.id} className="min-w-full flex-shrink-0">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-52 object-fill"
            />
            <div className="absolute bottom-9 w-full flex flex-col justify-center items-center  bg-opacity-10 text-slate-900 ">
              <h2 className="text-6xl font-bold">{banner.title}</h2>
              <p className="text-2xl">{ banner.desk } </p>
            </div>
          </div>
        ))}
      </div> */}

      {/* Navigasi */}
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
      >
        &#10095;
      </button> */}

      {/* Indikator */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div> */}
    </div>
  )
}

export default BannerSlider;
