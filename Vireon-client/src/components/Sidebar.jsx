import React, { useEffect, useState } from 'react';
import { FiTrash2, FiPlus, FiLogOut, FiUser, FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ closeMenu, email, setCurrentSessionId, startNewChat, isSidebarOpen }) => {
    const [conversationData, setConversationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchConversation = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/conversation/ids`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setConversationData(data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConversation = async (id) => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}/conversation/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: id }),
            });
            setConversationData(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteButton = async (id) => {
        await deleteConversation(id);
        startNewChat();
        closeMenu();
    };

    const handleLogout = () => {
        localStorage.removeItem('user-info');
        closeMenu();
        window.location.href = '/';
    };

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        if (data) setUserInfo(JSON.parse(data));
    }, []);

    useEffect(() => {
        fetchConversation();
    }, [email]);

    useEffect(() => {
        if (isSidebarOpen) {
            fetchConversation();
        }
    }, [isSidebarOpen]);

    const SIDEBAR_WIDTH = "w-64";

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white text-gray-900">
            <div className="flex items-center justify-between px-3 py-4 bg-gray-100 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <FiUser className="text-xl text-gray-700" />
                    <div>
                        <p className="text-sm font-semibold">{userInfo?.name || 'User'}</p>
                        <p className="text-xs text-gray-600">{userInfo?.email}</p>
                    </div>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-gray-200 rounded" title="Close">
                    <FiChevronLeft className="text-lg text-gray-700" />
                </button>
            </div>

            <div className="px-4 py-2 border-b border-gray-300">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    <FiLogOut />
                    Logout
                </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-300">
                <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-700"
                >
                    <FiPlus />
                    Start New Chat
                </button>
            </div>

            <div className="flex-grow px-2 overflow-y-auto pt-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : conversationData.length > 0 ? (
                    conversationData.map((c) => (
                        <div
                            key={c._id}
                            onClick={() => {
                                setCurrentSessionId(c._id);
                                closeMenu();
                            }}
                            className="flex justify-between items-center px-3 py-2 rounded hover:bg-gray-100 cursor-pointer group"
                        >
                            <p className="truncate w-5/6 text-sm">
                                {c.chats?.[0]?.prompt?.slice(0, 40) || 'New Chat'}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteButton(c._id);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 py-4">No conversations found.</p>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className={`hidden md:flex ${SIDEBAR_WIDTH} h-full shadow-md border-r border-gray-300`}>
                <SidebarContent />
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-0 left-0 h-full z-50 shadow-lg border-r border-gray-300 md:hidden ${SIDEBAR_WIDTH} bg-white`}
                    >
                        <SidebarContent />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
