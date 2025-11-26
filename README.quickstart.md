# ChatBuddy.AI — MERN + Ollama (llama3) Starter

## Quickstart
1) Install **MongoDB** and **Ollama**, then pull model:
```bash
ollama pull llama3
ollama serve
```
2) API
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
3) Client
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173 and register a user, then chat.
