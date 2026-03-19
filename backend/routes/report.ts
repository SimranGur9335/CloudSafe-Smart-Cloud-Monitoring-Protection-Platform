import express from 'express';
import { readCSV } from '../utils/csvHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', authMiddleware, (req, res) => {
  const resources = readCSV('resources.csv');
  const alerts = readCSV('alerts.csv');

  const totalResources = resources.length;
  const activeAlerts = alerts.filter((a: any) => a.status === 'Active').length;
  
  const severityCounts = {
    Critical: alerts.filter((a: any) => a.severity === 'Critical' && a.status === 'Active').length,
    High: alerts.filter((a: any) => a.severity === 'High' && a.status === 'Active').length,
    Medium: alerts.filter((a: any) => a.severity === 'Medium' && a.status === 'Active').length,
    Low: alerts.filter((a: any) => a.severity === 'Low' && a.status === 'Active').length,
  };

  // Calculate security score
  // Start with 100, subtract points for active alerts
  let score = 100;
  score -= (severityCounts.Critical * 20);
  score -= (severityCounts.High * 10);
  score -= (severityCounts.Medium * 5);
  score -= (severityCounts.Low * 2);
  score = Math.max(0, score);

  res.json({
    securityScore: score,
    totalResources,
    activeAlerts,
    riskDistribution: severityCounts
  });
});

export default router;
