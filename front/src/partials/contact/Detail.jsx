import React, { useEffect, useState } from 'react'
import { useFindOneContact_Query } from '../../features/api/apiContactSlice'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faUserAltSlash, faUserCheck, faUserCog } from "@fortawesome/free-solid-svg-icons"
import Modal_ from "../../components/Modal_"

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataContacts } = useFindOneContact_Query({ id },{ skip: (id) ? false : true })

  useEffect(() => {
    console.log(dataContacts);
    if(dataContacts?.response?.contacts) setData({
      username: dataContacts.response.contacts.username,
      fullname: dataContacts.response.contacts?.user.fullname,
      email: dataContacts.response.contacts.email,
      profileUrl: dataContacts.response.contacts?.user?.UsersDetail.profileUrl,
      content: dataContacts.response.contacts.content,
      alamat: dataContacts.response.contacts?.user?.UsersDetail.alamat,
      noHp: dataContacts.response.contacts?.user?.UsersDetail.noHp,
      created: new Date(dataContacts.response.contacts.createdAt).toString().slice(3,25),
    })
  },[ dataContacts ])

  return (
    <>
    <Modal_ setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Contacts</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
    <div className="p-4 h-auto mb-7"> 
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
      <div className="w-full sm:w-2/3">
        <div className="flex justify-between items-center mb-2">
          <span className="w-1/2 font-bold"><p >Username</p></span>:
          <span className="w-full px-2"><p>{ data?.username }</p></span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="w-1/2 font-bold"><p >Email</p></span>:
          <span className="w-full px-2"><p>{ data?.email }</p></span>
        </div>  
        <div className="flex justify-between items-center mb-2">
          <span className="w-1/2 font-bold"><p >No Hp</p></span>:
          <span className="w-full px-2"><p>{ data?.noHp }</p></span>
        </div>  
        <div className="flex justify-between items-center mb-2">
          <span className="w-1/2 font-bold"><p >Alamat</p></span>:
          <span className="w-full px-2"><p>{ data?.alamat }</p></span>
        </div>  
        <div className="flex justify-between items-center mb-2">
          <span className="w-1/2 font-bold"><p >Content</p></span>:
          <span className="w-full px-2 "><p className="border p-1 bg-slate-50">{ data?.content }</p></span>
        </div>       
      </div>
      <div className="w-full  sm:w-1/2">
        <img src={ data?.profileUrl } alt={ data?.fullname } className="w-full object-cover rounded-sm shadow-2xl max-h-80 h-80 "/>
      </div>
      </div>
    </div>
    </Modal_>
    </>
  )
}

export default Detail