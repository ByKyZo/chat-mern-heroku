import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { UserContext } from '../../../context/UserContext';
import { API_URL } from '../../../config';
import axios from 'axios';
import './customtailwind.css';
import { SocketContext } from '../../../context/SocketContext';
import Message from './Message/Message';
import DayDivider from './Message/DayDivider';
import MediaQuery from 'react-responsive';

const Channel = ({ setIsOpenBurgerMenu }) => {

    const { user } = useContext(UserContext);
    const [channelMessage , setChannelMessage] = useState([]);
    const messageRef = useRef();
    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.on('sendMessage', (message) => {
            if (channelMessage.findIndex(mess => mess._id !== message._id) !== -1) return;
            setChannelMessage(old => [...old, message])
        })
        // VOIR POUR LE DEMONTER
    },[])

    useEffect(() => {
        axios.get(`${API_URL}channel/message/${user.currentChannel._id}`) // pas besoin de l'id modifier le back-end
        .then(res => {
            // console.log(res.data)
            setChannelMessage(res.data)
        })
    },[])

    const returnMessagesWithDayDivider = () => {   
        const channelMessageCopy = [];
        const day   = channelMessage.filter(message => message.channelID === user.currentChannel._id).map(message => message.date.slice(0,2))
        const month = channelMessage.filter(message => message.channelID === user.currentChannel._id).map(message => message.date.slice(3,5))
        const years = channelMessage.filter(message => message.channelID === user.currentChannel._id).map(message => message.date.slice(6,10))
        let currentDay = day[0];
        let currentMonth = month[0];
        let currentYears = years[0];
        channelMessage.filter(message => message.channelID === user.currentChannel._id).forEach((message, index) => {
            const messageDay = message.date.slice(0,2)
            const messageMonth = message.date.slice(3,5)
            const messageYears = message.date.slice(6,10)
            if (messageDay !== currentDay || messageMonth !== currentMonth || messageYears !== currentYears) {
                channelMessageCopy.push(<DayDivider key={index} date={message.date} />)
                currentDay = day[index];
                currentMonth = month[index];
                currentYears = years[index];
            }
            channelMessageCopy.push(<Message key={message._id} {...message} />)   
        })
        return channelMessageCopy;
    }

    // returnMessages()
    const sendMessage = () => {
        const message = messageRef.current.innerText
        if (!message) return;

        const messageInformations = {
            userID : user.id,
            channelID : user.currentChannel._id,
            message : message
        }
        messageRef.current.innerText = '';
        socket.emit('sendMessage',messageInformations);
        socket.emit('channelNotification',user.currentChannel._id)
    }   

    const pressEnterForSendMessage = (e) => {
        
        if (e.keyCode !== 13) return;
        e.preventDefault();
        sendMessage()
    }
    const clickSendForMessage = () => {
        sendMessage()
    }

     return (
         <div className='flex flex-col h-full w-full justify-between'>
            <div className='h-16 shadow-lg text-gray-100 font-bold text-lg px-11 lg:px-8 flex items-center uppercase flex-shrink-0'>
                <MediaQuery maxWidth='1023px'>

                    <button className='mr-6 ctmFocus p-2' onClick={() => setIsOpenBurgerMenu(true)}>
                        <GiHamburgerMenu />
                    </button>

                </MediaQuery>
                <h1>{Object.entries(user.currentChannel).length !== 0 ? user.currentChannel.name : 'Select channel'}</h1>

            </div>
                {
                    Object.entries(user.currentChannel).length !== 0 ? 
                    <>
                        <div className='overflow-y-scroll h-full scrollbar flex flex-col-reverse'>
                            <ul className='px-11 pt-6 lg:px-8 break-all mt-auto'>
                            {
                                returnMessagesWithDayDivider()
                            }
                            </ul>
                        </div>

                        <div className='min-h-10 max-w-full mx-11 lg:mx-8 flex relative rounded-md overflow-hidden my-7 flex-shrink-0'>
                                    <div 
                                        contentEditable='true'
                                        ref={messageRef}
                                        onKeyDown={(e) => pressEnterForSendMessage(e)}
                                        className='h-full w-full inputSearch ctmFocus p-2 pr-10 break-all text-gray-300' 
                                        >
                                    </div>
                                <button 
                                    onClick={() => clickSendForMessage()}
                                    className={`absolute right-1 inset-y-1 ctmFocus m-auto bg-blue-500  text-white h-8 w-8 flex items-center justify-center rounded-md cursor-pointer`}>
                                    <IoSend />
                                </button>
                        </div>
                    </>

                    :

                    <div className="flex items-center justify-center flex-col h-full">
                        <h3 className='text-4xl'>Welcome !</h3>
                        <p>Please select channel</p>
                    </div>
                }

         </div>
     )

}

export default Channel;