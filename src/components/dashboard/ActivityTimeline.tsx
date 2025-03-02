import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { format } from 'date-fns';

interface ActivityData {
  date: string;
  tasks: number;
  focusMinutes: number;
  energy: number;
}

interface ActivityTimelineProps {
  data?: ActivityData[];
  selectedTimeframe: 'day' | 'week' | 'month';
}

export function ActivityTimeline({ data: providedData, selectedTimeframe }: ActivityTimelineProps) {
  // Sample data - replace with real data from your backend
  const defaultData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: selectedTimeframe === 'day' ? 24 : selectedTimeframe === 'week' ? 7 : 30 }, (_, i) => {
      const date = new Date(today);
      if (selectedTimeframe === 'day') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      return {
        date: date.toISOString(),
        tasks: Math.floor(Math.random() * 8),
        focusMinutes: Math.floor(Math.random() * 120),
        energy: Math.floor(Math.random() * 100),
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

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload) return null;

    const date = new Date(label);
    const formattedDate = selectedTimeframe === 'day'
      ? format(date, 'HH:mm')
      : format(date, 'MMM dd, yyyy');

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-600 mb-2">{formattedDate}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-neutral-600">
              <span className="font-medium">
                {entry.name === 'focusMinutes'
                  ? `${entry.value} mins`
                  : entry.name === 'energy'
                  ? `${entry.value}%`
                  : entry.value}
              </span>
              {' '}
              {entry.name === 'focusMinutes'
                ? 'Focus Time'
                : entry.name === 'energy'
                ? 'Energy'
                : 'Tasks'}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#colorTasks)"
          />
          <Area
            type="monotone"
            dataKey="focusMinutes"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorFocus)"
          />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#colorEnergy)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 