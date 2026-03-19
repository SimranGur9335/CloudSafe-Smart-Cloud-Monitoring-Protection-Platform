import express from 'express';
import { readCSV, writeCSV } from '../utils/csvHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const RESOURCES_FILE = 'resources.csv';

// Pre-populate if empty
const initialResources = [
  { resource_id: 'res-1', provider: 'AWS', type: 'S3 Bucket', configuration: 'public', security_status: 'Critical' },
  { resource_id: 'res-2', provider: 'Azure', type: 'VM', configuration: 'open ports', security_status: 'High' },
  { resource_id: 'res-3', provider: 'GCP', type: 'Database', configuration: 'unencrypted', security_status: 'Medium' },
  { resource_id: 'res-4', provider: 'AWS', type: 'IAM Role', configuration: 'weak policy', security_status: 'High' },
  { resource_id: 'res-5', provider: 'AWS', type: 'EC2', configuration: 'encrypted', security_status: 'Secure' },
];

router.get('/', authMiddleware, (req, res) => {
  let resources = readCSV(RESOURCES_FILE);
  if (resources.length === 0) {
    writeCSV(RESOURCES_FILE, initialResources);
    resources = initialResources;
  }
  res.json(resources);
});

export default router;
