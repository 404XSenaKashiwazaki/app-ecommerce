
export const handleUpload = (req,res,next) => {
    const title = req.body.title.split(" ").map(e => e.toUpperCase()).join(" ")
    const logo = (req.files && req.files.length > 0) ? req.files[0].filename : (req.method == "PUT") ? req.body.fileOld : "default.jpg" 
    const logo_url = (req.files && req.files.length > 0) ? `${req.protocol}://${req.hostname}:8000/sites/${req.files[0].filename}` : (req.method == "PUT") ? req.body.logoPreviewOld : "http://localhost:8000/sites/default.jpg"
    
    req.body.logo = logo
    req.body.logo_url = logo_url
    req.body.title = title

    next()
}