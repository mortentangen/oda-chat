# Oda Shopping Assistant

En intelligent chat-assistent integrert med Oda for shopping-oppgaver, bygget med Next.js, Vercel AI SDK og Tailwind CSS.

## 🛒 Funksjoner

- **Produktsøk**: Søk etter produkter på Oda med naturlig språk
- **Handlekurv-håndtering**: Se innhold, priser og gebyrer i handlekurven
- **Legg til produkter**: Legg produkter direkte til handlekurven via chat
- **Streaming responses**: Sanntids svar med AI SDK

## 🚀 Kom i gang

### Forutsetninger

- Node.js 18+ 
- Oda-konto med tilgang til API

### Installasjon

1. Klon repositoriet:
```bash
git clone <repository-url>
cd oda-chat
```

2. Installer avhengigheter:
```bash
npm install
```

3. Opprett `.env.local` fil:
```bash
ODA_COOKIE=din_oda_cookie_her
OPENAI_API_KEY=din_openai_api_key_her
```

4. Start utviklingsserveren:
```bash
npm run dev
```

5. Åpne [http://localhost:3000](http://localhost:3000) i nettleseren

## 🔧 Konfigurasjon

### Miljøvariabler

Opprett en `.env.local` fil i prosjektroten:

```env
ODA_COOKIE=din_oda_cookie_her
OPENAI_API_KEY=din_openai_api_key_her
```

**Hvordan få ODA_COOKIE:**
1. Logg inn på [oda.com](https://oda.com)
2. Åpne Developer Tools (F12)
3. Gå til Network-fanen
4. Gjør en handling på siden (f.eks. søk etter et produkt)
5. Finn en request til `oda.com` og kopier Cookie-headeren

**Hvordan få OPENAI_API_KEY:**
1. Gå til [OpenAI Platform](https://platform.openai.com/api-keys)
2. Logg inn eller opprett en konto
3. Klikk "Create new secret key"
4. Kopier API-nøkkelen (starter med `sk-`)

## 🛠️ Teknisk Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Vercel AI SDK med OpenAI GPT-4
- **Markdown**: react-markdown
- **Testing**: Jest

## 🧪 Testing

Kjør tester:
```bash
npm test
```

## 📝 Bruk

### Eksempel-spørsmål

**Produktsøk:**
- "Søk etter smør"
- "Finn melk"
- "Hva koster brød?"

**Handlekurv:**
- "Hva har jeg i handlekurven?"
- "Hvor mye koster det?"
- "List ut handlelisten"

**Legg til produkter:**
- "Legg til smør i handlekurven"
- "Jeg vil ha 2 stk melk"
- "Kjøp 3 stk epler"

## 🔒 Sikkerhet

- **Ikke commit miljøvariabler**: `.env*` filer er ekskludert fra git
- **API-nøkler**: Hold ODA_COOKIE sikker og ikke del den
- **Rate limiting**: Respekter Oda's API-begrensninger

## 🤝 Bidrag

1. Fork prosjektet
2. Opprett en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit endringene (`git commit -m 'Add some AmazingFeature'`)
4. Push til branchen (`git push origin feature/AmazingFeature`)
5. Opprett en Pull Request

## 📄 Lisens

Dette prosjektet er lisensiert under MIT License - se [LICENSE](LICENSE) filen for detaljer.

## ⚠️ Disclaimer

Dette er et uoffisielt prosjekt og er ikke tilknyttet Oda. Bruk på egen risiko og respekter Oda's brukervilkår.
