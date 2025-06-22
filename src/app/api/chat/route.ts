import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getCart } from './odaApi';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      system: 'Du er en assistent for handling hos Oda. Du kan typisk liste ut handlekurv, legge til ordre, etc',
      messages,
      tools: {
//        getUserInfo: {
//          description: 'Hent brukerinfo basert på ID',
//          parameters: z.object({
//            userId: z.number().int().describe('ID på brukeren')
//          }),
//          execute: async ({ userId }) => {
//            console.log('Fetching user', userId);
//            const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
//            const user = await res.json();
//            console.log(user);
//            return { name: user.name, email: user.email };
//          }
//        },
        getOdaHandleliste: {
          description: 'Hent handlelisten min fra Oda',
          parameters: z.object({}), // ingen ekstra parametere
          execute: getCart
        }

      },
      toolChoice: 'auto'
    });

//    const text = await result.text;
//    return new Response(text);
    return result.toDataStreamResponse();
  } catch (e) {
    console.error('Feil i generateText:', e);
    return new Response('Intern feil: ' + (e instanceof Error ? e.message : String(e)), { status: 500 });
  }
}
