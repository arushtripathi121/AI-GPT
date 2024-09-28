import React from 'react'
import closeButton from '../assets/close_button.png'
// import dotenv from 'dotenv';
// dotenv.config();

const Sidebar = ({closeMenu}) => {
    return (
        <div className='w-64 h-full border-r border-white text-white pr-5 pb-5'>
            <div className='flex flex-row items-center justify-between'>
                <p>Recent Conversations</p>
                <img src={closeButton} onClick={closeMenu} className='bg-white rounded-xl w-8 h-8 border border-black cursor-pointer'/>
            </div>
        </div>
    )
}

export default Sidebar
