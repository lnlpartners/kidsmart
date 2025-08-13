import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen } from 'lucide-react';

export default function SubjectPerformanceChart({ assignments }) {
  const subjectData = assignments.reduce((acc, a) => {
    if (!acc[a.subject]) {
      acc[a.subject] = { scores: [], count: 0 };
    }
    acc[a.subject].scores.push(a.score_percentage);
    acc[a.subject].count++;
    return acc;
  }, {});

  const data = Object.entries(subjectData).map(([subject, { scores, count }]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / count),
    count: count,
  }));

  const getBarColor = (score) => {
    if (score >= 90) return '#10b981'; // green-500
    if (score >= 80) return '#3b82f6'; // blue-500
    if (score >= 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600 font-medium">{`Average: ${data.averageScore}%`}</p>
          <p className="text-xs text-gray-500">{`${data.count} assignment${data.count > 1 ? 's' : ''}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <BookOpen className="w-5 h-5" />
          Performance by Subject
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getBarColor(entry.averageScore)} stopOpacity={0.9}/>
                  <stop offset="95%" stopColor={getBarColor(entry.averageScore)} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis 
              dataKey="subject" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="averageScore" 
              radius={[8, 8, 0, 0]}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}