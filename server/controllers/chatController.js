import fetch from 'node-fetch';
import ChatSession from '../models/ChatSession.js';

const OLLAMA = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export async function createSession(req, res) {
  const { title = '', model = process.env.DEFAULT_MODEL || 'llama3' } = req.body || {};
  const session = await ChatSession.create({
    userId: req.user.id, title, model, messages: []
  });
  res.status(201).json(session);
}

export async function listSessions(req, res) {
  const sessions = await ChatSession.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(sessions);
}

export async function getSession(req, res) {
  const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.json(session);
}

export async function deleteSession(req, res) {
  await ChatSession.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
}

export async function sendMessage(req, res) {
  const { content, model } = req.body;
  const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
  if (!session) return res.status(404).json({ message: 'Session not found' });

  // Save user message
  session.messages.push({ role: 'user', content });
  if (model) session.model = model;

  // Call Ollama (non-streaming for simplicity)
  const r = await fetch(`${OLLAMA}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: session.model || 'llama3', prompt: content, stream: false })
  });

  if (!r.ok) {
    return res.status(502).json({ message: 'Ollama request failed' });
  }
  const data = await r.json();
  const reply = data.response || '';

  // Save assistant reply
  session.messages.push({ role: 'assistant', content: reply });
  if (!session.title && content) {
    session.title = content.substring(0, 60);
  }
  await session.save();

  res.json({ reply, sessionId: session._id });
}
