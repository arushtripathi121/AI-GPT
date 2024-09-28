import React from 'react';
import Header from '../components/Header';
import menuButton from '../assets/menu-button.png';

const HomePage = () => {
  return (
    <section className='w-screen h-screen bg-black flex flex-col'>
      <div className='flex-none'>
        <Header home={true} />
      </div>

      <div className='flex flex-row items-start pt-5 px-8 flex-grow h-full w-full'>
        
        <div><img src={menuButton} className='w-8 h-8' alt="Menu Button" /></div>
        
        <div className='flex-grow p-5 pt-0 flex flex-col h-full w-full'>
          <div className='bg-black rounded-lg flex-grow p-5 overflow-y-auto space-y-4 h-full'>
            <div className='text-white'></div>
          </div>

          <div className='border border-white bg-black rounded-lg mt-5 flex flex-row items-center'>
            <input
              type='text'
              className='w-full bg-transparent text-white border-none focus:outline-none placeholder-gray-400 p-3'
              placeholder='Enter your prompt'
            />
            <button className='bg-white p-3 text-black font-medium text-xl px-10 rounded-r-lg'>Ask</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
