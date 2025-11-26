# ChatBuddy.AI — Study Assistant (MERN + Ollama)

An open‑source **MERN** web app that lets students chat with a **local AI Study Assistant** powered by **Ollama** (no cloud quotas). Users can log in, create multiple chat sessions, and store conversation history in **MongoDB**. The backend connects to a locally running **Ollama** model (e.g., `llama3`, `mistral`, or `phi3`).

---

## ✨ Features
- **Local AI** via **Ollama** — no external API keys required
- **Multi‑session chat** with titles and timestamps
- **Auth**: Register/Login with JWT
- **Persistent history** in MongoDB (users, sessions, messages)
- **Model selector**: choose `llama3`, `mistral`, `phi3` per session
- **Clean UI** with React + Tailwind
- **Rate limiting** & validation on server endpoints

---

## 🧱 Architecture
```
chatbuddy-ai/
├── client/                      # React (Vite) + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/             # Auth + session context
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                      # Node + Express
│   ├── models/
│   │   ├── User.js
│   │   └── ChatSession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimit.js
│   ├── utils/
│   │   └── sanitize.js
│   ├── server.js
│   ├── .env (local)
│   └── package.json
└── README.md
```

---

## 🧰 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **DB:** MongoDB, Mongoose
- **AI:** Ollama (local LLMs like `llama3`, `mistral`, `phi3`)
- **Auth:** JWT + bcrypt
- **Tooling:** ESLint, Prettier, Vitest/Jest (optional)

---

## 🖥️ Prerequisites
- **Node.js** >= 18
- **MongoDB** (local or Atlas)
- **Ollama** installed locally and running
  - Install: https://ollama.com
  - Pull a model (example): `ollama pull llama3`
  - Start service (usually auto-starts): `ollama serve`
- **pnpm** or **npm**

---

## ⚙️ Setup & Run (Dev)

### 1) Clone
```bash
git clone https://github.com/oleglihvoinen/chatbuddy-ai.git
cd chatbuddy-ai
```

### 2) Server
```bash
cd server
npm install
# .env example:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/chatbuddy
# JWT_SECRET=supersecret
# OLLAMA_BASE_URL=http://localhost:11434
npm run dev
```
Server will run on `http://localhost:5001`.

### 3) Client
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Client will run on `http://localhost:5173` (Vite default).

> Ensure **Ollama** is running (`ollama serve`) and that you've pulled your chosen model, e.g. `ollama pull llama3`.

---

## 🔌 API Overview

### Auth
- `POST /api/auth/register` — { email, password }
- `POST /api/auth/login` — { email, password }
- Uses JWT in `Authorization: Bearer <token>`

### Chat
- `POST /api/chat/sessions` — create a session { title?, model? }
- `GET /api/chat/sessions` — list sessions for the current user
- `GET /api/chat/sessions/:id` — get session + messages
- `POST /api/chat/sessions/:id/message` — send a user message and stream AI reply
- `DELETE /api/chat/sessions/:id` — delete session

---

## 🧩 Sample: Server → Ollama
```js
// server/controllers/chatController.js
import fetch from "node-fetch";

export async function sendToOllama({ prompt, model = "llama3" }) {
  const res = await fetch(`${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false })
  });
  if (!res.ok) throw new Error("Ollama request failed");
  const data = await res.json();
  return data.response;
}
```
> For long responses and better UX, consider **streaming** (Server-Sent Events) using `/api/chat` with `stream: true`.

---

## 🗃️ Data Models (Mongoose)
```js
// User.js
{
  email: String, passwordHash: String, createdAt: Date
}

// ChatSession.js
{
  userId: ObjectId,
  title: String,
  model: { type: String, default: "llama3" },
  messages: [
    { role: "user" | "assistant", content: String, ts: Date }
  ],
  createdAt: Date, updatedAt: Date
}
```

---

## 🔐 Security
- Hash passwords (bcrypt)
- Validate & sanitize input (`express-validator` + custom sanitize)
- JWT with short expiry + refresh flow (optional)
- CORS locked to client origin in production
- Basic **rate limiting** on chat routes

---

## 🧪 Testing (optional)
- Unit test controllers/services
- Mock Ollama endpoint
- Test Mongo models with in-memory server

---

## 🚀 Deployment Notes
Because **Ollama** runs locally, recommended setups:
- **Local dev:** both client and server local; Ollama on your machine.
- **LAN lab/classroom:** run Ollama on a workstation; clients connect to your server that proxies Ollama.
- **Self-hosted:** deploy backend on a machine where Ollama is installed. Expose client via Vercel/Netlify.

> If deploying the backend to a cloud provider, ensure the VM supports Ollama (Linux/macOS).

---

## 🖼️ Screenshots (placeholders)
- `/docs/screenshot-login.png`
- `/docs/screenshot-chat.png`
- `/docs/screenshot-sessions.png`

---

## 📄 License
MIT
