export const typeBtn = (type) => {
    let colors = ""
    const types = type?.toLowerCase()
    switch (types) {
    case "disiapkan":
        colors += "bg-yellow-500 hover:bg-yellow-600"
        break
    case "dikemas":
        colors += "bg-blue-700 hover:bg-blue-800"
        break
    case "dikirim":
        colors += "bg-cyan-500 hover:bg-cyan-600"
        break
    case "selesai":
        colors += "bg-green-700 hover:bg-green-800"
        break
    case "settlement": 
        colors += "bg-green-700 hover:bg-green-800"
        break
    case "pending":
        colors += "bg-yellow-500 hover:bg-yellow-600"
        break
    default:
        colors += "bg-red-700 hover:bg-red-800" 
        break
    }
    return colors
}

export const typeStatusPayments = (type) => { 
    let colors = ""
    const types = type?.toLowerCase()
    switch (types) {
    case "pending":
        colors += "bg-yellow-500 hover:bg-yellow-600"
        break
    case "dikemas":
        colors += "bg-blue-700 hover:bg-blue-800"
        break
    case "dikirim":
        colors += "bg-cyan-500 hover:bg-cyan-600"
        break
    case "paid":
        colors += "bg-green-700 hover:bg-green-800"
        break
    case "settlement": 
        colors += "bg-green-700 hover:bg-green-800"
        break
    default:
        colors += "bg-red-700 hover:bg-red-800" 
        break
    }
    return colors
}