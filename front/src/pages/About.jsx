import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faGlobe, faKey, faPlayCircle, faPowerOff, faSave, faSpinner, faTags, faTriangleExclamation, faUser, faUserShield, faVideo } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux"
import { Helmet } from 'react-helmet'

const About = ({ site }) => {
    const sites = useSelector(state=> state.sites)
    return(
        <div className="mx-1 h-auto  box-border mt-10 mb-24">
        <Helmet>
            <title>{ site } - About</title>
        </Helmet>
        {/* card epiosode terbaru */}
        <div className="mx-5 shadow-2xl">
            <div className="flex justify-between mb-3">
                <div className="my-4">
                    <h1 className="text-lg font-bold  mx-4 text-slate-900"><FontAwesomeIcon  icon={faGlobe} /> About</h1>
                </div>
                <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
            </div>
            </div>
            <div className="text-slate-900">
                <div className="mb-4 mx-5">
                    <span className="text-md font-medium text-slate-900">{sites?.site?.title || ""} </span>
                </div>
                <div className="mx-5 mb-4 pb-5">
                    <p className="text-xs font-medium text-slate-900">{ sites?.site?.deskripsi || ""}</p>
                </div>
            </div>
        </div>

    </div>
    )
}

export default About