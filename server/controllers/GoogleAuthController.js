import { CreateResponse } from "../utils/CreateResponse.js"
import { 
    callback as callbackService,
} from "../service/GoogleAuthService.js"


export const callback = async (req,res,next) => {
    try {
        const {  response } = await callbackService(req,res)
        res.redirect(response.url)
    } catch (error) {
        next(error)
    }
}