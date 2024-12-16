import React, { useEffect, useState } from 'react'
import { useUpdatePasswordMutation } from '../features/api/apiProfileSlice'
import { useDispatch } from 'react-redux'
import { setMessage } from '../features/profileSlice'

const FormInputProfilePassword = ({ data }) => {
    const dispatch = useDispatch()
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdatePasswordMutation()
    const [ username, setUsername ] = useState(null)
    const [ form, setForm ] = useState({
        password: "",
        passwordOld: "",
        konfirmasiPassword: "",
        error: null
    })

    useEffect(() => {
        if(data?.response?.profiles) {
            setUsername(data.response.profiles.username)
            setForm(pre => ({...pre, id: data.response.profiles.id, username: data.response.profiles.username}))
        }
    },[ data ])


    const handleChange = ({ target }) => {
        const { name,value } = target
        console.log(name);
        
        setForm(prev => ({...prev, [name]:value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log({ form });
            
            const res = await update({ data: form, username: username }).unwrap()
            setForm({ password: "", passwordOld: "", konfirmasiPassword: "", error: null  })
            dispatch(setMessage(res.message))
        } catch (error) {
            console.log(error);
            const msg = []
            setForm(form)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="mb-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="passwordOld">Password Lama*</label>
                        <input
                            type="password"
                            name="passwordOld"
                            value={form.passwordOld}
                            onChange={handleChange}
                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                            placeholder="******"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="mb-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password Baru*</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                            placeholder="******"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="mb-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="konfirmasiPassword">Konfirmasi Password*</label>
                        <input
                            type="password"
                            name="konfirmasiPassword"
                            value={form.konfirmasiPassword}
                            onChange={handleChange}
                            className="w-full text-slate-900 my-1 p-1 text-sm focus:outline-none focus:ring focus:ring-purple-500 rounded-sm border"
                            placeholder="******"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-auto px-4 py-1 bg-indigo-700 text-white  rounded-sm font-bold text-sm hover:bg-indigo-600 transition">
                    Simpan
                </button>
            </form>
        </div>
    )
}

export default FormInputProfilePassword