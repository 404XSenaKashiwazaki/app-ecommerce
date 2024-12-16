import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const ButtonCategoriesSlider = ({ categories }) => {
    const navigate = useNavigate()
    const buttons = [
        { id: 1, label: "Button 1", action: () => alert("Button 1 clicked!") },
        { id: 2, label: "Button 2", action: () => alert("Button 2 clicked!") },
        { id: 3, label: "Button 3", action: () => alert("Button 3 clicked!") },
        { id: 4, label: "Button 4", action: () => alert("Button 4 clicked!") },
        { id: 5, label: "Button 5", action: () => alert("Button 5 clicked!") },
    ]

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 5, // Number of items visible at a time
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 5,
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 5,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
        },
    }

    return (
    <div className="p-0 mt-2 mb-5 max-w-md">
        <Carousel
            responsive={responsive}
            infinite={true} // Carousel loops infinitely
            autoPlay={false} // Autoplay enabled
            autoPlaySpeed={2000} // Speed of autoplay
            arrows={false} // Show navigation arrows
            swipeable={true} // Enable swipe on touch devices
            draggable={true} // Enable dragging with mouse
            className="p-0 m-0 w-full"

        >
        <button
            onClick={() => {
                    navigate("/")
            }}
            className={`w-auto m-0 bg-gradient-to-l from-purple-600 to-blue-600 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-4 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
        >
        Semua
        </button>
        {categories.map((c) => (
            <div key={c.id} className="flex justify-center items-center gap-0">
            <button
                onClick={() => {
                        navigate("?c="+c.nama)
                }}
                className={`w-auto bg-gradient-to-l from-purple-600 to-blue-600 text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs py-1 px-4 rounded-sm hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
            >
            { c.nama }
            </button>
            </div>
        ))}
        </Carousel>
    </div>
    )
}

export default ButtonCategoriesSlider