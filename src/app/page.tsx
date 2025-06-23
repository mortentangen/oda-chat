'use client';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { LoginButton, UserMenu } from "./components/Auth";

const Chat = () => {
  const { data: session } = useSession();
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      scrollToBottom();
      setTimeout(() => {
        handleSubmit(e);
      }, 10);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-6 items-center">
          <div className="col-span-1" />

          <div className={`col-span-4 ${!session?.user ? "text-center" : ""}`}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Oda Shopping Assistant
            </h1>
            <p className="text-gray-600 text-lg">
              Spør meg om produkter eller handlekurven din! 🛒
            </p>
          </div>

          <div className="col-span-1 justify-self-end">
            {session?.user && <UserMenu />}
          </div>
        </div>
      </div>

      {status === 'submitted' && (
        <div className="flex-1 flex items-center justify-center">
            <p>Laster...</p>
        </div>
      )}

      {!session?.user && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Vennligst logg inn</h2>
            <p className="mb-8 text-gray-600">Du må være logget inn for å bruke chat-assistenten.</p>
            <LoginButton />
        </div>
      )}

      {session?.user && (
        <>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Velkommen til Oda Shopping Assistant!</h3>
                  <p className="text-gray-500">Prøv å spørre meg om produkter eller handlekurven din.</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex py-1 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl p-4 rounded-2xl shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-white border border-gray-200 shadow-lg w-3/4'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${
                      m.role === 'user' ? 'prose-invert' : ''
                    }`}>
                      <ReactMarkdown
                        components={{
                          h2: ({children}) => (
                            <h2 className={`text-lg font-bold mt-4 mb-2 ${
                              m.role === 'user' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {children}
                            </h2>
                          ),
                          h3: ({children}) => (
                            <h3 className={`text-md font-semibold mt-3 mb-1 ${
                              m.role === 'user' ? 'text-blue-100' : 'text-gray-700'
                            }`}>
                              {children}
                            </h3>
                          ),
                          strong: ({children}) => (
                            <strong className={`font-semibold ${
                              m.role === 'user' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {children}
                            </strong>
                          ),
                          ul: ({children}) => (
                            <ul className={`list-disc list-inside space-y-1 my-2 ${
                              m.role === 'user' ? 'text-blue-100' : 'text-gray-700'
                            }`}>
                              {children}
                            </ul>
                          ),
                          li: ({children}) => (
                            <li className={m.role === 'user' ? 'text-blue-100' : 'text-gray-700'}>
                              {children}
                            </li>
                          ),
                          p: ({children}) => (
                            <p className={`mb-2 ${
                              m.role === 'user' ? 'text-blue-100' : 'text-gray-700'
                            }`}>
                              {children}
                            </p>
                          ),
                          a: ({href, children}) => (
                            <a 
                              href={href} 
                              className={`underline ${
                                m.role === 'user' 
                                  ? 'text-blue-200 hover:text-white' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          )
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleFormSubmit} className="flex gap-3">
                <input
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg text-gray-900"
                  placeholder="Søk etter produkter eller spør om handlekurven..."
                />
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;