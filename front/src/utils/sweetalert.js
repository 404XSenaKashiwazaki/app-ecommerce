import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export default Swal
export const mySwal = withReactContent(Swal)
export const Toast = mySwal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: t => {
        t.onmouseenter = mySwal.stopTimer
        t.onmouseleave = mySwal.resumeTimer
    }
})