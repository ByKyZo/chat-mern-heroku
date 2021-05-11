import React, { useRef , useEffect } from 'react';

const Dropdown = ({ children , isOpen , setIsOpen , left , top , right , bottom }) => {

    const DropdownRef = useRef();

    useEffect(() => {
        const isOpenCopy = isOpen;
        const focusModal = (e) => {
            if (!DropdownRef.current) return;
            if (!DropdownRef.current.contains(e.target) && isOpenCopy) {
                setIsOpen(false)  
            } 
        }

        window.addEventListener('mousedown',focusModal)
        return () => {
            window.removeEventListener('mousedown',focusModal)
        }
    },[isOpen])

     return (
        <div ref={DropdownRef}
            style={{left : left || 'unset', top : top || 'unset',  right : right || 'unset' , bottom : bottom || 'unset' }}
            className={`w-48 bg-black-700 absolute rounded-xl p-3 transition duration-200 opacity-0 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <ul className='flex flex-col justify-evenly h-full text-left text-white'>

                {children}

            </ul>
        </div>
     )

}

export default Dropdown;