import React from 'react';
import ChannelHome from './ChannelHome/ChannelHome';
import CurrentChannel from './CurrentChannel/CurrentChannel';

const NavChannelMode = ( { selectChannel , currentChannel } ) => {

     return (
         <>
            {
                currentChannel ?

                <CurrentChannel currentChannel={currentChannel} selectChannel={selectChannel} />

                :

                <ChannelHome currentChannel={currentChannel} selectChannel={selectChannel} />
            }

         </>
     )

}

export default NavChannelMode;