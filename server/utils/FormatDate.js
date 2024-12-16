export const formatDateTime = (dateString) => {

    const currentDate = new Date(dateString)
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const formattedDateTime = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${hours}:${minutes}:${seconds}`
    
    return formattedDateTime
}