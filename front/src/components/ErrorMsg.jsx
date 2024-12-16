const ErrorMsg = ({ message }) => {
    // console.log({ message });
    if(message && typeof message == "object"){
        return (message) && message.map((msg, key)=> <div key={key} className="flex items-center relative">
            <div  className="bg-red-800 text-slate-200 my-1 p-1 text-sm font-medium w-full">{msg} !</div>
        </div>)
    } else if(message && typeof message == "string"){
        return <div  className="flex items-center relative">
            <div  className="bg-red-800 text-slate-200 my-1 p-1 text-sm  font-medium w-full">{message} !</div>
        </div>
    }
    return <></>
   
}

export default ErrorMsg