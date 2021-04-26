import React, { useContext, useEffect, useState } from 'react';
import NavHead from '../../../../../../components/NavComponents/NavHead';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { API_URL , SOCKET_URL } from '../../../../../../config';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from '../../../../../../context/UserContext';
import { ImExit } from 'react-icons/im';
import { RiEdit2Fill , RiUser3Fill , RiVipCrownFill } from 'react-icons/ri';
import { IoBan } from 'react-icons/io5';
// BOUTON POUR QUITTER LE CHANNEL 
// BOUTON POUR SUPPRIMER LE CHANNEL SI ADMIN DU CHANNEL ?
// BOUTON POUR MODIFIER LE CHANNEL SI ADMIN DU CHANNEL ?
const socket = io(SOCKET_URL);

const CurrentChannel = ({ currentChannel , selectChannel }) => {

    const [members , setMembers] = useState([]);
    const { user } = useContext(UserContext);

    const handleLeaveChannel = () => {
        const leaveChannelInfo = {
            userID : user.id,
            channelID : currentChannel._id
        }

        axios.post(`${API_URL}user/channel/leave`,leaveChannelInfo)
            .then(() => {
                // selectChannel('')
            })
        selectChannel('')
    }

    const handleBanChannelMember = (bannedMemberID) => {
        const banInfo = {
            bannedMemberID,
            channelID : currentChannel._id
        }

        socket.emit('banMember', banInfo);
    }

    useEffect(() => {
        socket.on('joinChannel', ({joinedUser , joinedChannel}) => {
        
            setMembers(oldMembers => [...oldMembers, joinedUser])
        })
        socket.on('banMember', ({bannedMember , channelID}) => {
            if(bannedMember._id === user.id && channelID === currentChannel._id) selectChannel('');
              
            if (channelID === currentChannel._id) setMembers(oldMembers => oldMembers.filter(member => member._id !== bannedMember._id));

        })
    },[])

    useEffect(() => {
        axios.get(`${API_URL}channel/user/${currentChannel._id}`)
            .then(res => {
                setMembers(res.data);
            })
        return () => setMembers([]);
    },[])

     return (
         <>
            <NavHead classNasme='justify-start flex-shrink-0'>
                <button className='text-2xl ctmFocus mr-3' onClick={() => selectChannel('')}>
                    <HiOutlineChevronLeft />
                </button>
                <span>All channels</span>
            </NavHead>

                <div className="px-6 py-4">
                    <h3 className='uppercase text-gray-300 font-bold mb-2'>{currentChannel.name}</h3>
                    <p className='text-gray-300'>{currentChannel.description ? currentChannel.description : 'no description'}</p>      
                </div>
                <h3 className='uppercase text-gray-300 font-bold px-6 py-4'>Members</h3>
                    <ul className='overflow-y-scroll scrollbar h-full px-4'>
                        {
                            members.map((member, index) => {
                                return  <li className='mb-4 flex justify-between' key={index}>
                                                <div className='flex items-center p-2'>
                                                    <img className='w-9 h-9 bg-white mr-5 rounded' src={member.picture} alt='C'/>
                                                    <span className={`text-lg ${user.id === member._id ? 'text-gray-300' : 'text-gray-400'} font-bold`}>{member.pseudo}</span> 
                                                    {member._id === currentChannel.owner && <RiVipCrownFill className='ml-2 text-yellow-500'/>}
                                                </div>
                                            <div className='flex items-center text-white'>
                                                <button className='ctmFocus p-1'>
                                                    <RiUser3Fill />  
                                                </button>

                                                {(user.id === currentChannel.owner && member._id !== user.id) &&   

                                                    <button className='ml-4 ctmFocus p-1' onClick={() => handleBanChannelMember(member._id)}>
                                                        <IoBan />  
                                                    </button>   
                                                }
                                                                                                                      
                                            </div>  
                                        </li>
                            })
                        }
                    </ul>
                    <div className='w-full h-16 flex '>
                        <button className='w-full bg-gray-800 ctmFocus text-white flex items-center justify-center transiton duration-200 hover:bg-gray-900'>
                            <RiEdit2Fill className='mr-3' />
                            EDIT
                        </button>
                        {/* <div className='w-1 h-full bg-red-500'></div> */}
                        <button className='w-full bg-gray-800 ctmFocus flex items-center justify-center text-red-400 transiton duration-200 hover:bg-gray-900' onClick={() => handleLeaveChannel()}>
                            <ImExit className='mr-3' />
                            LEAVE
                        </button>
                    </div>
         </>
     )

}

export default CurrentChannel;