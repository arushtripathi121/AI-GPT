import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import menuButton from '../assets/menu-button.png';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const data = localStorage.getItem('user-info');
  const userData = JSON.parse(data);
  const email = userData?.email || '';
  const [currentConversationId, setCurrentConversationId] = useState('');
  const [conversationData, setConversationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [LoadingNewResponse, setLoadingNewResponse] = useState(false);
  const chatContainerRef = useRef(null);

  const handleMenuButton = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const fetchDataById = async (id) => {
    if (id) {
      setIsLoading(true);
      try {
        const response = await fetch('https://ai-gpt-chi.vercel.app/api/v1/gpt/getChats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: id }),
        });
        const data = await response.json();
        setConversationData(data.data || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const askNewQuestion = async (prompt) => {
    setLoadingNewResponse(true);
    if (!prompt) return;
    const body = JSON.stringify({ prompt, email, conversationId: currentConversationId || undefined });

    try {
      const response = await fetch('https://ai-gpt-chi.vercel.app/api/v1/gpt/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await response.json();
      if (data && data.data) {
        const newEntry = { prompt, response: data.data };
        setConversationData((prevData) => [...prevData, newEntry]);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
    } finally {
      setLoadingNewResponse(false);
      setPrompt('');
    }
  };

  const handleAskButton = () => {
    askNewQuestion(prompt);
  };

  useEffect(() => {
    fetchDataById(currentConversationId);
    setIsMenuOpen(false);
  }, [currentConversationId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationData]);

  return (
    <section className='w-screen h-screen bg-black flex flex-col'>
      <Header home={true} />
      <div className='flex flex-col md:flex-row items-start pt-5 pl-8 flex-grow h-full w-full'>
        <div className='h-[90svh] pb-5 absolute'>
          {isMenuOpen ? (
            <Sidebar
              email={email}
              startNewChat={() => {
                setConversationData([]);
                setIsMenuOpen(false);
              }}
              conversationId={(e) => setCurrentConversationId(e)}
              closeMenu={handleMenuButton}
            />
          ) : (
            <img
              src={menuButton}
              onClick={handleMenuButton}
              className='w-8 h-8 cursor-pointer'
              alt="Menu Button"
            />
          )}
        </div>

        <div className='flex-grow pl-5 pt-0 flex flex-col h-full w-full'>
          <div className='bg-black rounded-lg flex-grow overflow-y-auto space-y-4 h-[70svh] p-4' ref={chatContainerRef}>
            <div className='text-white'>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                conversationData.length > 0 ? (
                  conversationData.map((m, index) => (
                    <div key={index} className='border-b border-gray-700 pb-4'>
                      <p className='font-semibold text-blue-400'>Prompt:</p>
                      <p className='mb-2 italic'>{m.prompt}</p>
                      <p className='font-semibold text-blue-400'>Response:</p>
                      <div className='rounded-lg p-2' dangerouslySetInnerHTML={{
                        __html: m.response
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                          .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                          .replace(/\* (.*?)\n/g, '<li>$1</li>')
                          .replace(/\n/g, '<br />'),
                      }} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full bg-black">
                    <p className="text-white text-lg">Start a new conversation</p>
                  </div>
                )
              )}
              {LoadingNewResponse && <p className="text-yellow-400 italic">Loading new response...</p>}
            </div>
          </div>

          <div className='bg-black pt-10 px-5 pb-5'>
            <div className='border border-white w-full flex flex-row items-center rounded-lg'>
              <label htmlFor="prompt-input" className="sr-only">Prompt</label>
              <input
                id="prompt-input"
                type="text"
                value={prompt}
                className='w-full bg-transparent text-white border-none focus:outline-none placeholder-gray-400 p-3'
                placeholder='Enter your prompt'
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button onClick={handleAskButton} className='bg-white p-3 text-black font-medium text-xl px-10 rounded-r-lg'>
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
