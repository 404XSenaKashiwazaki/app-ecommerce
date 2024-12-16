import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFindOneCategoriesQuery } from "../../features/api/apiCategoriesSlice"

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataCategories  } = useFindOneCategoriesQuery({ slug: id }, { skip: (id) ? false : true })

  useEffect(() => {
    console.log(dataCategories);
    if(dataCategories?.response?.categori) setData({
      title: dataCategories.response.categori.title,
      desc: dataCategories.response.categori.desc,
      created: new Date(dataCategories.response.categori.createdAt).toString().slice(0,25)
    })
  },[ dataCategories ])


  return (
    <>
      <Modal setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Categories</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className="gap-2 p-4 h-auto"> 
        <div className="flex gap-4">
          <div className="flex items-start">
            <p>{ data?.title }</p>
            <p>{ data?.desc }</p>
          </div>
        </div>  
        
      </div>
      </Modal>
    </>
  )
}

export default Detail