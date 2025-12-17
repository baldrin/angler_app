import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { classifyDischarge, computeTrend } from './lib/flowLogic';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

interface User { id: number; email: string; password_hash: string; }
const users: User[] = [];

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: 'Exists' });
  const password_hash = await bcrypt.hash(password, 10);
  const user: User = { id: users.length + 1, email, password_hash };
  users.push(user);
  res.json({ id: user.id, email: user.email });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

app.get('/api/stations', async (req, res) => {
  // placeholder
  res.json([{ siteId: '0001', name: 'Demo Station', lat: 35, lon: -92 }]);
});

app.get('/api/stations/:siteId/realtime', async (req, res) => {
  const discharge = 1234;
  const classification = classifyDischarge(discharge);
  const trend = computeTrend([1200, discharge]);
  res.json({ discharge, gage: 4.2, classification, trend, timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
