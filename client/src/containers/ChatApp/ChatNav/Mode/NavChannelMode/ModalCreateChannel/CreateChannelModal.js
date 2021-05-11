import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from '../../../../../../components/Utils/Modal';
import { UserContext } from '../../../../../../context/UserContext';
import { SocketContext } from '../../../../../../context/SocketContext';
import { FiCheckCircle } from 'react-icons/fi';

const CreateChannelModal = ({ isOpen, setIsOpen, channels, addChannel }) => {

    const socket = useContext(SocketContext);
    const { user , setUser } = useContext(UserContext);
    const [channel, setChannel] = useState({
        userID: user.id,
        name: '',
        description: ''
    })

    const createChannel = () => {

        socket.emit('createChannel', channel);
    }

    useEffect(() => {
        socket.on('createChannel', ({ userID, channel }) => {
            setUser(oldUser => {
                oldUser.notifications.push({
                  icons : <FiCheckCircle />,
                  color : 'green-500',
                  label : `Channel ${channel.name} create`
                })
                return {...oldUser}
            })
            setIsOpen(false)
            setChannel({
                userID: user.id,
                name: '',
                description: ''
            })
            if (userID !== user.id) return;
            addChannel(oldChannels => [...oldChannels, channel]);
        })

        return () => {
            socket.off('createChannel')
        }
    }, [])

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <h4 className='text-white font-semibold mb-7'>NEW CHANNEL</h4>
            <div>
                <input className='bg-InputCreateChannel rounded-md mb-5 p-2 w-full ctmFocus' type="text" id=""
                    value={channel.name}
                    onChange={e => setChannel({ ...channel, 'name': e.target.value })}
                />

                <textarea className='bg-InputCreateChannel rounded-md mb-5 p-2  w-full h-24 resize-none ctmFocus leading-4'
                    spellCheck='false'
                    value={channel.description}
                    onChange={e => setChannel({ ...channel, 'description': e.target.value })}
                ></textarea>

                <button className='bg-blue-600 rounded-md py-1 px-6 text-white ctmFocus hover:bg-blue-700 float-right'
                    onClick={() => createChannel()}
                >Save</button>
            </div>
        </Modal>
    )

}

export default CreateChannelModal;