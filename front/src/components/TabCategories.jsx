import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import ButtonCategoriesSlider from './ButtonCategoriesSlider'
import { useFindAllCategoriesFrontQuery } from '../features/api/apiCategoriesSlice'

const TabCategories = () => {
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const { data: dataCategories } = useFindAllCategoriesFrontQuery()
    const [ categories, setCategories ] = useState([])

    useEffect(() => {
        if(dataCategories?.response?.categories) setCategories(dataCategories.response.categories)
    },[ dataCategories ])

    if(categories.length == 0) return <></>

    return (
        <div className="w-full">
        {/* Tab buttons */}
        <ButtonCategoriesSlider categories={categories} />
        </div>
    )
}

export default TabCategories
