import React from 'react';

const component = ({ date }) => {

    const formatDate = () => {
        // let dateDivider = '';
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        const monthNumber = (date.slice(3,5)[0] === '0')-1 ? date.slice(3,5) - 1 : date.slice(4,5) - 1 ;

        return `${month[monthNumber]} ${date.slice(0,2)}, ${date.slice(6,10)}`
    }
    formatDate()
    // console.log(date)
     return (
         <li className='flex justify-between items-center mb-4'>

             <div className='border-b border-gray-500 w-full'></div>

             <span className='inline-block flex-shrink-0 text-center break-normal mx-4 text-gray-500 text-xs'>{formatDate()}</span>

             <div className='border-b border-gray-500 bg-gray-500 w-full'></div>

         </li>
     )

}

export default component;