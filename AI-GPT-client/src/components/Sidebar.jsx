import React, { useEffect, useState } from 'react'
import closeButton from '../assets/close_button.png'
import deleteIcon from '../assets/deleteIcon.png';

const Sidebar = ({ closeMenu, email, conversationId, startNewChat }) => {

    const [conversationData, setConversationData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchConversation = async (email) => {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/gpt/getConversationIds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        setConversationData(data.data);
        setIsLoading(false);
    }

    const deleteConversation = async (conversationId) => {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/gpt/deleteConversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conversationId })
        });
        const data = await response.json();
    }

    const handleDeleteButton = async (conversationId) => {
        await deleteConversation(conversationId);
        startNewChat();
        closeMenu();
    }

    useEffect(() => {
        fetchConversation(email);
    }, [])

    return (
        <div className='w-full md:w-64 h-full bg-black border-r border-gray-800 text-white pr-5 pb-5 md:block'>
            <div>
                <div className='flex items-center justify-between px-4 border-b border-gray-800 py-2'>
                    <h2 className='text-lg font-bold'>Recent Conversations</h2>
                    <img
                        src={closeButton}
                        onClick={closeMenu}
                        className='w-8 h-8 bg-white rounded-full hover:bg-gray-400 transition duration-200 cursor-pointer'
                        alt="Close menu"
                    />
                </div>
                <h3 className='pl-4 mt-2 cursor-pointer text-sm md:text-base' onClick={startNewChat}>
                    Start new chat
                </h3>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center h-16'>
                    <p>Loading Conversations...</p>
                </div>
            ) : (
                <div className='pt-4 overflow-y-auto h-[70svh]'>
                    {conversationData.length > 0 ? (
                        conversationData.map((m, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between p-2 border-b border-gray-600 hover:bg-gray-800 rounded transition duration-150 cursor-pointer'
                                onClick={() => { conversationId(m.conversationId) }}
                            >
                                <p className='overflow-hidden text-ellipsis whitespace-nowrap w-5/6 text-sm md:text-base'>
                                    {m.firstChat}
                                </p>
                                <p>
                                    <img
                                        src={deleteIcon}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering onClick of parent
                                            handleDeleteButton(m.conversationId);
                                        }}
                                        className='w-8 h-8'
                                    />
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className='flex items-center justify-center h-16'>
                            <p>No conversations available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Sidebar
