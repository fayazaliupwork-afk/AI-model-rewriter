
import { SystemNode, SystemLink } from './types';

export const INITIAL_NODES: SystemNode[] = [
  { id: 'n1', label: 'Auth Monolith', type: 'service', status: 'legacy', details: 'Node.js v12, Express, Sync Auth', pos: { x: 100, y: 100 } },
  { id: 'n2', label: 'User DB (Postgres)', type: 'database', status: 'healthy', details: 'Customer Profiles, RBAC', pos: { x: 300, y: 50 } },
  { id: 'n3', label: 'Inventory DB (Mongo)', type: 'database', status: 'unoptimized', details: 'Duplicate User Meta Data', pos: { x: 300, y: 200 } },
  { id: 'n4', label: 'Legacy SOAP API', type: 'api', status: 'bottleneck', details: 'ERP Integration, 800ms Latency', pos: { x: 500, y: 100 } },
  { id: 'n5', label: 'Payment Gateway', type: 'api', status: 'healthy', details: 'Stripe Integration', pos: { x: 500, y: 250 } },
  { id: 'n6', label: 'Analytics Pipeline', type: 'queue', status: 'legacy', details: 'Batch processed nightly', pos: { x: 100, y: 250 } },
];

export const INITIAL_LINKS: SystemLink[] = [
  { source: 'n1', target: 'n2', latency: 15, type: 'sync' },
  { source: 'n1', target: 'n3', latency: 45, type: 'sync' },
  { source: 'n1', target: 'n4', latency: 850, type: 'legacy' },
  { source: 'n1', target: 'n6', latency: 2000, type: 'async' },
  { source: 'n4', target: 'n5', latency: 120, type: 'sync' },
];

export const SYSTEM_HEALTH_METRICS = [
  { name: 'Jan', latency: 450, cost: 2400, aiScore: 30 },
  { name: 'Feb', latency: 420, cost: 2350, aiScore: 35 },
  { name: 'Mar', latency: 510, cost: 2600, aiScore: 32 },
  { name: 'Apr', latency: 380, cost: 2100, aiScore: 40 },
];
