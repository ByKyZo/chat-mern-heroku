import React, { useContext, useEffect, useState } from 'react';
import NavHead from '../../../../../../components/NavComponents/NavHead';
import Drowdown from '../../../../../../components/Modal/Dropdown';
import Popup from '../../../../../../components/Modal/Popup';
import Button from '../../../../../../components/Button/Button';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { API_URL , SOCKET_URL } from '../../../../../../config';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from '../../../../../../context/UserContext';
import { ImExit } from 'react-icons/im';
import { RiEdit2Fill , RiUser3Fill , RiVipCrownFill , RiDeleteBin5Fill } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { IoBan } from 'react-icons/io5';
// BOUTON POUR QUITTER LE CHANNEL 
// BOUTON POUR SUPPRIMER LE CHANNEL SI ADMIN DU CHANNEL ?
// BOUTON POUR MODIFIER LE CHANNEL SI ADMIN DU CHANNEL ?
const socket = io(SOCKET_URL);

const CurrentChannel = ({ currentChannel , selectChannel }) => {

    const [isOpenConfirmDelete , setIsOpenConfirmDelete] = useState(false);
    const [isOpenPopupBannedMember , setIsOpenPopupBannedMember] = useState(false)
    const [isOpenConfirmLeave , setIsOpenConfirmLeave] = useState(false);
    const [isOpenMenu , setIsOpenMenu] = useState(false);
    const [members , setMembers] = useState([]);
    const { user } = useContext(UserContext);

    const handleLeaveChannel = () => {
        const leaveChannelInfo = {
            userID : user.id,
            channelID : currentChannel._id
        }
        
        socket.emit('leaveChannel', leaveChannelInfo)
        selectChannel('')
    }

    const handleDeleteChannel = () => {
        socket.emit('deleteChannel',currentChannel._id)
    }

    const handleEditChannel = () => {
        console.log('edit')
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
            setMembers(old => [...old,joinedUser]);
        })
        socket.on('banMember', ({bannedMember , channelID}) => {
            if(bannedMember._id === user.id && channelID === currentChannel._id) setIsOpenPopupBannedMember(true);
              
            if (channelID === currentChannel._id) setMembers(oldMembers => oldMembers.filter(member => member._id !== bannedMember._id));
        })
        socket.on('deleteChannel',(deletedChannel) => {
            if (currentChannel._id === deletedChannel._id) selectChannel('');
        })
        socket.on('leaveChannel',({ leaveMember , channelID }) => {
            console.log(leaveMember)
            if (channelID === currentChannel._id) setMembers(oldMembers => oldMembers.filter(member => member._id !== leaveMember._id));
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
            <Popup isOpen={isOpenPopupBannedMember} setIsOpen={setIsOpenPopupBannedMember}>
                <h3>Your are banned from this channel</h3>
                <div>
                    <Button click={() => selectChannel('')}>Oh shit</Button>
                    <Button click={() => selectChannel('')}>Nice</Button>
                </div>
            </Popup>

            <Popup isOpen={isOpenConfirmDelete} setIsOpen={setIsOpenConfirmDelete} text='Are you sure you delete this channel?'>
                <div className="flex items-center justify-around">
                    <Button click={() => setIsOpenConfirmDelete(false)}>Cancel</Button>
                    <Button className='border border-red-500 hover:bg-red-500 hover:text-white' txt='text-red-500' click={() => handleDeleteChannel()}>Delete</Button>
                </div>        
            </Popup>

            <Popup isOpen={isOpenConfirmLeave} setIsOpen={setIsOpenConfirmLeave} text='Are you sure you leave the channel?'>
                <div className="flex items-center justify-around">
                    <Button click={() => setIsOpenConfirmLeave(false)}>Cancel</Button>
                    <Button className='border border-red-500 hover:bg-red-500 hover:text-white' txt='text-red-500'  click={() => handleLeaveChannel()}>Leave</Button>
                </div>     
            </Popup>

            <NavHead classNasme='justify-start flex-shrink-0'>
                <button className='text-2xl ctmFocus mr-3' onClick={() => selectChannel('')}>
                    <HiOutlineChevronLeft />
                </button>
                <span>All channels</span>
            </NavHead>

                <div className="px-6 py-4">
                    <div className='flex justify-between items-center mb-2 relative'>
                        <h3 className='uppercase text-gray-300 font-bold'>{currentChannel.name}</h3> 
                        <button  
                            className='text-white text-2xl ctmFocus'
                            onClick={() => setIsOpenMenu(true)}
                        >
                            <BiChevronDown />  
                        </button>

                    <Drowdown isOpen={isOpenMenu} setIsOpen={setIsOpenMenu} top='25px' right='0'>
                        <li>
                            <button 
                                className='w-full ctmFocus flex items-center text-gray-200 hoverMenuProfileBg p-2 rounded-lg' 
                                onClick={() => setIsOpenConfirmLeave(true)}>
                                <ImExit className='mr-3' />
                                LEAVE
                            </button>
                        </li>
                        <li>
                            <button 
                                className='w-full ctmFocus flex items-center hoverMenuProfileBg p-2 rounded-lg text-gray-200'
                                onClick={() => handleEditChannel()}>
                                <RiEdit2Fill className='mr-3' />
                                EDIT
                            </button>
                        </li>
                        {   
                            (user.id === currentChannel.owner || user.role === 'admin') &&
                            <>            
                                <li className='border-b border-gray-500 m-2'></li>
                                <li>
                                    <button 
                                        className='w-full ctmFocus flex items-center hoverMenuProfileBg p-2 rounded-lg text-red-500'
                                        onClick={() => setIsOpenConfirmDelete(true)}>
                                        <RiDeleteBin5Fill className='mr-3' />
                                        DELETE
                                    </button>
                                </li>
                            </>
                        }
               
                    </Drowdown>

                    </div>
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

                                                {((user.id === currentChannel.owner || user.role === 'admin') && member._id !== user.id) &&   

                                                    <button className='ml-4 ctmFocus p-1' onClick={() => handleBanChannelMember(member._id)}>
                                                        <IoBan />  
                                                    </button>   
                                                }                                                                
                                            </div>  
                                        </li>
                            })
                        }
                    </ul>
         </>
     )

}

export default CurrentChannel;