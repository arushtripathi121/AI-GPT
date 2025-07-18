import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

const Header = ({ home = false, email, startNewChat, sessions, setSessions, setCurrentSessionId }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user-info');
        navigate('/');
    };

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        if (data) {
            try {
                const userData = JSON.parse(data);
                setUserInfo(userData);
            } catch (error) {
                console.error("Invalid user info format:", error);
            }
        }
    }, []);

    // Determine header style
    const isDarkHeader = !home || (home && userInfo?.user);
    const headerBgClass = isDarkHeader ? 'bg-gray-900 text-white' : 'bg-transparent text-black';

    // Show menu if on homepage or user is logged in
    const showMenu = home || userInfo?.user;

    return (
        <header className={`w-full py-4 px-5 md:px-10 flex items-center justify-between relative z-50 ${headerBgClass}`}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
                Vireon
            </h1>

            {/* Show Menu Button */}
            {showMenu && (
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 rounded-md hover:bg-gray-200 transition"
                >
                    <FiMenu className={`text-2xl ${isDarkHeader ? 'text-white' : 'text-black'}`} />
                </button>
            )}

            {/* Sidebar */}
            {isMenuOpen && (
                <div className="fixed top-0 left-0 h-full w-64 z-50 bg-white text-black shadow-lg transform transition-transform duration-300 translate-x-0">
                    <Sidebar
                        email={userInfo?.email}
                        userInfo={userInfo}
                        isSidebarOpen={isMenuOpen}
                        startNewChat={startNewChat}
                        setCurrentSessionId={(id) => {
                            setCurrentSessionId(id);
                            setIsMenuOpen(false);
                        }}
                        closeMenu={() => setIsMenuOpen(false)}
                        sessions={sessions}
                        setSessions={setSessions}
                        handleLogout={handleLogout}
                    />
                </div>
            )}
        </header>
    );
};

export default Header;
