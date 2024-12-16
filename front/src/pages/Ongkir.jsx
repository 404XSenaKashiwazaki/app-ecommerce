import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCalculateShippingCostMutation, useFindAllCityByProvincesQuery, useFindAllProvincesQuery } from '../features/api/apiRajaOngkir'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Ongkir = ({ 
    form, 
    setForm, 
    courier,
    selectedProvince,
    selectedCity,
    setShippingCost, 
    setSelectedCity,
    setSelectedProvince,
    weight,
    setCourierType,
    courierType,
    carts,
    setTotal,
    total,
}) => {
    const { dataUser } = useSelector(state=> state.auth)
    const [provinces, setProvinces] = useState([])
    const [cities, setCities] = useState([])
    const { data } = useFindAllProvincesQuery()
    const { data: dataCity } = useFindAllCityByProvincesQuery({ provId: selectedProvince },{ skip: (selectedProvince) ? false: true })
    const [ calculateShippingCost ] = useCalculateShippingCostMutation()
    const [ email, setEmail ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    
    useEffect(() => {
        if(data?.response?.results) setProvinces(data.response.results) 
    },[data])

    useEffect(() => {
        if(dataCity?.response?.results) {
            setCities(dataCity.response.results)
            if(selectedCity) calculateShipping()
        }
    },[dataCity, selectedCity, courier])

    const  calculateShipping = async () => {
        try {
            const data = {
                destination: parseInt(selectedCity), 
                weight: weight, 
                courier: courier.toLocaleLowerCase()
            }
            const res = await calculateShippingCost({ data }).unwrap()
            const rs = res.response.results.map(e=> {
                const service = (e.code == "pos") ? "Pos Reguler" : "REG"
                return e.costs.filter(e=> e.service == service)
            })[0][0]
            const totalPrice = carts.reduce((a, item) => a + item.total, 0)
            setTotal(totalPrice + rs.cost[0].value)
            setShippingCost(res.response.results)
            setCourierType({ kurir: rs.service, harga: rs.cost[0].value})
        } catch (error) {
            console.log(error)
        }
    }

    const validateEmail = (e) => {
        const emailInput = e.target.value;
        setEmail(emailInput);
    
        // Simple email validation
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailInput)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }

    const handleChangeInput = (e) => {
        e.preventDefault()
        const { name,value } = e.target
        const list = form

        list[name] = value
        setForm({ ...list })
    }


    return (
        <>
        <h2 className="text-xl font-bold mb-6">Detail Pembayaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="mb-2">
                <label className="block text-sm font-medium">Nama</label>
                <input
                type="text"
                readOnly
                value={form.nama}
                className="mt-1 p-1 block w-full bg-slate-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="nama"
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Username</label>
                <input
                type="text"
                readOnly
                value={form.username}
                className="mt-1 p-1 block w-full bg-slate-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Username"
                />
            </div>
        </div>
        <div className="mb-2">
            <label className="block text-sm font-medium">Email</label>
            <input
            type="email"
            readOnly
            className={`mt-1 p-1 block w-full bg-slate-200 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
            value={form.email}
            onChange={validateEmail}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
            <label className="block text-sm font-medium">Negara</label>
            <input
                type="text"
                value={form.negara}
                name="megara"
                required
                onChange={handleChangeInput}
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            </div>
            <div>
            <label className="block text-sm font-medium">Provinsi</label>
            <select
                name="provinsi"
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => {
                    setSelectedProvince(e.target.value)
                    setSelectedCity("")
                    setShippingCost([])
                }}
                value={selectedProvince}
                >
                <option value="">-- Pilih Provinsi --</option>
                {provinces.map((p) => (
                    <option key={p.province_id} value={p.province_id}>
                    {p.province}
                    </option>
                ))}
            </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
            <label className="block text-sm font-medium">Kota</label>
            <select
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
                name="kota"
                >
                <option value="">-- Pilih Kota --</option>
                {cities.map((e) => (
                    <option key={e.city_id} value={e.city_id}>
                    {e.city_name}
                    </option>
                ))}
            </select>
            </div>
            <div>
            <label className="block text-sm font-medium">Kode Pos</label>
            <input
                type="number"
                value={form.kodePos}
                name="kodePos"
                onChange={handleChangeInput}
                className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            </div>
        </div>
        <div className="mb-9">
        <label className="block text-sm font-medium">Alamat</label>
            <textarea 
                value={form.alamat}
                name="alamat"
                onChange={handleChangeInput}
                className="mt-1 p-1 block w-full h-[100px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />  
        </div>

        <div className="mt-6">
            <Link to={`/cart/${dataUser?.username}`} className="text-indigo-600 text-sm font-semibold">  <FontAwesomeIcon icon={faArrowLeft} /> Kembali</Link>
        </div>

        </>

    )
}

export default Ongkir