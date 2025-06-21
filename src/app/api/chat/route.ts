import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages
  });

//  const result = streamText({
//    model: openai('gpt-4o'),
//    messages,
//    tools: {
//      getUserInfo: {
//        description: 'Hent brukerinfo basert på ID',
//        parameters: {
//          type: 'object',
//          properties: {
//            userId: { type: 'integer', description: 'ID på brukeren' }
//          },
//          required: ['userId']
//        },
//        execute: async ({ userId }) => {
//          const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
//          console.log('res', res);
//          const user = await res.json();
//          return { name: user.name, email: user.email };
//        }
//      }
//    },
//    toolChoice: 'auto'
//  });
//console.log('result', result);

  return result.toDataStreamResponse();
}
