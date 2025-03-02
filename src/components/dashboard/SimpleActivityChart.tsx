import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, subDays, subHours, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityService } from '@/lib/services/ActivityService';
import { TaskService } from '@/lib/services/TaskService';
import { supabase } from '@/lib/supabase';
import { Brain, Zap, CheckCircle2, Timer } from 'lucide-react';

interface ChartData {
  date: string;
  focus: number;
  energy: number;
  tasks: number;
  flowStates: number;
  isCurrentHour?: boolean;
}

interface SimpleActivityChartProps {
  selectedTimeframe: 'day' | 'week' | 'month';
}

export function SimpleActivityChart({ selectedTimeframe }: SimpleActivityChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);

  const processData = useCallback((
    activityData: any[],
    tasks: any[],
    timeframe: string,
    startDate: Date,
    endDate: Date
  ): ChartData[] => {
    const dataPoints: ChartData[] = [];
    const isDaily = timeframe === 'day';
    const currentHour = new Date().getHours();
    
    if (isDaily) {
      // Hourly data points
      for (let i = 0; i <= 23; i++) {
        const date = subHours(endDate, 23 - i);
        const hourActivity = activityData.filter(a => 
          new Date(a.date).getHours() === date.getHours()
        );
        
        const hourTasks = tasks.filter(t => 
          t.completedAt && 
          new Date(t.completedAt).getHours() === date.getHours()
        );

        dataPoints.push({
          date: date.toISOString(),
          focus: hourActivity.reduce((acc, curr) => acc + (curr.avgFocusScore || 0), 0) / Math.max(1, hourActivity.length),
          energy: hourActivity.reduce((acc, curr) => acc + (curr.avgEnergyLevel || 0), 0) / Math.max(1, hourActivity.length),
          tasks: hourTasks.length,
          flowStates: hourActivity.reduce((acc, curr) => acc + (curr.totalFlowStateMinutes > 0 ? 1 : 0), 0),
          isCurrentHour: date.getHours() === currentHour,
        });
      }
    } else {
      // Daily data points for week/month
      const days = timeframe === 'week' ? 7 : 30;
      for (let i = 0; i < days; i++) {
        const date = subDays(endDate, days - 1 - i);
        const dayActivity = activityData.filter(a => 
          new Date(a.date).toDateString() === date.toDateString()
        );
        
        const dayTasks = tasks.filter(t => 
          t.completedAt && 
          new Date(t.completedAt).toDateString() === date.toDateString()
        );

        dataPoints.push({
          date: date.toISOString(),
          focus: dayActivity.reduce((acc, curr) => acc + (curr.avgFocusScore || 0), 0) / Math.max(1, dayActivity.length),
          energy: dayActivity.reduce((acc, curr) => acc + (curr.avgEnergyLevel || 0), 0) / Math.max(1, dayActivity.length),
          tasks: dayTasks.length,
          flowStates: dayActivity.reduce((acc, curr) => acc + (curr.totalFlowStateMinutes > 0 ? 1 : 0), 0),
        });
      }
    }

    return dataPoints;
  }, []);

  const getStartDate = useCallback(() => {
    const now = new Date();
    switch (selectedTimeframe) {
      case 'day':
        return startOfDay(now);
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subDays(now, 30);
      default:
        return startOfDay(now);
    }
  }, [selectedTimeframe]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      let startDate: Date;
      let endDate = now;

      switch (selectedTimeframe) {
        case 'day':
          startDate = startOfDay(now);
          break;
        case 'week':
          startDate = subDays(now, 7);
          break;
        case 'month':
          startDate = subDays(now, 30);
          break;
        default:
          startDate = startOfDay(now);
      }

      // Fetch data in parallel
      const [activityData, completedTasks] = await Promise.all([
        ActivityService.getDailyActivity(startDate, endDate),
        TaskService.getTasks({ status: 'done' }),
      ]);

      const chartData = processData(activityData, completedTasks, selectedTimeframe, startDate, endDate);
      
      // Animate in new data
      setData(chartData);

    } catch (err) {
      console.error('Error loading activity data:', err);
      setError('Failed to load activity data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe, processData]);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const startDate = getStartDate();
      const endDate = new Date();

      const [activityData, tasksData] = await Promise.all([
        ActivityService.getDailyActivity(startDate, endDate),
        TaskService.getTasks()
      ]);

      const processedData = processData(activityData, tasksData, selectedTimeframe, startDate, endDate);
      setData(processedData);
    } catch (error) {
      console.error('Error loading activity data:', error);
      setError('Failed to load activity data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [getStartDate, selectedTimeframe, processData]);

  useEffect(() => {
    loadInitialData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('activity_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'user_activity' 
        },
        loadInitialData
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [loadInitialData]);

  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    switch (selectedTimeframe) {
      case 'day':
        return format(date, 'HH:mm');
      case 'week':
        return format(date, 'EEE');
      case 'month':
        return format(date, 'MMM dd');
      default:
        return format(date, 'HH:mm');
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    const date = new Date(label);
    const formattedDate = selectedTimeframe === 'day'
      ? format(date, 'HH:mm')
      : format(date, 'MMM dd, yyyy');

    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200"
      >
        <p className="text-sm font-medium text-neutral-600 mb-2">{formattedDate}</p>
        <div className="space-y-2">
          <TooltipRow
            icon={Timer}
            color="blue"
            label="Focus Score"
            value={`${Math.round(payload[0]?.value || 0)}%`}
          />
          <TooltipRow
            icon={Zap}
            color="yellow"
            label="Energy Level"
            value={`${Math.round(payload[1]?.value || 0)}%`}
          />
          <TooltipRow
            icon={CheckCircle2}
            color="green"
            label="Tasks Completed"
            value={payload[2]?.value || 0}
          />
          <TooltipRow
            icon={Brain}
            color="purple"
            label="Flow States"
            value={payload[3]?.value || 0}
          />
        </div>
      </motion.div>
    );
  };

  const TooltipRow = ({ icon: Icon, color, label, value }: any) => (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 text-${color}-500`} />
      <p className="text-sm text-neutral-600">
        {label}: <span className="font-medium">{value}</span>
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-neutral-600 mb-2">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#737373"
              fontSize={12}
              tickLine={false}
            />
            
            <YAxis
              yAxisId="left"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              orientation="left"
            />
            
            <YAxis
              yAxisId="right"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
              orientation="right"
            />
            
            <Tooltip content={<CustomTooltip />} />

            {/* Current time reference line for daily view */}
            {selectedTimeframe === 'day' && (
              <ReferenceLine
                x={new Date().toISOString()}
                yAxisId="left"
                stroke="#6b7280"
                strokeDasharray="3 3"
                label={{ value: 'Now', position: 'insideTopRight' }}
              />
            )}

            <Area
              type="monotone"
              dataKey="focus"
              yAxisId="left"
              stroke="#3b82f6"
              fill="url(#focusGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Focus Score"
              onMouseEnter={() => setHighlightedMetric('focus')}
              onMouseLeave={() => setHighlightedMetric(null)}
              style={{
                opacity: !highlightedMetric || highlightedMetric === 'focus' ? 1 : 0.3,
              }}
            />

            <Area
              type="monotone"
              dataKey="energy"
              yAxisId="left"
              stroke="#eab308"
              fill="url(#energyGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Energy Level"
              onMouseEnter={() => setHighlightedMetric('energy')}
              onMouseLeave={() => setHighlightedMetric(null)}
              style={{
                opacity: !highlightedMetric || highlightedMetric === 'energy' ? 1 : 0.3,
              }}
            />

            <Area
              type="monotone"
              dataKey="tasks"
              yAxisId="right"
              stroke="#22c55e"
              fill="url(#tasksGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Tasks Completed"
              onMouseEnter={() => setHighlightedMetric('tasks')}
              onMouseLeave={() => setHighlightedMetric(null)}
              style={{
                opacity: !highlightedMetric || highlightedMetric === 'tasks' ? 1 : 0.3,
              }}
            />

            <Area
              type="monotone"
              dataKey="flowStates"
              yAxisId="right"
              stroke="#a855f7"
              fill="url(#flowGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Flow States"
              onMouseEnter={() => setHighlightedMetric('flow')}
              onMouseLeave={() => setHighlightedMetric(null)}
              style={{
                opacity: !highlightedMetric || highlightedMetric === 'flow' ? 1 : 0.3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 py-2">
        <LegendItem
          icon={Timer}
          color="blue"
          label="Focus"
          onHover={() => setHighlightedMetric('focus')}
          onLeave={() => setHighlightedMetric(null)}
          isHighlighted={!highlightedMetric || highlightedMetric === 'focus'}
        />
        <LegendItem
          icon={Zap}
          color="yellow"
          label="Energy"
          onHover={() => setHighlightedMetric('energy')}
          onLeave={() => setHighlightedMetric(null)}
          isHighlighted={!highlightedMetric || highlightedMetric === 'energy'}
        />
        <LegendItem
          icon={CheckCircle2}
          color="green"
          label="Tasks"
          onHover={() => setHighlightedMetric('tasks')}
          onLeave={() => setHighlightedMetric(null)}
          isHighlighted={!highlightedMetric || highlightedMetric === 'tasks'}
        />
        <LegendItem
          icon={Brain}
          color="purple"
          label="Flow"
          onHover={() => setHighlightedMetric('flow')}
          onLeave={() => setHighlightedMetric(null)}
          isHighlighted={!highlightedMetric || highlightedMetric === 'flow'}
        />
      </div>
    </div>
  );
}

const LegendItem = ({ icon: Icon, color, label, onHover, onLeave, isHighlighted }: any) => (
  <motion.div
    className={`flex items-center gap-1.5 px-2 py-1 rounded-full cursor-pointer transition-colors ${
      isHighlighted ? `bg-${color}-50` : 'bg-neutral-50'
    }`}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    whileHover={{ scale: 1.05 }}
    animate={{ opacity: isHighlighted ? 1 : 0.5 }}
  >
    <Icon className={`w-4 h-4 text-${color}-500`} />
    <span className={`text-sm font-medium text-${color}-700`}>{label}</span>
  </motion.div>
); 