import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user-info');
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/')
  }

  return (
    <div>
      This is the home page
      <p>{userInfo?.name}</p>
      <p>{userInfo?.email}</p>
      <img src={userInfo?.image} />

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default HomePage
