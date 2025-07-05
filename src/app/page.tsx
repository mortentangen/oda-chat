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
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToLatestUserMessage = () => {
    if (chatContainerRef.current) {
      const userMessages = chatContainerRef.current.querySelectorAll('[data-role="user"]');
      
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement;
        
        lastUserMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTimeout(() => {
        handleSubmit(e);
        // Scroll etter at meldingen er lagt til
        setTimeout(scrollToLatestUserMessage, 200);
      }, 10);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header session={session} />



      {!session?.user && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Vennligst logg inn</h2>
            <p className="mb-8 text-gray-600">Du må være logget inn for å bruke chat-assistenten.</p>
            <LoginButton />
        </div>
      )}

      {session?.user && (
        <>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8 relative">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Velkommen til Oda Shopping Assistant!</h3>
                  <p className="text-gray-500">Prøv å spørre meg om produkter eller handlekurven din.</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex py-1 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`} data-role={m.role}>
                  <div className={`max-w-3xl p-4 rounded-2xl shadow-sm w-11/12 sm:w-3/4 ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${
                      m.role === 'user' ? 'prose-invert' : ''
                    }`}>
                      <CustomMarkdown content={m.content} role={m.role} />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Legg til plass under meldingene slik at siste melding kan scroller til toppen */}
              <div className="h-screen"></div>
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