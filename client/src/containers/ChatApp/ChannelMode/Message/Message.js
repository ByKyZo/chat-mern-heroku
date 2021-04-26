import React from 'react';

const Message = ({user , message , date, hour}) => {

    const handleFormatDate = () => {
        const messageDay = date.split('/');
        const currentDay = new Date().toLocaleDateString().split('/');
        for (let i = 0 ; i <= 2 ; i++){
            messageDay[i] = parseInt(messageDay[i]);
            currentDay[i] = parseInt(currentDay[i]);
        }

        if (messageDay[1] == currentDay[1] && messageDay[2] == currentDay[2]){
            if (messageDay[0] === currentDay[0]) return 'today at ';
            else if (messageDay[0] === currentDay[0] - 1) return 'yesterday at ';
        }

        return date;
    }
    
     return (
        <li className='flex mb-4 w-full'>
            <img 
                className='h-10 w-10 bg-white rounded-md mr-5 mt-1 flex-none' 
                src={user.picture} 
                alt={'C'}>
            </img>
            <div className='w-full'>
                <div className='flex items-baseline'>
                    <h2 className='mr-3 font-bold text-lg colorName'>{user.pseudo}</h2> 
                    <span className='text-gray-300 text-xs colorName'>{handleFormatDate() + ' ' + hour}</span>
                </div>
                <div className='text-gray-300 w-full'>{message}</div>
            </div>
        </li>
     )

}

export default Message;