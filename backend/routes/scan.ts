import express from 'express';
import { readCSV, writeCSV, appendCSV } from '../utils/csvHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const RESOURCES_FILE = 'resources.csv';
const ALERTS_FILE = 'alerts.csv';

router.post('/', authMiddleware, (req, res) => {
  const resources = readCSV(RESOURCES_FILE);
  const alerts = readCSV(ALERTS_FILE);
  
  const newAlerts: any[] = [];
  
  resources.forEach((res: any) => {
    if (res.security_status !== 'Secure') {
      const existingAlert = alerts.find((a: any) => a.resource_id === res.resource_id && a.status === 'Active');
      if (!existingAlert) {
        const alert = {
          alert_id: `alt-${Date.now()}-${res.resource_id}`,
          resource_id: res.resource_id,
          severity: res.security_status,
          description: `Security risk detected: ${res.configuration} on ${res.type}`,
          timestamp: new Date().toISOString(),
          status: 'Active'
        };
        newAlerts.push(alert);
        appendCSV(ALERTS_FILE, alert);
      }
    }
  });

  res.json({ message: 'Scan complete', alertsFound: newAlerts.length });
});

// AI Analyze Mock (Since we can't easily run FastAPI in this preview, we implement the logic here)
router.post('/analyze', authMiddleware, (req, res) => {
  const { configuration } = req.body;
  
  let risk_score = 0;
  let severity = 'Low';
  let recommended_fix = 'No issues found.';

  if (configuration.includes('public')) {
    risk_score = 95;
    severity = 'Critical';
    recommended_fix = 'Disable public access immediately and restrict to specific IAM roles.';
  } else if (configuration.includes('open ports')) {
    risk_score = 80;
    severity = 'High';
    recommended_fix = 'Close unnecessary ports and implement a firewall or security group.';
  } else if (configuration.includes('weak policy')) {
    risk_score = 75;
    severity = 'High';
    recommended_fix = 'Apply the principle of least privilege and update IAM policies.';
  } else if (configuration.includes('unencrypted')) {
    risk_score = 60;
    severity = 'Medium';
    recommended_fix = 'Enable encryption at rest using KMS or provider-managed keys.';
  }

  res.json({ risk_score, severity, recommended_fix });
});

export default router;
