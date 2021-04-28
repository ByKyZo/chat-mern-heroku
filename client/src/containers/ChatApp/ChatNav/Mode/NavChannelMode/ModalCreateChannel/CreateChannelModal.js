import React, { useContext, useEffect, useRef , useState } from 'react';
import Popup from '../../../../../../components/Modal/Popup';
import { SOCKET_URL } from '../../../../../../config';
import { UserContext } from '../../../../../../context/UserContext';
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

    const createChannel = () => {
  
        socket.emit('createChannel',channel);
    }

    useEffect(() => {
        socket.on('createChannel',({userID , channel}) => {
            if (userID !== user.id) return;
            addChannel(oldChannels => [...oldChannels , channel]);
        })
    },[])

    return (
        <Popup isOpen={isOpen} setIsOpen={setIsOpen}>
            <h4 className='text-white font-semibold mb-7'>NEW CHANNEL</h4>
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
        </Popup>
    )

}

export default CreateChannelModal;