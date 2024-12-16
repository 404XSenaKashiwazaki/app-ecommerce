import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Loading = ({ isLoading }) => {
    return (
        <div className="flex justify-center mt-5 mb-5 ">
             <div className="absolute text-slate-700">
             { isLoading && <span><FontAwesomeIcon size="2x" icon={faSpinner} /></span> }
             </div>
        </div>
    )
}

export default Loading