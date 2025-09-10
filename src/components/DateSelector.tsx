import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  onDateRangeChange?: (range: { start: string; end: string; type: string }) => void;
}

export function DateSelector({ onDateRangeChange }: DateSelectorProps) {
  const [timelineTab, setTimelineTab] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handleTabChange = (value: string) => {
    setTimelineTab(value);
    
    // Calculate date ranges based on selection
    const now = new Date();
    let start = '';
    let end = now.toISOString().split('T')[0];

    switch (value) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        start = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        start = monthStart.toISOString().split('T')[0];
        break;
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        start = yearStart.toISOString().split('T')[0];
        break;
      case 'custom':
        start = customStartDate;
        end = customEndDate;
        break;
    }

    if (onDateRangeChange && start && end) {
      onDateRangeChange({ start, end, type: value });
    }
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate && onDateRangeChange) {
      onDateRangeChange({ 
        start: customStartDate, 
        end: customEndDate, 
        type: 'custom' 
      });
    }
  };

  const getCurrentDateRange = () => {
    const now = new Date();
    switch (timelineTab) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return `${weekStart.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'month':
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return now.getFullYear().toString();
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${customStartDate} - ${customEndDate}`;
        }
        return 'Select dates';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-300 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timelineTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="week" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Week</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Month</TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Year</TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="mt-4">
            <div className="text-gray-300">
              <p className="text-sm">Showing data for the past week</p>
              <p className="text-xs text-gray-400 mt-1">{getCurrentDateRange()}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="mt-4">
            <div className="text-gray-300">
              <p className="text-sm">Showing data for the current month</p>
              <p className="text-xs text-gray-400 mt-1">{getCurrentDateRange()}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="year" className="mt-4">
            <div className="text-gray-300">
              <p className="text-sm">Showing data for the current year</p>
              <p className="text-xs text-gray-400 mt-1">{getCurrentDateRange()}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">End Date</label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCustomApply}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!customStartDate || !customEndDate}
                >
                  Apply
                </Button>
              </div>
            </div>
            {customStartDate && customEndDate && (
              <p className="text-xs text-gray-400 mt-2">
                {getCurrentDateRange()}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}