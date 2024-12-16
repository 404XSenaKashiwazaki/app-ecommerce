import { useState } from "react"
import { useFindOneUsersQuery } from "../../features/api/apiUserSlice"
import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faUserAltSlash, faUserCheck, faUserCog } from "@fortawesome/free-solid-svg-icons"
import Modal_ from "../../components/Modal_"

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const { data } = useFindOneUsersQuery({ id },{ skip: (id) ? false : true }) 
  const [ user, setUser ] = useState()

  useEffect(() => {
    if(data?.response?.users) setUser({
      fullname: `${data.response.users.namaDepan} ${data.response.users.namaBelakang}`,
      username: data.response.users.username,
      email: data.response.users.email,
      noHp: data.response.users?.UsersDetail?.noHp,
      alamat: data.response.users?.UsersDetail?.alamat,
      desc: data.response.users?.UsersDetail?.desc,
      role: data.response.users?.Roles?.map(e=> e.name),
      isActive: data.response.users.isActive,
      profile : data.response.users?.UsersDetail?.profile,
      profileUrl: data.response.users?.UsersDetail?.profileUrl,
      created: new Date(data.response.users.createdAt).toString().slice(3,25)
    })
},[ data?.response?.users ])

console.log(user);

  return (
    <>
    <Modal_ setId={setId} type="md" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Users</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4 h-auto mb-7"> 
        <div className="w-full sm:w-2/3">
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Fulname</p></span>:
            <span className="w-full px-2"><p>{ user?.fullname }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Email</p></span>:
            <span className="w-full px-2"><p>{ user?.email }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Username</p></span>:
            <span className="w-full px-2"><p>{ user?.fullname }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Status</p></span>:
            <span className="w-full px-2"><p>                          
              {
                (user?.isActive == 1)
                ? (<span className="bg-blue-700 hover:bg-blue-900 p-1 rounded-sm 
                border-0 text-slate-300 
                text-sm block w-36 py-1 px-1
                font-medium text-start
                hover:text-slate-200 "><FontAwesomeIcon icon={faUserCheck}/> AKTIF</span>)
                : (<span className="bg-red-700 hover:bg-red-900 p-1 rounded-sm 
                border-0 text-slate-300 
                text-sm block w-36 py-1 px-2
                font-medium text-start 
                hover:text-slate-200 "><FontAwesomeIcon icon={faUserAltSlash}/> NONAKTIF</span>)
              }
            </p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Role</p></span>:
            <span className="w-full px-2"><p className="flex flex-col gap-1 items-baseline">
              {
                user?.role.map((item,key) => {
                  return <span key={key} className="bg-sky-700 hover:bg-sky-900 p-1 rounded-sm 
                  border-0 text-slate-300 
                  text-sm block w-36 py-1 px-1
                  font-medium text-start 
                  hover:text-slate-200 "><FontAwesomeIcon icon={faUserCog}/> { item }</span>
                })
              }
            </p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >No Hp</p></span>:
            <span className="w-full px-2"><p>{ user?.noHp }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Deskripsi</p></span>:
            <span className="w-full px-2"><p>{ user?.desc }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Alamat</p></span>:
            <span className="w-full px-2"><p>{ user?.alamat }</p></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="w-1/2 font-bold"><p >Created </p></span>:
            <span className="w-full px-2"><p>{ user?.created }</p></span>
          </div>
        </div>
        <div className="w-full  sm:w-1/2">
          <img src={ user?.profileUrl } alt={ user?.fullname } className="w-full object-cover rounded-sm shadow-2xl max-h-80 h-80 "/>
        </div>
      </div>
    </Modal_>
    </>
  )
}

export default Detail