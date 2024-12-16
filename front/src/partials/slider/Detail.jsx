import React, { useEffect, useState } from 'react'
import Modal from "../../components/Modal_"
import { useFindOneSlidersQuery } from '../../features/api/apiSlidersSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const Detail = ({ id, setId, showModal, setShowModal }) => {
    const { data } = useFindOneSlidersQuery({ id },{ skip: (id) ? false : true }) 
    const [ slider, setSlider ] = useState(null)

    useEffect(() => {
        if(data?.response?.slider) setSlider(data.response.slider)
    },[ data ])

    const ModalTitle = () => <span><FontAwesomeIcon icon={faSearch}/>  Detail Slider</span>

    
    return (
        <Modal setId={setId} type="sm" title={<ModalTitle />}  button="" showModal={showModal} setShowModal={setShowModal}>
            <div className="flex gap-2 w-full p-4">
                <div className="w-1/2">
                    <img src={ slider?.imageUrl } alt={ slider?.title } />
                </div>
                <div className="w-full">
                    <h4 className="text-lg font-bold">{ slider?.title }</h4>
                    <p className="pt-2 text-md">{ slider?.desk }</p>
                </div>
            </div>
        </Modal>
    )
}

export default Detail