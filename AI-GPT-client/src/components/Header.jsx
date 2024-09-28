import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ home }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleImageClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user-info');
        navigate('/');
    };

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        setUserInfo(userData);
    }, [])

    return (
        <header className="bg-black text-white py-4 flex justify-between items-center px-5 md:px-10">
            <h1 className="text-2xl md:text-4xl font-bold">AI GPT</h1>
            {home && (
                <div className="relative">
                    <img
                        src={userInfo?.image}
                        alt="User"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer"
                        onClick={handleImageClick}
                    />
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white shadow-lg rounded-md">
                            <div className="px-4 py-2">
                                <p className="font-semibold">{userInfo?.name}</p>
                                <p className="text-sm text-gray-400">{userInfo?.email}</p>
                            </div>
                            <hr className="border-gray-700" />
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
