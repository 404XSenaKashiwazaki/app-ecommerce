import React from 'react'
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"


const ProductsImage = ({ images, poster, handleChangeImg }) => {
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
            items: 3,
        },
    }

    return (
        <div className="w-full">
            <Carousel
                responsive={responsive}
                infinite={true} // Carousel loops infinitely
                autoPlay={false} // Autoplay enabled
                autoPlaySpeed={2000} // Speed of autoplay
             // Show navigation arrows
                arrows={true}
                swipeable={true} // Enable swipe on touch devices
                draggable={true} // Enable dragging with mouse
                className="p-0 m-0 w-full"
                showDots={true}
                dotListClass=""
                itemClass="px-1 py-4"
            >
            {  images.map((e,i) => <img 
                    key={ e.id }
                    src={ e.url_image}
                    alt={ e.nama_image }
                    onClick={()=> handleChangeImg(e,i)}
                    className={`w-16 h-16 rounded-md ${ (poster?.index == i)  && `border-slate-800 border-2 opacity-50` }`}
                />) 
            }
            </Carousel>
        </div>
    )
}

export default ProductsImage