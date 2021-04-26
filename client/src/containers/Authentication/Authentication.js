import React, { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';

const Authentication = (props) => {

    const [isAlreadyMember , setIsAlreadyMember] = useState(true);

    return (
        <div className='p-8 rounded-xl flex flex-col items-center justify-center w-96 shadow-2xl border border-gray-700 bg-gray-800'>
                {

                    isAlreadyMember ?

                        <Login isAlreadyMember={setIsAlreadyMember} />

                        :

                        <Signup isAlreadyMember={setIsAlreadyMember} />

                }
        </div>
    )

}

export default Authentication;