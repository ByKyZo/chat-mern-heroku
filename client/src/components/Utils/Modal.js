import React, { useRef , useEffect } from 'react';

const Popup = ({ children , isOpen , setIsOpen , text }) => {

    const popupRef = useRef();

    useEffect(() => {
        const isOpenCopy = isOpen;
        const focusModal = (e) => {
            if (!popupRef.current) return;
            if (!popupRef.current.contains(e.target) && isOpenCopy) {
                setIsOpen(false)  
            } 
        }

        window.addEventListener('mousedown',focusModal)
        return () => {
            window.removeEventListener('mousedown',focusModal)
        }
    },[isOpen])

    return (
        <div className={`absolute w-full h-full bg-black bg-opacity-50 transition z-50 duration-200 transform ${isOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'} flex items-center justify-center`}>

            <div ref={popupRef} className={`text-white bg-black-1100 h-auto w-auto p-6 rounded-xl transition delay-75 duration-200 ease transform ${isOpen ? 'scale-100 opacity-100' : 'opacity-0 scale-0'}`}>

                {text && <p className='w-40 mb-4 text-center m-auto text-lg italic'>{text}</p>} 

                {children}

            </div>

        </div>
    )

}

export default Popup;