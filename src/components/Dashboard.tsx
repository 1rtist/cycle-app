import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Calendar } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 2400, profit: 1200 },
  { month: 'Feb', revenue: 3200, profit: 1800 },
  { month: 'Mar', revenue: 2800, profit: 1400 },
  { month: 'Apr', revenue: 4100, profit: 2200 },
  { month: 'May', revenue: 3800, profit: 2000 },
  { month: 'Jun', revenue: 4500, profit: 2400 },
];

const profitByItemData = [
  { name: 'Electronics', value: 35, amount: 3500 },
  { name: 'Antiques', value: 25, amount: 2500 },
  { name: 'Collectibles', value: 20, amount: 2000 },
  { name: 'Tools', value: 15, amount: 1500 },
  { name: 'Other', value: 5, amount: 500 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

const recentActivity = [
  { item: 'Vintage Camera', price: '$125.50', profit: '$87.20', status: 'sold' },
  { item: 'Antique Lamp', price: '$89.99', profit: '$65.40', status: 'sold' },
  { item: 'Power Drill Set', price: '$156.00', profit: '$98.30', status: 'listed' },
  { item: 'Jewelry Box', price: '$45.75', profit: '$32.15', status: 'sold' },
];

export function Dashboard() {
  const [timelineTab, setTimelineTab] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <div className="bg-gray-800 px-3 py-1 rounded text-sm">Total Revenue: <span className="text-green-400">$18,800</span></div>
            <div className="bg-gray-800 px-3 py-1 rounded text-sm">Total Profit: <span className="text-blue-400">$11,800</span></div>
            <div className="bg-gray-800 px-3 py-1 rounded text-sm">Items Sold: <span className="text-yellow-400">156</span></div>
          </div>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Timeline Selector */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={timelineTab} onValueChange={setTimelineTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900">
              <TabsTrigger value="week" className="data-[state=active]:bg-gray-700">Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-gray-700">Month</TabsTrigger>
              <TabsTrigger value="year" className="data-[state=active]:bg-gray-700">Year</TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:bg-gray-700">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="week" className="mt-4">
              <div className="text-gray-300">
                <p className="text-sm">Showing data for the current week</p>
                <p className="text-xs text-gray-400 mt-1">Dec 23 - Dec 29, 2024</p>
              </div>
            </TabsContent>
            
            <TabsContent value="month" className="mt-4">
              <div className="text-gray-300">
                <p className="text-sm">Showing data for the current month</p>
                <p className="text-xs text-gray-400 mt-1">December 2024</p>
              </div>
            </TabsContent>
            
            <TabsContent value="year" className="mt-4">
              <div className="text-gray-300">
                <p className="text-sm">Showing data for the current year</p>
                <p className="text-xs text-gray-400 mt-1">2024</p>
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
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!customStartDate || !customEndDate}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              {customStartDate && customEndDate && (
                <p className="text-xs text-gray-400 mt-2">
                  Showing data from {customStartDate} to {customEndDate}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Profit by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profitByItemData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {profitByItemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {profitByItemData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white">${item.amount}</div>
                    <div className="text-xs text-gray-400">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-300 text-sm">This Month Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-400">$4,500</div>
            <p className="text-xs text-gray-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-300 text-sm">This Month Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-400">$2,400</div>
            <p className="text-xs text-gray-400 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-300 text-sm">Average ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-yellow-400">127%</div>
            <p className="text-xs text-gray-400 mt-1">+3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-300 text-sm">Items Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-purple-400">23</div>
            <p className="text-xs text-gray-400 mt-1">+5 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'sold' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <div className="text-gray-200">{activity.item}</div>
                    <div className="text-xs text-gray-400 capitalize">{activity.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-200">{activity.price}</div>
                  <div className="text-xs text-green-400">+{activity.profit}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}