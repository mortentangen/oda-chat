import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getCart, searchProducts, addToCart, emptyCart } from './odaApi';

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      system: `Du er en assistent for handling hos Oda. 

VIKTIG: Når brukeren spør om handlekurv, handleliste, varer, priser, eller hva som er i kurven - BRUK ALLTID getOdaHandleliste tool-et for å hente oppdatert informasjon. Ikke gjett eller svar basert på tidligere informasjon.

Når brukeren spør om å søke etter produkter, søk etter matvarer, eller vil finne spesifikke varer - BRUK ALLTID searchProducts tool-et.

Når brukeren ber om å legge til eller fjerne produkter i handlekurven - BRUK ALLTID addToCart tool-et med produktets ID fra et tidligere søk.

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

Eksempler på spørsmål som krever addToCart:
- "Legg til smør i handlekurven"
- "Jeg vil ha 2 stk melk"
- "Legg til brød"
- "Kjøp 3 stk epler"
- "Fjern smør fra handlekurven"
- "Oppdater antall smør til 2 stk"

Eksempler på spørsmål som krever emptyCart:
- "Tøm handlekurven"
- "Fjern alt fra handlekurven"
- "Slett alt fra handlekurven"
- "Fjern alle varer"

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

For å legge til produkter (addToCart):
Bruk denne strukturen:
\`\`\`
## Produkt lagt til i handlekurv

✅ **[Produktnavn]** - [Antall] stk lagt til i handlekurven

[Oppdatert handlekurv-informasjon hvis relevant]
\`\`\`

VIKTIG:
- Bruk markdown-formatering for bedre lesbarhet
- Hold svarene konsise men informative
- Vis kun de 5-10 første produktene ved søk
- Svar alltid på norsk
- Vær hjelpsom og vennlig
- Når du legger til produkter, bruk produktets ID fra et tidligere søk`,
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
        },
        addToCart: {
          description: 'Legg til eller fjern et produkt fra handlekurven. Bruk denne når brukeren ber om å legge til eller fjerne spesifikke produkter i handlekurven. Du må ha produktets ID fra et tidligere produkt-søk. Skal alt slettes må antallet hentes fra getOdaHandleliste tool-et først.',
          parameters: z.object({
            productId: z.number().describe('Produktets ID (må være et tall)'),
            quantity: z.number().default(1).describe('Antall av produktet å legge til (standard: 1). Fjerning av produkt gjøres ved å sette negativ quantity, f.eks. quantity: -1. Skal alt slettes må antallet som skal slettes hentes fra handlekurven først.')
          }),
          execute: async ({ productId, quantity }) => {
            return await addToCart(productId, quantity);
          }
        },
        emptyCart: {
          description: 'Tøm handlekurven. Bruk denne når brukeren ber om å tømme handlekurven.',
          parameters: z.object({}),
          execute: emptyCart
        }
      },
      onStepFinish: (step) => {
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
