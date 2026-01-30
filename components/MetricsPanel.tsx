
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SYSTEM_HEALTH_METRICS } from '../constants';

const MetricsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">System Latency (ms)</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SYSTEM_HEALTH_METRICS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Line type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">AI Readiness Score</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SYSTEM_HEALTH_METRICS}>
              <defs>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                itemStyle={{ color: '#8b5cf6' }}
              />
              <Area type="monotone" dataKey="aiScore" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
