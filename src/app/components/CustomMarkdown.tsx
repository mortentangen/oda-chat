'use client';

import ReactMarkdown from "react-markdown";

interface CustomMarkdownProps {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
}

export const CustomMarkdown = ({ content, role }: CustomMarkdownProps) => {
  return (
    <ReactMarkdown
      components={{
        h2: ({children}) => (
          <h2 className={`text-lg font-bold mt-4 mb-2 ${
            role === 'user' ? 'text-white' : 'text-gray-800'
          }`}>
            {children}
          </h2>
        ),
        h3: ({children}) => (
          <h3 className={`text-md font-semibold mt-3 mb-1 ${
            role === 'user' ? 'text-blue-100' : 'text-gray-700'
          }`}>
            {children}
          </h3>
        ),
        strong: ({children}) => (
          <strong className={`font-semibold ${
            role === 'user' ? 'text-white' : 'text-gray-800'
          }`}>
            {children}
          </strong>
        ),
        ul: ({children}) => (
          <ul className={`list-disc list-inside space-y-1 my-2 ${
            role === 'user' ? 'text-blue-100' : 'text-gray-700'
          }`}>
            {children}
          </ul>
        ),
        li: ({children}) => (
          <li className={role === 'user' ? 'text-blue-100' : 'text-gray-700'}>
            {children}
          </li>
        ),
        p: ({children}) => (
          <p className={`mb-2 ${
            role === 'user' ? 'text-blue-100' : 'text-gray-700'
          }`}>
            {children}
          </p>
        ),
        a: ({href, children}) => (
          <a
            href={href}
            className={`underline ${
              role === 'user'
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
      {content}
    </ReactMarkdown>
  );
}; 