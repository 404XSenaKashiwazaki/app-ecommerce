
import Select from "react-select"
import ErrorMsg from "./ErrorMsg"
import { useRef } from "react";

const FormSelect = ({ index=0,index2=null,label, name,classNameParent,className,placeholder, message,handleChange, options, defaultValue, classNamePrefix,type,isSearchable,isMulti}) => {
  const formRef = useRef(null);
  return (
      <>
      <div className={classNameParent}>
        <label htmlFor={name}>{label}</label>
        <Select   
          id={name}
          options={options}
          defaultValue={defaultValue}
          onChange={(e)=>handleChange(e,index,name,type,index2)}
          placeholder={placeholder}
          isSearchable={isSearchable}
          className={className}
          classNamePrefix={classNamePrefix}
          isMulti={isMulti}
        />
        
        <ErrorMsg message={message}/>
        </div>
      </>
    )
}

export default FormSelect