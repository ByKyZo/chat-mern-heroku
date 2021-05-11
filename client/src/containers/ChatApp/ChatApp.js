import React, { useContext, useEffect, useState } from 'react';
import ChatNav from './ChatNav/ChatNav';
import ChannelMode from './ChannelMode/ChannelMode';
import MessageMode from './MessageMode/MessageMode';
import { UserContext } from '../../context/UserContext';
import { BiWinkSmile } from 'react-icons/bi';

const ChatApp = (props) => {

    const [mode , setMode] = useState('channel');
    const [selectedChannel , setSelectedChannel] = useState('');
    const [isOpenBurgerMenu , setIsOpenBurgerMenu] = useState(false);
    const { user , setUser } = useContext(UserContext);

    const returnCurrentMode = () => {
        switch(mode){
            case 'channel' : 
                return <ChannelMode 
                            setIsOpenBurgerMenu={setIsOpenBurgerMenu} 
                            currentChannel={selectedChannel}
                        />
            case 'message' : 
                return <MessageMode />
            default : 
                return <ChannelMode 
                            setIsOpenBurgerMenu={setIsOpenBurgerMenu} 
                            currentChannel={selectedChannel}
                        />
        }
    }

    useEffect(() => {
        setUser(oldUser => {
            oldUser.notifications.push({
              icons : <BiWinkSmile />,
              color : 'blue-500',
              label : `Welcome ${oldUser.pseudo}`
            })
            return {...oldUser}
        })
    },[])

     return (
         <>
            <div className='w-full h-full bg-black-700 shadow-2xl flex overflow-hidden relative'>
                
                <ChatNav 
                    isOpenBurgerMenu={isOpenBurgerMenu} 
                    setIsOpenBurgerMenu={setIsOpenBurgerMenu} 
                    currentMode={mode} 
                    setMode={setMode} 
                />

                { returnCurrentMode() }

            </div>
         </>
     )

}

export default ChatApp;