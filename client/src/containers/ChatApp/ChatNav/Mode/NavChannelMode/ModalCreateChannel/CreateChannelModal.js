import React, { useContext, useEffect, useMemo, useRef , useState } from 'react';
import { API_URL , SOCKET_URL } from '../../../../../../config';
import { UserContext } from '../../../../../../context/UserContext';
import axios from 'axios';
import  io  from 'socket.io-client';

const socket = io(SOCKET_URL);

const CreateChannelModal = ({ isOpen , setIsOpen , channels , addChannel }) => {

    const { user } = useContext(UserContext);
    const [channel ,  setChannel] = useState({
        // date : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        userID : user.id,
        name : '',
        description : ''
    })
    const channelModalRef = useRef();

    const createChannel = () => {
  
        socket.emit('createChannel',channel);
    }

    const memoizedChannel = useMemo(() => {
        socket.on('createChannel',({userID , channel}) => {
            if (userID !== user.id) return;
            addChannel([...channels , channel]);
        })
    },[channel,setChannel])

    useEffect(() => {
        if (!isOpen) return;

        const closeModalChannel = (e) => {
            if (!channelModalRef.current.contains(e.target) && isOpen) setIsOpen(false);
        }
        window.addEventListener('mousedown',closeModalChannel)

        return () => {
            window.removeEventListener('mousedown',closeModalChannel)
        }

    },[isOpen])

     return (
        <div className={`absolute h-full w-full flex justify-center items-center bg-black bg-opacity-50  transform transition duration-200 ${isOpen ? 'opacity-100 z-50' : 'scale-0 opacity-0'}`}>

            <div ref={channelModalRef} className="w-1/2 bg-black-1100 rounded-2xl p-6 xl:w-1/3">

                <div className='text-white font-semibold mb-7'>NEW CHANNEL</div>

                <div>

                    <input className='bg-InputCreateChannel rounded-md mb-5 p-2 w-full ctmFocus' type="text"  id="" 
                            value={channel.name}
                            onChange={e => setChannel({...channel , 'name' : e.target.value})}
                            />

                    <textarea className='bg-InputCreateChannel rounded-md mb-5 p-2  w-full h-24 resize-none ctmFocus leading-4'
                            spellCheck='false'
                            value={channel.description}
                            onChange={e => setChannel({...channel , 'description' : e.target.value})}
                    ></textarea>

                    <button className='bg-blue-600 rounded-md py-1 px-6 text-white ctmFocus hover:bg-blue-700 float-right'
                            onClick={() => createChannel()}
                    >Save</button>
                </div>

            </div>

        </div>
     )

}

export default CreateChannelModal;