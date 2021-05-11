import React, { useEffect, useReducer, useState } from 'react';
import { API_URL } from './config';
import Authentication from './containers/Authentication/Authentication';
import ChatApp from './containers/ChatApp/ChatApp';
import { UserContext } from './context/UserContext';
import  { SocketContext , socket} from './context/SocketContext'; 
import { useCookies } from 'react-cookie';
import axios from 'axios';
import NotificationItem from './components/Utils/Notifications/NotificationItem';
import { FiCheckCircle } from 'react-icons/fi';
import Notifications from './components/Utils/Notifications/Notifications';


const userDisconnected = {
    id : null,
    pseudo : null,
    email : null,
    description : null,
    picture : null,
    role : null,
    isConnected : false,
    currentChannel : {},
    notifications : [],
}

const App = (props) => {

    // const notificationReducer = (state, action) => {
    //     switch (action) {
    //         case 'addnotif' : 
    //     }
    // }

    const [user , setUser] = useState(userDisconnected)
    // const [state , dispatch] = useReducer()
    const [ , setCookie, removeCookie] = useCookies()

    useEffect(() => {
        axios.get(`${API_URL}user/rememberme`,{withCredentials : true})
            .then(res => {
                if (res.data === '') throw new Error();
                setUser({
                    id : res.data._id,
                    pseudo : res.data.pseudo,
                    email : res.data.email,
                    description : res.data.description,
                    picture : API_URL + res.data.picture,
                    role : res.data.role,
                    isConnected : true,// pas besoin de ça
                    currentChannel : {},
                    notifications : [],
                })
                // A VOIR POUR FAIRE DE L'ASYNC
            
                setCookie(['REMEMBER_ME'],res.data.remember_me_token)
            })
            .catch(err => {
                setUser(userDisconnected);
                removeCookie(['REMEMBER_ME'])
            })
    
    },[])

    return (
        <div className='h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'>
            <SocketContext.Provider value={socket}>
                <UserContext.Provider value={{user , setUser}} >
                {/* <ul className='absolute'>
                    {user.notifications.map(({icons , label, color},index) => {
                        // console.log(icons)
                        return <Popup key={index} icons={icons} label={label} color={color} />
                    })}
                </ul> */}
                {/* <Popup notif={<FiCheckCircle />} label='testtt' color='pink-500' /> */}
                    <Notifications />
                {   
                    !user.isConnected ?  

                    <Authentication /> 

                    : 

                    <ChatApp />     
                }
    
                </UserContext.Provider>
            </SocketContext.Provider>
        </div>
    )

}

export default App;