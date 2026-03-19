import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readCSV, appendCSV } from '../utils/csvHandler';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cloudsafe-secret-key';
const USERS_FILE = 'users.csv';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const users = readCSV(USERS_FILE) as User[];

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
  };

  appendCSV(USERS_FILE, newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readCSV(USERS_FILE) as User[];
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
