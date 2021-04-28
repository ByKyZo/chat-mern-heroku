import React from 'react';

const Button = ({ children , bg , txt , click , className }) => {

     return (
        <button 
            className={`px-5 py-2 ${bg} ${txt} ${className} m-2 ctmFocus transition duration-200 hover:bg-opacity-70 rounded`}
            onClick={click}
            >{children}
        </button>
     )

}

export default Button;