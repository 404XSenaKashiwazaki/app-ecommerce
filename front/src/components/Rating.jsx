import { useEffect, useState } from "react";

const Rating = ({ maxRating = 5, setForm, id, disabled, dbRating }) => {
    const [rating, setRating] = useState(dbRating)

    useEffect(() => { setRating(dbRating) },[ dbRating ])
    const handleRatingChange = (value,id) => {
        setRating(value)
        setForm(prev => ({...prev, products: prev.products.map(e => (id == e.ProductId ? ({ ...e ,ratings: value}) : ({ ...e }))) }))
    }

    return (
        <div className="flex items-center space-x-2 ">
        {Array.from({ length: maxRating }, (_, index) => (
            <label key={index} className="flex items-center ">
            <input
                type="checkbox"
                disabled={disabled}
                className="hidden "
                checked={index < rating}
                onChange={() => handleRatingChange(index + 1,id)}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${ disabled ? `cursor-not-allowed` : `cursor-pointer` } text-xs ${
                index < rating ? "text-yellow-500" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => (!disabled) && handleRatingChange(index + 1,id) }
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z"
                />
            </svg>
            </label>
        ))}
        </div>
    )
    }


export default Rating