import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getCart, searchProducts, addToCart, emptyCart } from './odaApi';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Keep only the last n messages to save on tokens
  const recentMessages = messages.slice(-1);

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      system: `Du er en handleassistent for Oda. Vær hjelpsom og svar på norsk.
- Bruk **alltid** verktøy for å svare på spørsmål om handlekurv eller produkter. Ikke gjett.
- Formater svarene dine med markdown for god lesbarhet. For produktsøk, vis de 5-10 første treffene.

**Formatering for handlekurv:**
Bruk et format som dette, med et nytt punkt for hver vare:
## Din handlekurv
### Varer
- **[Varenavn]** - [Antall] stk - [Pris] NOK
- **[Neste varenavn]** - [Antall] stk - [Pris] NOK
### Oppsummering
- **Totalpris:** [Totalpris] NOK

**Formatering for produktsøk:**
Bruk et format som dette, med en blank linje mellom hvert produkt:
## Søkeresultat for "[søkeord]"
### [Produktnavn]
- **Pris:** [Pris] NOK
- **Info:** [Størrelse], [Enhetspris]
- **Tilgjengelighet:** [Tilgjengelighet]

### [Neste produktnavn]
- **Pris:** [Pris] NOK
- **Info:** [Størrelse], [Enhetspris]
- **Tilgjengelighet:** [Tilgjengelighet]
`,
      messages: recentMessages,
      tools: {
        getOdaHandleliste: {
          description: 'Henter brukerens handlekurv fra Oda. Brukes for å svare på spørsmål om innhold, pris og gebyrer i kurven.',
          parameters: z.object({}),
          execute: getCart
        },
        searchProducts: {
          description: 'Søker etter produkter på Oda. Brukes når brukeren vil finne varer.',
          parameters: z.object({
            query: z.string().describe('Søkeord for å finne produkter (f.eks. "smør", "melk")')
          }),
          execute: async ({ query }: { query: string }) => {
            return await searchProducts(query);
          }
        },
        addToCart: {
          description: 'Legger til eller fjerner et produkt fra handlekurven. Krever produkt-ID fra et søk.',
          parameters: z.object({
            productId: z.number().describe('Produktets ID (må være et tall)'),
            quantity: z.number().default(1).describe('Antall som skal legges til. Bruk negativt tall for å fjerne.')
          }),
          execute: async ({ productId, quantity }: { productId: number, quantity: number }) => {
            return await addToCart(productId, quantity);
          }
        },
        emptyCart: {
          description: 'Tømmer hele handlekurven.',
          parameters: z.object({}),
          execute: emptyCart
        }
      },
      maxSteps: 5,
      toolChoice: 'auto'
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error('Feil i generateText:', e);
    return new Response('Intern feil: ' + (e instanceof Error ? e.message : String(e)), { status: 500 });
  }
}
