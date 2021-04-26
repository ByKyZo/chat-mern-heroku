import React, { useState } from 'react';
import ChatNav from './ChatNav/ChatNav';
import ChannelMode from './ChannelMode/ChannelMode';
import MessageMode from './MessageMode/MessageMode';

const ChatApp = (props) => {

    const [mode , setMode] = useState('channel');
    const [selectedChannel , setSelectedChannel] = useState('');

    const returnCurrentMode = () => {
        switch(mode){
            case 'channel' : 
                return <ChannelMode currentChannel={selectedChannel}/>
            case 'message' : 
                return <MessageMode />
            default : 
                return <ChannelMode currentChannel={selectedChannel}/>
        }
    }

     return (
         <div className='w-full h-full bg-black-700 rounded-lg shadow-2xl flex overflow-hidden relative'>

            <ChatNav currentMode={mode} setMode={setMode} currentChannel={selectedChannel} selectChannel={setSelectedChannel}/>

            { returnCurrentMode() }

         </div>
     )

}

export default ChatApp;