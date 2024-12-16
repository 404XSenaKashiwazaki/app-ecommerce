import ErrorMsg from "./ErrorMsg"

const FormInputFile = ({index=0, value, type, name,label,classNameParent,className,placeholder,message,handleChange }) => {
    return (
      <>
      <div className={classNameParent}>
        <label htmlFor={name}>{label}</label>
        <input 
          onChange={(e)=> handleChaneInputFile(e,i)}
          type={ty} 
          name='image' id='image' 
          className='border-0 w-full'  />
          <input 
            onChange={(el)=>handleChange(el,index)}
            type={type}
            value={value}
            name={name}
            id={name}
            className={className}  
            placeholder={placeholder}/>
            <ErrorMsg message={message}
          />
        </div>
      </>
    )
}

export default FormInputFile