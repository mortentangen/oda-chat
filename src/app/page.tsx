'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat'
  });

  return (
    <main className="p-4 max-w-xl mx-auto">
      {messages.map((m) => (
        <div key={m.id} className="my-2">
          <strong>{m.role}:</strong>{' '}
          {m.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null
          )}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          className="border px-2 py-1 w-full"
          placeholder="Spør om bruker..."
        />
      </form>
    </main>
  );
}
