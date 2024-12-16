export const CreateResponse = (res,{ status , message, response }) => {
    return res.status(status || 500).json({ status: (status) ? "Success" : "Error", message, response })
}