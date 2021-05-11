import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import NotificationItem from './NotificationItem';
import { v4 as uuidv4 } from 'uuid';

// FAIRE UNE SMOOTH ANIMATION A L'APPARATION DE LA NOTIF
// REGLER LE BUG DE TIMEOUT QUI NE FAIT PAS TOUT LE TEMPS 4secondes

const Notifications = (props) => {

    const { user , setUser } = useContext(UserContext);

    // const [userNotif , setUserNotif] = useState(user.notifications)

    useEffect(() => {
        if (user.notifications.length === 0) return;
        setTimeout(() => {
            setUser(oldUser => {
                oldUser.notifications.shift()
                return {...oldUser}
            })
        },4000)
        clearTimeout()
        console.log('new notif')
    },[user])

     return (
         <ul style={{ zIndex : 9999 }} className='absolute top-0 left-1/2 transform -translate-x-1/2'>

                {user.notifications.map(({icons , label, color},index) => {

                    return <NotificationItem key={uuidv4()} icons={icons} label={label} color={color} />

                })}

         </ul>
     )

}

export default Notifications;