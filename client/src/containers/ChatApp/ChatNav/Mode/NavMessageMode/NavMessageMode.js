import React from 'react';

const NavMessageMode = (props) => {

     return (
         <div>

            <div className='border-b-2 h-16 border-gray-900 text-gray-100 font-bold text-lg px-6 flex items-center justify-between'>

                <h1 className='text-center text-white'>Message</h1>

            </div>

            <div className="p-4">

                <button className='flex items-center mb-4 cursor-pointer w-full ctmFocus hoverMenuProfileBg p-2 rounded-lg'>
                    <div className='w-8 h-8 channelIcon mr-3 rounded-md flex items-center justify-center text-white'></div>
                    <span className='text-gray-300'>Message</span>
                </button>

            </div>

         </div>
     )

}

export default NavMessageMode;