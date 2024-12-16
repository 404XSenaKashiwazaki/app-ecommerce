import React from 'react'

function Modal_({ type, title, button, showModal,setShowModal ,children, setId, mt}) {
    let size 
    switch (type) {
        case "sm":
            size = `md:w-[500px]`
            break;
        case "md":
            size = `md:w-[700px]`
            break;
        case "lg":
            size = `md:w-[900px]`
            break;
        case "xl":
            size = `md:w-[1000px]`
            break;
        default:
            size = `md:w-[500px]`
            break;
    }

    return (
    <div onClick={(e) => {
        setId(null)
        setShowModal(false)
    }} className={`fixed ${showModal ? `block` : `hidden`} inset-0 bg-slate-900 bg-opacity-60 z-50 transition-opacity duration-500 p-0`}>
        <div onClick={(e) => e.stopPropagation()} className={`bg-white shadow-2xl rounded-sm overflow-hidden p-0 px-2 w-2/2 ${size} mx-5 md:mx-auto ${mt ? mt : `mt-10`}`}>
            <ModalTitle title={title}/>
            {/* max-h-96 */}
                <div className="overflow-y-auto h-full max-h-[50%]"> 
                    { children }
                </div>
            <ModalFooter button={button}/>
        </div>
    </div>
  )
}

export default Modal_

export const ModalTitle = ({title}) => {
    return(
        <div className="mb-5 mt-o relative px-2 pt-4">
            <h1 className="font-bold text-lg mb-0">{ title }</h1>
        </div>
    )
}

export   const ModalFooter = ({button}) => {
    return (
        <div className="flex justify-end gap-2 mt-4 mb-4 mx-4">
            { button }
        </div>
    )
}
