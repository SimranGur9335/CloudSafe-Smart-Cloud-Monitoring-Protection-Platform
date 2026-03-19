import express from 'express';
import { readCSV, writeCSV } from '../utils/csvHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const ALERTS_FILE = 'alerts.csv';

router.get('/', authMiddleware, (req, res) => {
  const alerts = readCSV(ALERTS_FILE);
  res.json(alerts);
});

router.post('/resolve/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const alerts = readCSV(ALERTS_FILE);
  const updatedAlerts = alerts.map((a: any) => 
    a.alert_id === id ? { ...a, status: 'Resolved' } : a
  );
  writeCSV(ALERTS_FILE, updatedAlerts);
  res.json({ message: 'Alert resolved' });
});

export default router;
