import React, { useEffect, useState } from 'react';
import { API_URL } from './config';
import Authentication from './containers/Authentication/Authentication';
import ChatApp from './containers/ChatApp/ChatApp';
import { UserContext } from './context/UserContext';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const userDisconnected = {
    id : null,
    pseudo : null,
    email : null,
    description : null,
    picture : null,
    role : null,
    isConnected : false
}

const App = (props) => {

    const [user , setUser] = useState(userDisconnected)
    const [, setCookie, removeCookie] = useCookies()

    useEffect(() => {
        axios.get(`${API_URL}user/rememberme`,{withCredentials : true})
            .then(res => {
                if (res.data === '') throw new Error();
                setUser({
                    id : res.data._id,
                    pseudo : res.data.pseudo,
                    email : res.data.email,
                    description : res.data.description,
                    picture : res.data.picture,
                    role : null,
                    isConnected : true // pas besoin de ça
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
        <div className='h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-10'>

            <UserContext.Provider value={{user , setUser}} >
            
            {   
                !user.isConnected ?  

                <Authentication /> 

                : 

                <ChatApp />     
            }
   
            </UserContext.Provider>

        </div>
    )

}

export default App;