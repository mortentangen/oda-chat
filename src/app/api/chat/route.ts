import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getCart, searchProducts } from './odaApi';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      system: `Du er en assistent for handling hos Oda. 

VIKTIG: Når brukeren spør om handlekurv, handleliste, varer, priser, eller hva som er i kurven - BRUK ALLTID getOdaHandleliste tool-et for å hente oppdatert informasjon. Ikke gjett eller svar basert på tidligere informasjon.

Når brukeren spør om å søke etter produkter, søk etter matvarer, eller vil finne spesifikke varer - BRUK ALLTID searchProducts tool-et.

Eksempler på spørsmål som krever getOdaHandleliste:
- "Hva har jeg i handlekurven?"
- "List ut handlelisten"
- "Hva koster det?"
- "Hvor mange varer har jeg?"
- "Hva er prisen på emballasje?"
- "Hvor mye koster frakt?"

Eksempler på spørsmål som krever searchProducts:
- "Søk etter smør"
- "Finn melk"
- "Hva koster brød?"
- "Vis meg frukt"
- "Søk etter økologiske varer"

Etter at du har hentet data med getOdaHandleliste, formater svaret ditt tydelig med:
- Liste over varer med navn, antall og pris
- Oppsummering av totalpris og antall varer  
- Gebyrer (emballasje, frakt, etc.)
- Fremdrift mot rabatter hvis relevant

Etter at du har søkt etter produkter, formater svaret ditt tydelig med:
- Liste over produkter med navn, merke, pris og størrelse
- Tilgjengelighet for hvert produkt
- Viktige merker/klassifikasjoner hvis relevante

Svar alltid på norsk.`,
      messages,
      tools: {
        getOdaHandleliste: {
          description: 'Hent handlelisten min fra Oda. Returnerer en forenklet struktur med: items (varene med navn, antall, pris), summary (totalt antall varer, delsum, totalpris), fees (tillegg som emballasje og mindre bestilling), og progress (informasjon om rabatter ved høyere beløp). Bruk denne informasjonen til å svare på spørsmål om hva som er i handlekurven, priser, og gebyrer.',
          parameters: z.object({}),
          execute: getCart
        },
        searchProducts: {
          description: 'Søk etter produkter på Oda basert på søkeord. Returnerer en forenklet liste med produkter som inneholder: navn, merke, størrelse, pris, enhetspris, tilgjengelighet, URL og viktige merker/klassifikasjoner. Bruk denne for å finne produkter når brukeren spør om spesifikke varer eller ønsker å søke etter matvarer.',
          parameters: z.object({
            query: z.string().describe('Søkeordet for å finne produkter (f.eks. "smør", "melk", "brød")')
          }),
          execute: async ({ query }) => {
            return await searchProducts(query);
          }
        }
      },
      onStepFinish: (step) => {
        console.log('FINISHED STEP', JSON.stringify(step, null, 2));
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
