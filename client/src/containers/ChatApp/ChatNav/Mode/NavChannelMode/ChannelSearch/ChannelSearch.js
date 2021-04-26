import React, { useContext, useEffect, useRef, useState , useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../../../../../context/UserContext';
import axios from 'axios';
import { API_URL , SOCKET_URL } from '../../../../../../config'; 
import io from 'socket.io-client';
import './openAnimation.css';

const socket = io(SOCKET_URL);

const ChannelSearch = ({ channels , setChannels }) => {

    const [openSearchList , setOpenSearchList] = useState(false);
    const [channelFind , setChannelFind] = useState([]);
    const { user } = useContext(UserContext);
    const SearchListRef = useRef();
    const SearchInput = useRef();

    const handleLoadDataChannel = () => {
        axios.get(`${API_URL}channel/search/${user.id}`)
        .then(res => {
            setChannelFind(res.data)
        })
    }
    
    const handleSearchChannel = () => {
        setOpenSearchList(true);
        handleLoadDataChannel()
    }

    const handleJoinChannel = (channelID) => {
        const infos = {
            userID : user.id,
            channelID
        }

        socket.emit('joinChannel',infos)
    }
    useEffect(() => {
        socket.open()
        socket.on('joinChannel',({ joinedUser , joinedChannel }) => {
            handleLoadDataChannel()
            setOpenSearchList(false)
            if (joinedUser._id !== user.id) return;
            setChannels(old => [...old, joinedChannel])
        })   
        return () => socket.close()     
    },[])

    const returnFindChannel = () => {
        const channels = [];
        channelFind.map((channel, index) => {
            channels.push(  <li key={channel._id} className={`w-full flex items-center ${index !== channelFind.length -1 && 'border-b'} bg-gray-600 bg-opacity-70 transition duration-200 hover:bg-opacity-100`}>
                                <button className='flex p-3 w-full ctmFocus items-center' onClick={() => handleJoinChannel(channel._id)}>
                                    <div className='h-7 w-7 bg-red-400 rounded-md mr-4 flex items-center justify-center'>{channel.name[0]}</div>
                                    <span>{channel.name}</span>
                                </button>
                            </li>
                        )  
        })
        return channels;
    }

    useEffect(() => {
        const handleCloseSearchList = (e) => {
            (!SearchListRef.current.contains(e.target) && !SearchInput.current.contains(e.target)) && setOpenSearchList(false)
        }
        document.addEventListener('mousedown',handleCloseSearchList)
        return () => {
            document.removeEventListener('mousedown',handleCloseSearchList)
        }
    },[openSearchList])

     return (
         <>
            <div className='px-4'>
                <div className='p-2 h-14 relative' ref={SearchInput}>
                        <label htmlFor='search' className='absolute text-white top-4 left-4 cursor-pointer'><FontAwesomeIcon icon={faSearch}/></label>
                        <input id='search' type='search' autoComplete='off' 
                            className='focus:outline-none h-full w-full rounded-md p-1 pl-10 inputSearch leading-10 ctmFocus' 
                            placeholder='Search'
                            onFocus={() => handleSearchChannel()}
                        />
                </div>
            </div>

            <div className="relative w-full">
                <div className={`absolute w-full px-4 overflow-hidden rounded-lg ${openSearchList ? 'z-50' : 'z-index--1'}`} ref={SearchListRef}>
                    <ul className={`w-full bg-gray-500 rounded-lg transiton duration-200 ease-in-out opacity-0 overflow-hidden ${openSearchList && 'opacity-100'}`}>
                        {
                            returnFindChannel()
                        }
                    </ul>
                </div>
            </div>
        </>
     )

}

export default ChannelSearch;