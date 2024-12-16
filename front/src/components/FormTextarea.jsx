import ErrorMsg from "./ErrorMsg"

const FormInputTextarea = ({index=0,index2=null, value, cols="10",row="6", name,label,classNameParent,readOnly,className,placeholder,message,handleChange }) => {
  return (
      <>
      <div className={classNameParent}>
        <label htmlFor={name}>{label}</label>
          <textarea 
            onChange={(el)=> handleChange(el,index,index2)}
            className={className} 
            value={ value }
            name={name} 
            readOnly={readOnly}
            id={name}
            placeholder={placeholder}
            cols={cols} rows={row}>
          </textarea>
          <ErrorMsg message={message} />
        </div>
      </>
    )
}

export default FormInputTextarea