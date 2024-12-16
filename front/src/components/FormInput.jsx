import ErrorMsg from "./ErrorMsg"

const FormInput = ({index=0, index2=null, value, type, name,label,classNameParent, readOnly,className,placeholder,message,handleChange }) => {
    return (
      <>
      <div className={classNameParent}>
        <label htmlFor={name}>{label}</label>
          <input 
            onChange={(el)=>handleChange(el,index,index2)}
            type={type}
            value={value}
            name={name}
            id={name}
            readOnly={readOnly}
            className={className}  
            placeholder={placeholder} 
          />
          <ErrorMsg message={message} />
        </div>
      </>
    )
}

export default FormInput