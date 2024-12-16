import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Users2 = () => {

    const handleKlikHapusBanyak = () => {

    }

    const handleClickRestoreMultipel = () => {

    }

    return (
    <div>
        <header className="px-5 py-4 border-b border-slate-100 ">
            <div className="flex justify-between">
            <h2 className="font-semibold text-slate-800  flex-initial">title</h2>
            <div className="flex justify-end items-center gap-2  w-auto">
            {/* { (idDelete.length > 0 && headerOptions.isRestore == false) && (
            <NavLink to={headerOptions.toUpdate}>
            <button className=" bg-indigo-800 p-1 rounded-sm 
            border-0 text-slate-300  w-auto
            h-auto text-sm px-3
            font-medium text-center hover:bg-indigo-900
            hover:text-slate-200 "><FontAwesomeIcon  icon={faEdit} /> Edit Banyak</button>
            </NavLink>
            )} */}
            <button 
            onClick={handleKlikHapusBanyak}
            className='
            bg-red-800 p-1 rounded-sm 
            border-0 text-slate-300 
            h-auto text-sm  w-auto px-3
            font-medium text-center hover:bg-red-900
            hover:text-slate-200'
            ><FontAwesomeIcon  icon={faTrashAlt} /> Hapus Banyak</button>
            { false && (
                <button 
                onClick={handleClickRestoreMultipel}
                className='
                bg-sky-800 p-1 rounded-sm 
                border-0 text-slate-300 
                h-auto text-sm  w-auto px-3
                font-medium text-center hover:bg-sky-900
                hover:text-slate-200'
                ><FontAwesomeIcon  icon={faUndoAlt} /> Restore Banyak</button>
            ) }
            
            { !["contact","comment"].includes(path.split("/")[2]) && (
                <>
                  {   type == "modal"
            ?   (<button  
                    onClick={handleClickBtnAdd}
                    className='
                    bg-blue-800 p-1 rounded-sm 
                    border-0 text-slate-300 
                    h-auto text-sm w-auto px-3
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200'
                    ><FontAwesomeIcon  icon={faAdd} /> Tambah
                </button>) 
            :   (
                <NavLink 
                    to={headerOptions.to} 
                    className='
                    bg-blue-800 p-1 rounded-sm 
                    border-0 text-slate-300 
                    h-auto text-sm w-auto px-3
                    font-medium text-center hover:bg-blue-900
                    hover:text-slate-200'
                    ><FontAwesomeIcon  icon={faAdd} />
                    Tambah
                </NavLink>
                )}
                </>
            ) }
            
            </div>
            </div>
            
            <div className="flex justify-end mt-4 px-1">
            <div className="flex justify-between gap-1">
            <div className="flex justify-between gap-1">
                <label htmlFor="filRestore" className="w-auto px-1 py-1 font-medium "><FontAwesomeIcon size='2x' icon={faRecycle} /></label>
                <input type="checkbox" 
                    // disabled={disabled} 
                    checked={headerOptions.isRestore ? true : false} 
                    onChange={handleChangeRestore} className="mx-auto my-auto " name="filRestore" id="filRestore" 
                />
            </div>
            <Select 
                options={headerOptions.selectPerpage}
                // isDisabled={headerOptions.datas.length == 0 ? true : false}
                defaultValue={headerOptions.selectPerpage.filter(el=> el.value == headerOptions.perPage)}
                name="perpage" 
                id="perpage" 
                className="max-h-[20px] w-40 rounded-sm h-full text-sm py-0 px-0 m-0"
                onChange={handlePerpage}
                placeholder="Select perpage"
            />
           
            <div>
                <input type="text" 
                value={headerOptions.search}
                    // disabled={ disabled } 
                    onChange={hancleChangeInptCari} placeholder="Cari data..." 
                    className="max-w-[200px] w-full h-[38px] p-1 rounded-sm" 
                />
            </div>
            </div>
            </div>
            </header>
    </div>
  )
}

export default Users2