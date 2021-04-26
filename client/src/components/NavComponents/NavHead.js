import React from 'react';

const NavHead = (props) => {

     return (
        <div className={`shadow-lg h-16 flex-shrink-0 text-gray-100 font-bold text-lg px-6 flex items-center ${props.className}`}>
         
            <span>{props.title}</span>

            {props.children}

        </div>
     )

}

export default NavHead;