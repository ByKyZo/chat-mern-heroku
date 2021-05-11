import React from 'react';
import { CgClose } from 'react-icons/cg';
import MediaQuery from 'react-responsive';
import ChatNavContent from './ChatNavContent';

const ChatNav = ({ currentMode , setMode , isOpenBurgerMenu , setIsOpenBurgerMenu}) => {

     return (
         <>
            <MediaQuery minWidth='1024px'>

                <ChatNavContent currentMode={currentMode} setMode={setMode} />
                
            </MediaQuery>
        
            <MediaQuery maxWidth='1023px'>
                <div className={`w-72 lg:flex lg:flex-shrink-0 lg:h-full lg:w-full lg:z-50 lg:transition lg:duration-200 ease lg:absolute transform  ${isOpenBurgerMenu ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}>
            
                    <ChatNavContent currentMode={currentMode} setMode={setMode} />
                    
                    {
                        isOpenBurgerMenu &&

                            <div className='flex justify-center w-2/12 bg-black bg-opacity-30' onClick={() => setIsOpenBurgerMenu(false)}>
                                <button 
                                    className='h-9 w-9 bg-black-1100 z-50 right-10 mt-3 flex items-center justify-center rounded-lg ctmFocus' 
                                    onClick={() => setIsOpenBurgerMenu(false)}>
                                    <CgClose className='text-white' />
                                </button>   
                            </div>       
                    }
                </div>
            </MediaQuery> 
        </>  
     )

}
 
export default ChatNav;