import { IsolationForest } from 'ml-isolation-forest';

export interface LogEntry {
  id: number;
  event: string;
  severity: string;
  timestamp: string;
  metadata?: string;
}

export function detectAnomalies(logs: LogEntry[]) {
  if (logs.length < 10) return [];

  // Feature engineering: convert logs to numerical vectors
  // For simplicity, we'll use severity levels and event frequency
  const severityMap: Record<string, number> = {
    'info': 0,
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  };

  const data = logs.map(log => [
    severityMap[log.severity.toLowerCase()] || 0,
    log.event.length, // proxy for complexity
    new Date(log.timestamp).getHours() // time of day
  ]);

  const iforest = new IsolationForest({ nEstimators: 100 });
  iforest.train(data);

  const scores = iforest.getOutliers(data);
  
  // getOutliers returns an array of indices that are considered outliers
  return scores.map(index => logs[index]);
}
