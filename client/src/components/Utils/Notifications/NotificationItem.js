import React, { useEffect, useRef, useState } from 'react';

const NotificationItem = ({ label, icons, color, isOpen }) => {

    const [numberOfPopup , setNumberOfPopup] = useState(0);



    return (
        <>
            <li
                className={`p-6 border-2 border-${color} text-${color} 
                            bg-gray-100 flex items-center rounded 
                            z-50 transition duration-500 transform ease-in-out translate-y-0 mb-2
                            ${isOpen ? 'translate-y-0' : '-transelate-y-full'}`}
            >

                <div className='text-2xl mr-4'>{icons}</div>

                <span className='font-semibold'>{label}</span>

            </li>
        </>
    )

}

export default NotificationItem;