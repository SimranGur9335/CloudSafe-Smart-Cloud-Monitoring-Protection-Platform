import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cloudsafe-secret-key';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // --- ZERO TRUST SIMULATION ---
    // In a real Zero Trust model, we verify more than just the token
    const deviceTrust = req.headers['x-device-trust'] || 'trusted';
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    // Simulate IP validation (e.g., blocking specific ranges)
    const blockedIps = ['1.2.3.4', '9.9.9.9'];
    if (blockedIps.includes(clientIp)) {
      return res.status(403).json({ 
        message: 'Zero Trust Violation: Suspicious IP Address Detected',
        code: 'ZT_IP_BLOCKED'
      });
    }

    // Simulate Device Trust check
    if (deviceTrust === 'untrusted') {
      return res.status(403).json({ 
        message: 'Zero Trust Violation: Untrusted Device Attempting Access',
        code: 'ZT_DEVICE_UNTRUSTED'
      });
    }

    // Every request is verified
    console.log(`[Zero Trust] Verified request for user ${req.user.id} from ${clientIp}`);
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
