import React, { useContext, useEffect, useState } from 'react';
import CreateChannelModal from '../ModalCreateChannel/CreateChannelModal';
import ChannelSearch from '../ChannelSearch/ChannelSearch';
import NavHead from '../../../../../../components/NavComponents/NavHead';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL , SOCKET_URL } from '../../../../../../config';
import { UserContext } from '../../../../../../context/UserContext';
import './scrollbar.css';

const socket = io(SOCKET_URL);

const ChannelHome = ({ selectChannel }) => {

    const [isOpenChannelModal , setIsOpenChannelModal] = useState(false);
    const [loading , setLoading] = useState(false);
    const [channels , setChannels] =  useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        setLoading(true)
        axios.get(`${API_URL}channel/${user.id}`)
            .then( res => {
                setChannels(res.data)
                setLoading(false)
            })
            .finally (() => {
                // console.log('stop loading')
                setLoading(false)
            })
    },[])

    useEffect(() => {
        socket.on('banMember', ({bannedMember , channelID}) => {
            bannedMember._id === user.id && setChannels(oldChannels => oldChannels.filter(channel => channel._id !== channelID))
        })
    })
    // const handleCreate

    const channelLoadingSkelett = () => {
        const skelettList = [];
        for (let i = 0 ; i < 7 ; i++){
            skelettList.push(<div key={i} className='flex items-center mb-4 cursor-pointer w-full p-2 rounded-lg animate-pulse'>
                                <div className='w-8 h-8 rounded-md bg-gray-400 mr-3'></div>
                                <div className='w-44 h-8 rounded-md bg-gray-400'></div>
                            </div>)
        }
        return skelettList;
    }

     return (
         <>
            {/* CREATE CHANNEL MODAL */}
            <CreateChannelModal isOpen={isOpenChannelModal} setIsOpen={setIsOpenChannelModal} channels={channels} addChannel={setChannels}/>
            {/* ---------- */}

            <NavHead title='Channel' className='justify-between'>

                <button 
                    onClick={() => setIsOpenChannelModal(true)}
                    className='channelIcon p-1 rounded-md ctmFocus hoverMenuProfileBg'>
                    <IoMdAdd className='text-white'/>
                </button>  

            </NavHead>

            <ChannelSearch channels={channels} setChannels={setChannels} />
            
            <div className="p-4 overflow-y-scroll scrollbar h-full">

                {
                    loading ? channelLoadingSkelett() :

                    channels.map((channel,index) => {
                        return  <button key={channel._id} onClick={() => selectChannel(channel)}
                                    className={`flex items-center ${index !== channels.length -1 && 'mb-4'} cursor-pointer w-full ctmFocus hoverMenuProfileBg p-2 rounded-lg`}>
                                    <div className='w-8 h-8 channelIcon mr-3 rounded-md flex items-center justify-center text-white uppercase'>{channel.name[0]}</div>
                                    <span className='text-gray-300 uppercase'>{channel.name}</span>
                                </button>
                    })
                }

            </div>
         </>
     )

}

export default ChannelHome;