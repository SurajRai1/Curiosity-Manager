import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilters) => void;
  className?: string;
}

export interface TaskFilters {
  priority?: 'low' | 'medium' | 'high';
  energyLevel?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export default function TaskFilters({ onFilterChange, className }: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className={cn('flex items-center justify-end', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors',
          isExpanded && 'bg-primary-50 border-primary-200',
          hasActiveFilters && 'border-primary-200 bg-primary-50'
        )}
      >
        <Filter className={cn(
          'w-5 h-5',
          hasActiveFilters ? 'text-primary-600' : 'text-neutral-600'
        )} />
      </button>

      {/* Filter Controls */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-72 p-4 rounded-lg border border-neutral-200 bg-white space-y-4 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-600">Priority</label>
            <div className="flex gap-2">
              {['all', 'low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handleFilterChange('priority', priority)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium capitalize',
                    filters.priority === priority || (priority === 'all' && !filters.priority)
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Filter */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-600">Energy Level</label>
            <div className="flex gap-2">
              {['all', 'low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleFilterChange('energyLevel', level)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium capitalize',
                    filters.energyLevel === level || (level === 'all' && !filters.energyLevel)
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 