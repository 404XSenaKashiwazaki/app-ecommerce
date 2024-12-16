import { 
    sendEmails as sendEmailService 
} from "../../service/backend/SendEmailService.js"
import { CreateResponse } from "../../utils/CreateResponse.js"

export const sendEmails = async (req,res,next) => {
    try {
        const response = await sendEmailService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}
