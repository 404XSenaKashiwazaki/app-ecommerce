import React, { useEffect, useState } from 'react'
import { useFindOneComment_Query } from '../../features/api/apiCommentSlice'
import Modal_ from '../../components/Modal_'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataComments } = useFindOneComment_Query({ id },{ skip: (id) ? false : true })

  useEffect(() => {
    console.log(dataComments);
    if(dataComments?.response?.comments) setData({
      username: dataComments.response.comments.username,
      fullname: dataComments.response.comments?.user.fullname,
      email: dataComments.response.comments.email,
      profileUrl: dataComments.response.comments?.user?.UsersDetail.profileUrl,
      content: dataComments.response.comments.content,
      alamat: dataComments.response.comments?.user?.UsersDetail.alamat,
      noHp: dataComments.response.comments?.user?.UsersDetail.noHp,
      series: dataComments.response.comments?.Series,
      seriesSlug: dataComments.response.comments?.Series.slug,
      seriesTitle: dataComments.response.comments?.Series.title,
      created: new Date(dataComments.response.comments.createdAt).toString().slice(3,25),
    })
  },[ dataComments ])

  return (
    <>
     <Modal_ setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Comments</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
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
      <div className="mt-5">
        <h1 className="font-bold">Lokasi Comments</h1>
        <h5 className="font-medium"><a href={`/series/${data?.seriesSlug}`}>{ data?.seriesTitle}</a></h5>
      </div>
    </div>
    </Modal_>
    </>
  )
}

export default Detail