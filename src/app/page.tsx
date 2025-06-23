'use client';
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { LoginButton } from "./components/Auth";
import { CustomMarkdown } from "./components/CustomMarkdown";
import { Header } from "./components/Header";
import { ChatFooter } from "./components/ChatFooter";

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
      <Header session={session} />

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
                      <CustomMarkdown content={m.content} role={m.role} />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatFooter 
            input={input}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
          />
        </>
      )}
    </div>
  );
}

export default Chat;