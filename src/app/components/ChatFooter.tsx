'use client';

import React from "react";

interface ChatFooterProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export const ChatFooter = ({ input, handleInputChange, handleFormSubmit }: ChatFooterProps) => {
  return (
    <div className="p-4 sm:p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleFormSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            className="flex-1 border border-gray-300 rounded-xl px-4 sm:px-6 py-2 sm:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-base sm:text-lg text-gray-900"
            placeholder="Søk etter produkter..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}; 