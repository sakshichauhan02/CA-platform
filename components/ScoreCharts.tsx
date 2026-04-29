"use client"

import React, { useEffect, useState } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'

interface TopicScores {
  [key: string]: number
}

interface ScoreChartsProps {
  topicScores: TopicScores
}

const ScoreCharts = ({ topicScores }: ScoreChartsProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = Object.entries(topicScores).map(([subject, score]) => ({
    subject,
    score,
    fullMark: 100,
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto py-8">
        <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl" />
        <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto py-8">
      {/* Radar Chart Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
        <div className="flex flex-col mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Topic Proficiency Radar</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Visual representation of your strengths across subjects</p>
        </div>
        <div className="h-[350px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
        <div className="flex flex-col mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Subject-wise Analysis</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed score comparison for current performance</p>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="subject" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ScoreCharts
