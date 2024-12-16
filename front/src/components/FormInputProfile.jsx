import { faCameraAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useUpdateProfileMutation } from '../features/api/apiProfileSlice'
import { useDispatch } from 'react-redux'
import FormInputProfileModal from './FormInputProfileModal'
import { useParams } from "react-router-dom"
import { setMessage } from '../features/profileSlice'
import { setToken } from '../features/authSlice'
import AlertProfileRemove from './AlertProfileRemove'
import TabProfile from './TabProfile'
import FormInputProfilePassword from './FormInputProfilePassword'
import { useFindAllCityByProvincesQuery } from '../features/api/apiRajaOngkir'

const FormInputProfile = ({ data, provinces, dataUser }) => {
    const [ username, setUsername ] = useState(null)
    const [ selectedProvince, setSelectedProvince ] = useState(dataUser.detailUsers.provinsi)
    const [ selectedCity, setSelectedCity ] = useState(dataUser.detailUsers.kota)
    const [ cities, setCities ] = useState([])
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdateProfileMutation()
    const { data: dataCity } = useFindAllCityByProvincesQuery({ provId: selectedProvince },{ skip: (selectedProvince) ? false: true })
    const dispatch = useDispatch()
    const [ showModal, setShowModal ] = useState(false)
    const [ showModal2, setShowModal2 ] = useState(false)
    const [ input, setInput ] = useState({
        id: "",
        namaDepan: "",
        namaBelakang: "",
        username: "",
        email: "",
        password:"",
        passwordOld: "",
        konfirmasiPassword: "",
        noHp: "",
        alamat: "",
        negara: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kodePos: "",
        profile: "",
        desc: "",
        profileUrl: "",
        profileOld: "",
        error: null
    })

    useEffect(() => {
        if(dataCity?.response?.results) {
            setCities(dataCity.response.results)
        }
    },[dataCity])
    
    useEffect(() => {
        if(data?.response?.profiles) {
            setUsername(data.response.profiles.username)
            setInput({
                username: data.response.profiles.username,
                id: data.response.profiles.id,
                namaDepan: data.response.profiles.namaDepan,
                namaBelakang: data.response.profiles.namaBelakang,
                email: data.response.profiles.email,
                noHp: data.response.profiles?.UsersDetail?.noHp,
                alamat: data.response.profiles?.UsersDetail?.alamat,
                negara: data.response.profiles?.UsersDetail.negara,
                provinsi: data.response.profiles?.UsersDetail.provinsi,
                kota: data.response.profiles?.UsersDetail.kota,
                kecamatan: data.response.profiles?.UsersDetail.kecamatan,
                kodePos: data.response.profiles?.UsersDetail.kodePos,
                desc: data.response.profiles?.UsersDetail?.desc,
                profile: data.response.profiles?.UsersDetail?.profile,
                profileOld: data.response.profiles?.UsersDetail?.profile,
                profileUrl: data.response.profiles?.UsersDetail?.profileUrl,
                profileUrlOld: data.response.profiles?.UsersDetail?.profileUrl,
                password:"",
                passwordOld: "",
                konfirmasiPassword: "",
                error: null
            })
        }
    },[data])

    const handleChange = ({ target }) => {
        const { name,value } = target
        setInput(prev => ({...prev, [name]:value}))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await update({ data: input, username: username }).unwrap()
            dispatch(setToken(res.response))
            setInput({ ...input, error: null })
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
            const msg = []
            if(error?.data?.errors && error?.data?.errors.length != 0) error.data.errors.map((e,i)=> {
                input.error = []
                const name = e.param.match(/([A-Za-z]+)/)[0]
                
                msg.push(e.msg)
                input.error = { [name.toLowerCase()]: [...new Set(msg)] }
            })
            setInput(input)
        }
    }

    const FormProfile = () => <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="namaDepan">Nama Depan*</label>
            <input
                type="text"
                name="namaDepan"
                value={input?.namaDepan}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded"
                placeholder="Nama depan"
                required
            />
        </div>
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="namaBelakang">Nama Belakang*</label>
            <input
                type="text"
                name="namaBelakang"
                value={input?.namaBelakang}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded"
                placeholder="Nama belakang"
                required
            />
        </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email*</label>
            <input
                type="email"
                name="email"
                value={input?.email}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded"
                placeholder="example@gmail.com"
            />
        </div>
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="noHp">Nomor Telp/Wa*</label>
            <input
                type="number"
                name="noHp"
                value={input?.noHp}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded"
                placeholder="08061237890"
            />
        </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="negara">Negara*</label>
            <select
                name="negara"
                value={input?.negara}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded">
                <option value="Indonesia">Indonesia</option>
                {/* Add other countries as needed */}
            </select>
        </div>
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="provinsi">Provinsi*</label>
            <select
                name="provinsi"
                value={input?.provinsi}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded">
                {/* <option value="Jawa_Barat">Jawa Barat</option> */}
                <option value="">-- Pilih Provinsi --</option>
                {provinces.map((p) => (
                    <option key={p.province_id} value={p.province_id}>
                    {p.province}
                    </option>
                ))}
                {/* Add other countries as needed */}
            </select>
        </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="kota">Kota*</label>
            <select
                name="kota"
                value={input?.kota}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded">
                {/* <option value="Majalengka">Majalengka</option> */}
                <option value="">-- Pilih Kota --</option>
                {cities.map((e) => (
                    <option key={e.city_id} value={e.city_id}>
                    {e.city_name}
                    </option>
                ))}
                {/* Add other countries as needed */}
            </select>
        </div>
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="kecamatan">Kecamatan*</label>
            <select
                name="kecamatan"
                value={input?.kecamatan}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded">
                <option value="Maja">Maja</option>
                {/* Add other countries as needed */}
            </select>
        </div>
        <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="kodePos">Kode Pos*</label>
            <input
                type="text"
                name="kodePos"
                value={input?.kodePos}
                onChange={handleChange}
                className="mt-1 p-1 block w-full border border-gray-300 rounded"
                placeholder="Kode Pos"
                required
            />
        </div>
    </div>
    <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700" htmlFor="alamat">Alamat*</label>
        <textarea 
            value={input?.alamat}
            onChange={handleChange}
            name="alamat" 
            id="alamat" 
            className="mt-1 p-2 min-h-[100px] block w-full border border-gray-300 rounded"
            placeholder="Alamat">
        </textarea>
    </div>
    <button
        type="submit"
        className="mt-4 w-auto px-4 py-1 bg-indigo-700 text-white  rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
        Simpan
    </button>
</form>

    return (
        <div className="mb-10">
            { showModal && <FormInputProfileModal username={username} setInput={setInput} input={input} setShowModal={setShowModal} showModal={showModal} /> }
            { showModal2 && <AlertProfileRemove username={username} setInput={setInput} input={input} setShowModal={setShowModal2} showModal={showModal2} /> }
            <div className="flex items-center justify-between  mb-6">
                <div className="w-1/3 flex h-1/3 p-2 items-center relative ">
                    <img
                        className="w-full h-full rounded-full object-cover border-slate-200 border-2"
                        src={input?.profileUrl}
                        alt={input.username }
                    />
                    <div
                        onClick={() => setShowModal(true)}
                        className="border-slate-200 border-2 rounded-full p-1 absolute right-5 md:right-3  lg:right-30 md:bottom-3 bg-slate-100 bottom-5">
                        <FontAwesomeIcon size="2x"  icon={faCameraAlt} />
                    </div>
                </div>
                <div className="w-full flex items-center gap-1 mx-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="ml-4 px-4 bg-indigo-700 text-white py-1 rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                        Ganti Foto
                    </button>
                    <button 
                        onClick={() => setShowModal2(true)}
                        disabled={input.profile == "default.jpg" ? true : false }
                        className={`px-4 text-red-500 bg-slate-200  py-1 rounded-sm font-bold text-sm hover:bg-slate-600 transition ${ input.profile == "default.jpg" && `cursor-not-allowed` }`}>Hapus</button>
                </div>
            </div>
            <TabProfile profile={<FormProfile />} password={<FormInputProfilePassword data={data}/>}/>
            
        </div>
    )
}

export default FormInputProfile