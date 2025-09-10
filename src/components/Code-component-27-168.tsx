import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Calendar, ChevronDown } from 'lucide-react';

interface TimelineOption {
  label: string;
  start: string;
  end: string;
  value: string;
}

interface TimelineSelectorProps {
  onDateRangeChange: (range: { start: string; end: string; type: string; label: string }) => void;
}

export function TimelineSelector({ onDateRangeChange }: TimelineSelectorProps) {
  const [selectedType, setSelectedType] = useState('month');
  const [selectedOption, setSelectedOption] = useState<TimelineOption | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Generate week options
  const generateWeekOptions = (): TimelineOption[] => {
    const options: TimelineOption[] = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - (i * 7)); // Start of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
      
      const label = i === 0 ? 'This Week' : 
                   i === 1 ? 'Last Week' : 
                   `Week of ${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}-${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;
      
      options.push({
        label,
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0],
        value: `week-${i}`
      });
    }
    
    return options;
  };

  // Generate month options
  const generateMonthOptions = (): TimelineOption[] => {
    const options: TimelineOption[] = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      
      const label = i === 0 ? 'This Month' : 
                   i === 1 ? 'Last Month' : 
                   targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      options.push({
        label,
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
        value: `month-${i}`
      });
    }
    
    return options;
  };

  // Generate quarter options
  const generateQuarterOptions = (): TimelineOption[] => {
    const options: TimelineOption[] = [];
    const today = new Date();
    const currentQuarter = Math.floor(today.getMonth() / 3);
    
    for (let i = 0; i < 4; i++) {
      const targetQuarter = currentQuarter - i;
      const targetYear = today.getFullYear() + Math.floor(targetQuarter / 4);
      const adjustedQuarter = ((targetQuarter % 4) + 4) % 4;
      
      const startOfQuarter = new Date(targetYear, adjustedQuarter * 3, 1);
      const endOfQuarter = new Date(targetYear, (adjustedQuarter + 1) * 3, 0);
      
      const label = i === 0 ? 'This Quarter' : 
                   i === 1 ? 'Last Quarter' : 
                   `Q${adjustedQuarter + 1} ${targetYear}`;
      
      options.push({
        label,
        start: startOfQuarter.toISOString().split('T')[0],
        end: endOfQuarter.toISOString().split('T')[0],
        value: `quarter-${i}`
      });
    }
    
    return options;
  };

  // Generate year options
  const generateYearOptions = (): TimelineOption[] => {
    const options: TimelineOption[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 4; i++) {
      const targetYear = currentYear - i;
      const startOfYear = new Date(targetYear, 0, 1);
      const endOfYear = new Date(targetYear, 11, 31);
      
      const label = i === 0 ? 'This Year' : 
                   i === 1 ? 'Last Year' : 
                   targetYear.toString();
      
      options.push({
        label,
        start: startOfYear.toISOString().split('T')[0],
        end: endOfYear.toISOString().split('T')[0],
        value: `year-${i}`
      });
    }
    
    return options;
  };

  const getOptionsForType = (type: string): TimelineOption[] => {
    switch (type) {
      case 'week':
        return generateWeekOptions();
      case 'month':
        return generateMonthOptions();
      case 'quarter':
        return generateQuarterOptions();
      case 'year':
        return generateYearOptions();
      default:
        return [];
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    const options = getOptionsForType(type);
    const defaultOption = options[0]; // Select "This Week/Month/Quarter/Year" by default
    setSelectedOption(defaultOption);
    
    onDateRangeChange({
      start: defaultOption.start,
      end: defaultOption.end,
      type: type,
      label: defaultOption.label
    });
  };

  const handleOptionSelect = (option: TimelineOption) => {
    setSelectedOption(option);
    onDateRangeChange({
      start: option.start,
      end: option.end,
      type: selectedType,
      label: option.label
    });
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        start: customStartDate,
        end: customEndDate,
        type: 'custom',
        label: `${customStartDate} to ${customEndDate}`
      });
    }
  };

  const timelineTypes = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Timeline</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {timelineTypes.map((type) => (
            <div key={type.value} className="relative">
              {type.value === 'custom' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedType('custom')}
                  className={`h-8 text-xs border-gray-600 ${
                    selectedType === 'custom' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Custom
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 text-xs border-gray-600 ${
                        selectedType === type.value 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => handleTypeSelect(type.value)}
                    >
                      {selectedType === type.value && selectedOption
                        ? selectedOption.label
                        : type.label
                      }
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-600">
                    {getOptionsForType(type.value).map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleOptionSelect(option)}
                        className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>

        {selectedType === 'custom' && (
          <div className="flex gap-2 items-center text-xs mt-3">
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white h-8 text-xs"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white h-8 text-xs"
            />
            <Button onClick={handleCustomApply} className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs">
              Apply
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}