import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import moment from 'moment';

function splitResponse(response) {
  const regex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  const segments = [];

  let match;
  while ((match = regex.exec(response)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: response.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: 'code',
      content: match[1].trim(),
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < response.length) {
    segments.push({
      type: 'text',
      content: response.slice(lastIndex),
    });
  }

  return segments;
}

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group my-2">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1"
      >
        {copied ? <FaCheck /> : <FaRegCopy />} {copied ? 'Copied' : 'Copy'}
      </button>
      <SyntaxHighlighter language="javascript" style={oneDark} className="rounded-md text-sm">
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const TextBlock = ({ text }) => (
  <div>
    {text.split('\n').map((line, i) => (
      <p
        key={i}
        className="mb-1"
        dangerouslySetInnerHTML={{
          __html: line
            .replace(/#### (.*?)(\n|$)/g, '<h4 class="font-semibold">$1</h4>')
            .replace(/### (.*?)(\n|$)/g, '<h3 class="font-semibold">$1</h3>')
            .replace(/## (.*?)(\n|$)/g, '<h2 class="font-bold">$1</h2>')
            .replace(/# (.*?)(\n|$)/g, '<h1 class="text-lg font-bold">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-200 rounded px-1">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/^- (.*?)$/gm, '<li>$1</li>'),
        }}
      />
    ))}
  </div>
);

const CopyFull = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs mt-1 text-gray-600 underline hover:text-black flex items-center gap-1"
    >
      {copied ? <FaCheck /> : <FaRegCopy />} {copied ? 'Copied' : 'Copy Full'}
    </button>
  );
};

const HomePage = () => {
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [typedSegments, setTypedSegments] = useState([]);
  const [isTypingDone, setIsTypingDone] = useState(true);
  const [lastTypedChatId, setLastTypedChatId] = useState(null);

  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user-info'));
  } catch {
    user = null;
  }
  const email = user?.email || '';

  const fetchSession = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/conversation/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id }),
      });
      const { data } = await res.json();
      setSessionData(data);
    } catch (e) {
      console.error('Fetch session error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const submitPrompt = async () => {
    if (!prompt.trim()) return;
    setLoadingResponse(true);
    setIsTypingDone(false);
    setTypedSegments([]);
    clearTimeout(typingTimeoutRef.current);

    try {
      const res = await fetch(`${API_URL}/conversation/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, email, conversationId: currentSessionId }),
      });
      const { data } = await res.json();
      setSessionData(data);
      const latest = data.chats[data.chats.length - 1];
      setLastTypedChatId(latest._id);
      if (!currentSessionId) setCurrentSessionId(data._id);
    } catch (e) {
      console.error('Prompt error:', e);
      setIsTypingDone(true);
    } finally {
      setLoadingResponse(false);
      setPrompt('');
    }
  };

  useEffect(() => {
    if (currentSessionId) fetchSession(currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    if (sessionData?.chats?.length && lastTypedChatId) {
      const lastChat = sessionData.chats.find(c => c._id === lastTypedChatId);
      const segments = splitResponse(lastChat?.response || '');

      // Separate text and code segments
      const textSegments = segments.filter(s => s.type === 'text');
      const codeSegments = segments.filter(s => s.type === 'code');

      setTypedSegments([]);
      setIsTypingDone(false);
      let textIndex = 0;
      let charIndex = 0;
      let currentSegments = [];

      function typeNext() {
        if (textIndex >= textSegments.length) {
          // Append code segments after typing text is complete
          setTypedSegments([...currentSegments, ...codeSegments]);
          setIsTypingDone(true);
          return;
        }

        const fullText = textSegments[textIndex].content;
        if (!currentSegments[textIndex]) currentSegments[textIndex] = { type: 'text', content: '' };

        currentSegments[textIndex].content += fullText[charIndex];
        setTypedSegments([...currentSegments]);

        charIndex++;
        if (charIndex < fullText.length) {
          typingTimeoutRef.current = setTimeout(typeNext, 4);
        } else {
          textIndex++;
          charIndex = 0;
          typingTimeoutRef.current = setTimeout(typeNext, 50);
        }
      }

      typeNext();

      return () => clearTimeout(typingTimeoutRef.current);
    }
  }, [sessionData, lastTypedChatId]);



  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [sessionData, typedSegments]);

  const startNewChat = () => {
    clearTimeout(typingTimeoutRef.current);
    setCurrentSessionId('');
    setSessionData(null);
    setTypedSegments([]);
    setLoadingResponse(false);
    setIsTypingDone(true);
    setLastTypedChatId(null);
  };

  return (
    <section className="flex flex-col w-screen h-screen bg-white text-gray-900">
      <Header home setCurrentSessionId={setCurrentSessionId} startNewChat={startNewChat} />
      <div className="flex flex-grow overflow-hidden">
        <div className="flex flex-col flex-grow overflow-hidden">
          <div ref={chatContainerRef} className="flex flex-col flex-grow px-6 py-4 space-y-6 overflow-y-auto">
            {isLoading ? (
              <div className="text-center text-gray-500 mt-10">
                <div className="w-8 h-8 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">Loading session…</p>
              </div>
            ) : sessionData?.chats?.length ? (
              sessionData.chats.map((chat, idx) => {
                const isLast = chat._id === lastTypedChatId;
                const responseSegments = isLast ? typedSegments : splitResponse(chat.response || '');

                return (
                  <div key={chat._id || idx} className="py-4 border-b space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-indigo-600">You:</p>
                      <span className="text-sm text-gray-500">{moment(chat.date).format('lll')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="italic">{chat.prompt}</p>
                      <CopyFull text={chat.prompt} />
                    </div>
                    <p className="font-semibold text-indigo-600">Bot:</p>
                    <div className="relative">
                      {responseSegments.map((seg, i) =>
                        seg.type === 'code' ? <CodeBlock key={i} code={seg.content} /> : <TextBlock key={i} text={seg.content} />
                      )}
                      {isLast && !isTypingDone && (
                        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                          Thinking...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 mt-10">Start a new chat!</p>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center px-4 py-2 border rounded-lg shadow-md">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="flex-grow px-4 py-2 bg-white text-gray-800 outline-none"
                disabled={loadingResponse}
              />
              <button
                onClick={submitPrompt}
                disabled={loadingResponse || !prompt.trim()}
                className={`px-6 py-2 font-semibold text-white rounded ${loadingResponse ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loadingResponse ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Thinking
                  </div>
                ) : (
                  'Ask'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
