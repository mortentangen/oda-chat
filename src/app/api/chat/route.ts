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

FORMATERING AV SVAR:

For produkt-søk (searchProducts):
Bruk denne strukturen:
\`\`\`
## Søkeresultat for "[søkeord]"

[Antall] produkter funnet:

### [Produktnavn]
- **Merke:** [Merke]
- **Størrelse:** [Størrelse]
- **Pris:** [Pris] NOK
- **Enhetspris:** [Enhetspris] NOK/[enhet]
- **Tilgjengelighet:** [Tilgjengelighet]
[Viktige merker hvis relevante]
\`\`\`

For handlekurv (getOdaHandleliste):
Bruk denne strukturen:
\`\`\`
## Din handlekurv

### Varer
[For hver vare:]
- **[Varenavn]** - [Antall] stk - [Pris] NOK

### Oppsummering
- **Antall varer:** [Antall]
- **Delsum:** [Delsum] NOK
- **Totalpris:** [Totalpris] NOK

### Gebyrer
[For hvert gebyr:]
- **[Gebyrnavn]:** [Beløp] NOK
- [Beskrivelse hvis tilgjengelig]

### Rabatter
[Informasjon om fremdrift mot rabatter hvis relevant]
\`\`\`

VIKTIG:
- Bruk markdown-formatering for bedre lesbarhet
- Hold svarene konsise men informative
- Vis kun de 5-10 første produktene ved søk
- Svar alltid på norsk
- Vær hjelpsom og vennlig`,
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
