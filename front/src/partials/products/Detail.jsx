import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faCheckSquare, faImage, faSearch, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFindOneProductsQuery } from "../../features/api/apiProductsSlice"
import { formatRp } from "../../utils/FormatRp"

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataProducts  } = useFindOneProductsQuery({ slug: id }, { skip: (id) ? false : true })

  // useEffect(() => {
  //   if(dataProducts?.response?.products) setData({
  //     kode: dataProducts.response.products.kode_produk,
  //     nama: dataProducts.response.products.nama_produk,
  //     slug:  dataProducts.response.products.slug,
  //     jenis:  dataProducts.response.products.jenis_produk,
  //     jenis:  dataProducts.response.products.jenis_produk,
  //     created: new Date(dataProducts.response.products.createdAt).toString().slice(0,25)
  //   })
  // },[ dataProducts ])

console.log(dataProducts?.response?.products?.ImageProducts.length > 0);

  return (
    <>
      <Modal setId={setId} type="md" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Products</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4 h-auto mb-2"> 
          <div className="w-full sm:w-2/3">
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Kode Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.kode_produk }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Slug Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.slug }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Nama Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.nama_produk }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Merk Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.merk }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Stok Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.stok_produk }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Harga Produk</p></span>:
              <span className="w-full px-2"><p>{ formatRp(dataProducts?.response?.products?.harga_produk) }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Berat Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.berat }gr</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Status Produk</p></span>:
              <span className="w-full px-2"><p>
              {
                (dataProducts?.response?.products?.stok_produk != 0)
                ? (<span className="bg-blue-700 hover:bg-blue-900 p-1 rounded-sm 
                border-0 text-slate-300 
                text-sm block w-auto py-1 px-1
                font-medium text-center
                hover:text-slate-200 "><FontAwesomeIcon icon={faCheckSquare}/> TERSEDIA</span>)
                : (<span className="bg-red-700 hover:bg-red-900 p-1 rounded-sm 
                border-0 text-slate-300 
                text-sm block w-auto py-1 px-2
                font-medium text-center
                hover:text-slate-200 "><FontAwesomeIcon icon={faXmarkSquare}/> TIDAK TERSEDIA</span>)
              }  
              </p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Deskripsi Produk</p></span>:
              <span className="w-full px-2"><p>{ dataProducts?.response?.products?.desk_produk }</p></span>
            </div>
            <div className="flex justify-between  mb-2">
              <span className="w-1/2 font-bold "><p >Created</p></span>:
              <span className="w-full px-2"><p>{  new Date(dataProducts?.response?.products?.createdAt).toString().slice(0,25) }</p></span>
            </div>
            <div className="flex gap-1">
              { data?.Genres.length > 0 && data.Genres.map(e=> {
                return <div className="bg-indigo-950 w-auto px-5 mt-1 py-1 text-slate-200 rounded-sm">{ e.title }</div>
              }) }
            </div>
          </div>
          <div className="w-full  sm:w-1/2">
          { 
            dataProducts?.response?.products?.ImageProducts.length > 0 
            ? (<img src={ dataProducts?.response?.products?.ImageProducts[0].url_image } alt={ dataProducts?.response?.products?.nama_produk } className="w-full object-cover rounded-sm shadow-2xl max-h-80 h-80 "/>) 
            : (<div className="w-full object-cover rounded-sm shadow-2xl max-h-80 h-80"></div>) 
          }
          </div>
        </div>
        <div className=" p-4 h-auto mb-7">
          <div className="mb-5 mt-o relative px-2 pt-4">
            <h1 className="font-bold text-lg mb-0"><span><FontAwesomeIcon icon={faImage}/> Image Products</span></h1>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {
              dataProducts?.response?.products?.ImageProducts.length > 0 && dataProducts?.response?.products?.ImageProducts.map((item,i)=> (
                <img src={ item.url_image } alt={ item.nama_image } key={i} className="w-40 h-40 object-cover rounded-sm shadow-2xl max-h-40 "/>
              ))
            }
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail