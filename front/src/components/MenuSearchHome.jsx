import { useDebouncedCallback } from "use-debounce"

const MenuSearchHome = ({ setSearch, search }) => {
    const hancleChangeSearch = useDebouncedCallback( e =>{
        setSearch(e.target.value)
    },700, { maxWait: 2000 })

    return(
        <div className="absolute top-4">
            <dialog id="my_modal_2" className="modal modal-middle">
            <div className="modal-box p-3 bg-indigo-950 shadow-2xl">
                <input onChange={hancleChangeSearch} name="search" value={search}  type="text" placeholder="Cari anime..." className="input w-full bg-indigo-950 text-slate-50" />
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
            </dialog>
        </div>
    )
}

export default MenuSearchHome