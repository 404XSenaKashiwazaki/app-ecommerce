import { useDispatch, useSelector  } from "react-redux"
import { useFindProfileQuery} from "../features/api/apiProfileSlice"
import { useEffect, useState } from "react"
import { removeMessage } from "../features/profileSlice"
import Swal, { Toast, mySwal } from '../utils/sweetalert'
import FormInputProfilePassword from "../components/FormInputProfilePassword"
import FormInputProfile from "../components/FormInputProfile"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCogs, faImages } from "@fortawesome/free-solid-svg-icons"
import Form from "../partials/sites/Form"
import Slider from "./Slider"
import { useLocation, useNavigate } from "react-router-dom"
import TabSite from "../components/TabSite"
import { Helmet } from 'react-helmet'

const Sites = ({ site }) => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get('p')    
    const { message } = useSelector(state => state.profile)
    const dispatch = useDispatch()
    useEffect(() => {
        if(message) Toast.fire({ text: message, icon: "success"})
        dispatch(removeMessage())
    },[dispatch, message])
console.log({ site });

    return(
        <>
        {/* <Helmet>
            <title>{ site } - Sites</title>
        </Helmet> */}
            <div className="w-full mx-auto mt-1 px-0">
                <div className="h-full bg-white shadow-md rounded-md p-4">
                    <h2 className="text-xl font-bold mb-4">{ page }</h2>
                    <TabSite site={<Form />} slider={ <Slider />}/>
                </div>
            </div>
        </>

    )
}

export default Sites