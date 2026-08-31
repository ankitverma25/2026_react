import React, { useRef } from 'react'

function FocusDemo() {

    const inputRef =useRef(null)
    const handleSubmit=(e)=>{
        console.log(inputRef.current)
        inputRef.current.focus()
    }

    return (
    <div>
        FocusDemo
        <input ref={inputRef} type="text" />
        <button onClick={handleSubmit}>focus</button>



    </div>
  )
}

export default FocusDemo