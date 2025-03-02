import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Brain, Zap, Target, Sparkles } from 'lucide-react';

interface ActivityData {
  date: string;
  tasks: number;
  focusScore: number;
  energy: number;
  flowState: number;
  productivity: number;
}

interface EngagingActivityChartProps {
  data?: ActivityData[];
  selectedTimeframe: 'day' | 'week' | 'month';
}

export function EngagingActivityChart({ data: providedData, selectedTimeframe }: EngagingActivityChartProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  // Sample data with more interesting patterns
  const defaultData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: selectedTimeframe === 'day' ? 24 : selectedTimeframe === 'week' ? 7 : 30 }, (_, i) => {
      const date = new Date(today);
      if (selectedTimeframe === 'day') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      // Create more interesting patterns
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      const baseProductivity = Math.sin(i * 0.5) * 30 + 70; // Sine wave pattern
      
      return {
        date: date.toISOString(),
        tasks: Math.floor(Math.random() * 8 + (hour >= 9 && hour <= 17 ? 4 : 1)), // More tasks during work hours
        focusScore: Math.floor(baseProductivity + Math.random() * 20),
        energy: Math.floor(Math.cos(i * 0.3) * 30 + 60), // Cosine wave for energy
        flowState: Math.floor(Math.random() * 100),
        productivity: Math.floor(baseProductivity),
      };
    }).reverse();
  }, [selectedTimeframe]);

  const data = providedData || defaultData;

  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    if (selectedTimeframe === 'day') {
      return format(date, 'HH:mm');
    } else if (selectedTimeframe === 'week') {
      return format(date, 'EEE');
    }
    return format(date, 'MMM dd');
  };

  const metrics = [
    { key: 'all', label: 'All Metrics', icon: Sparkles, color: '#8b5cf6' },
    { key: 'productivity', label: 'Productivity', icon: Target, color: '#0ea5e9' },
    { key: 'energy', label: 'Energy', icon: Zap, color: '#f59e0b' },
    { key: 'flowState', label: 'Flow State', icon: Brain, color: '#ec4899' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    const date = new Date(label);
    const formattedDate = selectedTimeframe === 'day'
      ? format(date, 'HH:mm')
      : format(date, 'MMM dd, yyyy');

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl shadow-lg border border-neutral-200"
      >
        <p className="text-sm font-medium text-neutral-600 mb-3">{formattedDate}</p>
        <div className="space-y-2">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-neutral-600">
                <span className="font-medium">
                  {entry.name === 'flowState' || entry.name === 'energy'
                    ? `${entry.value}%`
                    : entry.value}
                </span>
                {' '}
                {entry.name.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-3">
        {metrics.map((metric) => (
          <motion.button
            key={metric.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMetric(metric.key)}
            onMouseEnter={() => setHoveredMetric(metric.key)}
            onMouseLeave={() => setHoveredMetric(null)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedMetric === metric.key
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <metric.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{metric.label}</span>
            
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredMetric === metric.key && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 -bottom-12 -translate-x-1/2 px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs whitespace-nowrap z-50"
                >
                  Click to focus on {metric.label.toLowerCase()}
                  <div className="absolute left-1/2 -top-1 -translate-x-1/2 border-4 border-transparent border-b-neutral-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#737373"
              fontSize={12}
            />
            <YAxis stroke="#737373" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {(selectedMetric === 'all' || selectedMetric === 'productivity') && (
              <Bar
                dataKey="productivity"
                fill="url(#colorProductivity)"
                radius={[4, 4, 0, 0]}
                name="Productivity"
              />
            )}
            
            {(selectedMetric === 'all' || selectedMetric === 'energy') && (
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Energy"
              />
            )}

            {(selectedMetric === 'all' || selectedMetric === 'flowState') && (
              <Scatter
                dataKey="flowState"
                fill="#ec4899"
                name="Flow State"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.flowState > 70 ? '#ec4899' : '#f472b6'}
                  />
                ))}
              </Scatter>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 