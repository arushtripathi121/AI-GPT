import React, { useEffect, useState } from 'react'
import closeButton from '../assets/close_button.png'

const Sidebar = ({ closeMenu, email, conversationId}) => {

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

    useEffect(() => {
        fetchConversation(email);
    }, [])

    return (
        <div className='w-64 h-full bg-black border-r border-gray-800 text-white pr-5 pb-5'>
            <div className='flex items-center justify-between p-4 border-b border-gray-800'>
                <h2 className='text-lg font-bold'>Recent Conversations</h2>
                <img
                    src={closeButton}
                    onClick={closeMenu}
                    className='w-8 h-8 bg-white rounded-full hover:bg-gray-400 transition duration-200 cursor-pointer'
                    alt="Close menu"
                />
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center'>
                    <p>Loading Conversations...</p>
                </div>
            ) : (
                <div className='pt-4 overflow-y-auto h-[calc(100%-4rem)]'>
                    {conversationData.length > 0 ? (
                        conversationData.map((m, index) => (
                            <div
                                key={index}
                                className='p-2 border-b border-white hover:bg-gray-800 rounded transition duration-150 cursor-pointer'
                                onClick={() => {conversationId(m.conversationId)}}
                            >
                                {m.firstChat}
                            </div>
                        ))
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            <p>No conversations available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Sidebar
