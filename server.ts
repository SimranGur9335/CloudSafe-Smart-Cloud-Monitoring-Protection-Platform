import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDB } from './db';
import { detectAnomalies } from './services/anomaly';

const JWT_SECRET = process.env.JWT_SECRET || 'cloudsafe-super-secret-key';

async function startServer() {
  const db = await initDB(); // ✅ FIXED

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const result = await db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const token = jwt.sign({ id: result.lastID, email }, JWT_SECRET);
      res.json({ token, user: { id: result.lastID, name, email } });
    } catch (err) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any;

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // --- API Routes ---
  app.get('/api/resources', async (req, res) => {
    const resources = await db.all('SELECT * FROM resources');
    res.json(resources);
  });

  app.get('/api/alerts', async (req, res) => {
    const alerts = await db.all('SELECT * FROM alerts ORDER BY timestamp DESC');
    res.json(alerts);
  });

  app.get('/api/logs', async (req, res) => {
    const logs = await db.all('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
    res.json(logs);
  });

  app.post('/api/scan', async (req, res) => {
    const event = 'Manual Network Scan';
    const severity = Math.random() > 0.8 ? 'medium' : 'info';

    await db.run(
      'INSERT INTO logs (event, severity, metadata) VALUES (?, ?, ?)',
      [event, severity, JSON.stringify({ source: 'admin', timestamp: new Date().toISOString() })]
    );

    io.emit('new-log', { event, severity, timestamp: new Date().toISOString() });
    res.json({ status: 'Scan completed' });
  });

  app.post('/api/detect-anomaly', async (req, res) => {
    const logs = await db.all('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50') as any[];
    const anomalies = detectAnomalies(logs);
    res.json({ anomalies });
  });

  // --- Zero Trust Simulation ---
  app.post('/api/verify-trust', (req, res) => {
    const { ip, deviceId } = req.body;
    const isTrusted = ip.startsWith('192.168') && deviceId.length > 10;

    res.json({
      decision: isTrusted ? 'ALLOW' : 'DENY',
      reason: isTrusted ? 'Trusted network and device' : 'Untrusted source detected',
      timestamp: new Date().toISOString()
    });
  });

  // --- Socket.io ---
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    const interval = setInterval(() => {
      const events = ['Packet Analysis', 'Port Scan', 'Firewall Update', 'DDoS Mitigation'];
      const event = events[Math.floor(Math.random() * events.length)];
      const severity = Math.random() > 0.9 ? 'high' : (Math.random() > 0.7 ? 'medium' : 'info');

      socket.emit('live-update', {
        type: 'log',
        data: { event, severity, timestamp: new Date().toISOString() }
      });

      if (severity === 'high') {
        socket.emit('live-update', {
          type: 'alert',
          data: { description: `High severity: ${event}`, severity, timestamp: new Date().toISOString() }
        });
      }
    }, 5000);

    socket.on('disconnect', () => clearInterval(interval));
  });

  // ✅ TEMP FIX: disable vite (avoids tsx crash)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log("⚠️ Vite disabled - running backend only");
}

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 CloudSafe running at http://localhost:${PORT}`);
  });
}

startServer();