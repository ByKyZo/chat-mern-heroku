import React, { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Popup from '../../components/Utils/Notifications/NotificationItem';

const Authentication = (props) => {

    const [isAlreadyMember , setIsAlreadyMember] = useState(true);
    const [isOpenPopupSuccess, setIsOpenPopupSuccess] = useState(false);


    return (
        <>
            <div className='p-8 rounded-xl flex flex-col items-center justify-center w-96 shadow-2xl border border-gray-700 bg-gray-800'>
                    {

                        isAlreadyMember ?

                            <Login isAlreadyMember={setIsAlreadyMember} />

                            :

                            <Signup isAlreadyMember={setIsAlreadyMember} setIsAlreadyMember={setIsAlreadyMember} setIsOpenPopupSuccess={setIsOpenPopupSuccess} />

                    }
            </div>
        </>
    )

}

export default Authentication;