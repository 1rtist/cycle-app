import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Header } from './Header';
import { useData } from './DataContext';
import { TimelineSelector } from './TimelineSelector';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

interface DashboardProps {
  onSettingsClick: () => void;
}

export function Dashboard({ onSettingsClick }: DashboardProps) {
  const { analytics, inventoryItems } = useData();
  const [filteredAnalytics, setFilteredAnalytics] = useState(analytics);
  const [currentTimelineLabel, setCurrentTimelineLabel] = useState('This Month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Function to filter data based on timeline selection
  const filterDataByTimeline = (timeline: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (timeline) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        } else {
          return; // Don't filter if custom dates aren't set
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Filter inventory items based on date range
    const filteredItems = inventoryItems.filter(item => {
      const itemDate = item.dateSold ? new Date(item.dateSold) : (item.datePurchased ? new Date(item.datePurchased) : null);
      if (!itemDate) return false;
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Recalculate analytics for filtered data
    const soldItems = filteredItems.filter(item => item.status === 'sold' || item.status === 'shipped');
    const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0);
    const totalInvestment = filteredItems.reduce((sum, item) => sum + item.buyPrice, 0);
    const totalProfit = soldItems.reduce((sum, item) => sum + Math.max(0, item.profit), 0);

    // Monthly data calculation for filtered items
    const monthlyMap = new Map();
    soldItems.forEach(item => {
      if (item.dateSold) {
        const month = new Date(item.dateSold).toLocaleDateString('en-US', { month: 'short' });
        const existing = monthlyMap.get(month) || { month, revenue: 0, profit: 0 };
        existing.revenue += item.sellPrice || 0;
        existing.profit += Math.max(0, item.profit);
        monthlyMap.set(month, existing);
      }
    });

    // Category data calculation for filtered items
    const categoryMap = new Map();
    soldItems.forEach(item => {
      const category = item.category || 'Other';
      const existing = categoryMap.get(category) || { name: category, value: 0, amount: 0 };
      existing.value += Math.max(0, item.profit);
      existing.amount += Math.max(0, item.profit);
      categoryMap.set(category, existing);
    });

    // Recent activity for filtered items
    const recentActivity = soldItems
      .sort((a, b) => new Date(b.dateSold || '').getTime() - new Date(a.dateSold || '').getTime())
      .slice(0, 4)
      .map(item => ({
        item: item.title,
        price: `${item.sellPrice?.toFixed(2) || '0.00'}`,
        profit: `${Math.max(0, item.profit).toFixed(2)}`,
        status: item.status
      }));

    setFilteredAnalytics({
      totalRevenue,
      totalProfit,
      totalInvestment,
      totalItems: filteredItems.length,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      roi: totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0,
      averageItemProfit: soldItems.length > 0 ? totalProfit / soldItems.length : 0,
      monthlyData: Array.from(monthlyMap.values()),
      categoryData: Array.from(categoryMap.values()),
      recentActivity
    });
  };

  // Function to handle timeline changes from TimelineSelector
  const handleTimelineChange = (range: { start: string; end: string; type: string; label: string }) => {
    setCurrentTimelineLabel(range.label);
    
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);

    // Filter inventory items based on date range
    const filteredItems = inventoryItems.filter(item => {
      const itemDate = item.dateSold ? new Date(item.dateSold) : (item.datePurchased ? new Date(item.datePurchased) : null);
      if (!itemDate) return false;
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Recalculate analytics for filtered data
    const soldItems = filteredItems.filter(item => item.status === 'sold' || item.status === 'shipped');
    const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0);
    const totalInvestment = filteredItems.reduce((sum, item) => sum + item.buyPrice, 0);
    const totalProfit = soldItems.reduce((sum, item) => sum + Math.max(0, item.profit), 0);

    // Monthly data calculation for filtered items
    const monthlyMap = new Map();
    soldItems.forEach(item => {
      if (item.dateSold) {
        const month = new Date(item.dateSold).toLocaleDateString('en-US', { month: 'short' });
        const existing = monthlyMap.get(month) || { month, revenue: 0, profit: 0 };
        existing.revenue += item.sellPrice || 0;
        existing.profit += Math.max(0, item.profit);
        monthlyMap.set(month, existing);
      }
    });

    // Category data calculation for filtered items
    const categoryMap = new Map();
    soldItems.forEach(item => {
      const category = item.category || 'Other';
      const existing = categoryMap.get(category) || { name: category, value: 0, amount: 0 };
      existing.value += Math.max(0, item.profit);
      existing.amount += Math.max(0, item.profit);
      categoryMap.set(category, existing);
    });

    // Recent activity for filtered items
    const recentActivity = soldItems
      .sort((a, b) => new Date(b.dateSold || '').getTime() - new Date(a.dateSold || '').getTime())
      .slice(0, 4)
      .map(item => ({
        item: item.title,
        price: `${item.sellPrice?.toFixed(2) || '0.00'}`,
        profit: `${Math.max(0, item.profit).toFixed(2)}`,
        status: item.status
      }));

    setFilteredAnalytics({
      totalRevenue,
      totalProfit,
      totalInvestment,
      totalItems: filteredItems.length,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      roi: totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0,
      averageItemProfit: soldItems.length > 0 ? totalProfit / soldItems.length : 0,
      monthlyData: Array.from(monthlyMap.values()),
      categoryData: Array.from(categoryMap.values()),
      recentActivity
    });
  };

  // Initialize with current month data on mount
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    handleTimelineChange({
      start: startOfMonth.toISOString().split('T')[0],
      end: endOfMonth.toISOString().split('T')[0],
      type: 'month',
      label: 'This Month'
    });
  }, []); // Only run on mount

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <Header title="Dashboard" onSettingsClick={onSettingsClick}>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <div className="bg-gray-800 px-3 py-1 rounded text-sm">Total Revenue: <span className="text-green-400">{formatCurrency(filteredAnalytics.totalRevenue)}</span></div>
          <div className="bg-gray-800 px-3 py-1 rounded text-sm">Total Profit: <span className="text-blue-400">{formatCurrency(filteredAnalytics.totalProfit)}</span></div>
        </div>
      </Header>

      {/* Timeline Selector with Dropdown Options */}
      <TimelineSelector onDateRangeChange={handleTimelineChange} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-green-400 text-2xl font-semibold">{formatCurrency(filteredAnalytics.totalRevenue)}</p>
              </div>
              <div className="text-green-400 text-sm">
                {filteredAnalytics.profitMargin > 0 ? `+${filteredAnalytics.profitMargin.toFixed(1)}%` : '0%'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Profit</p>
                <p className="text-blue-400 text-2xl font-semibold">{formatCurrency(filteredAnalytics.totalProfit)}</p>
              </div>
              <div className="text-blue-400 text-sm">
                {filteredAnalytics.roi > 0 ? `${filteredAnalytics.roi.toFixed(1)}% ROI` : '0% ROI'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Investment</p>
                <p className="text-yellow-400 text-2xl font-semibold">{formatCurrency(filteredAnalytics.totalInvestment)}</p>
              </div>
              <div className="text-yellow-400 text-sm">
                {filteredAnalytics.totalItems} items
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Item Profit</p>
                <p className="text-purple-400 text-2xl font-semibold">{formatCurrency(filteredAnalytics.averageItemProfit)}</p>
              </div>
              <div className="text-purple-400 text-sm">
                per item
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue and Profit Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Revenue & Profit Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAnalytics.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredAnalytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available. Add some sold items to see charts!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profit by Category */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Profit by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAnalytics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredAnalytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredAnalytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No category data available. Add some sold items to see breakdown!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAnalytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {filteredAnalytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'sold' ? 'bg-green-400' : 
                      activity.status === 'shipped' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}></div>
                    <div>
                      <div className="text-white font-medium">{activity.item}</div>
                      <div className="text-gray-400 text-sm capitalize">{activity.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{activity.price}</div>
                    <div className="text-blue-400 text-sm">Profit: {activity.profit}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No recent activity. Start selling items to see your progress here!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 p-6 h-auto flex-col">
              <div className="text-lg font-semibold">Add New Item</div>
              <div className="text-sm text-gray-300">Add inventory from any source</div>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 p-6 h-auto flex-col">
              <div className="text-lg font-semibold">Storage Trip</div>
              <div className="text-sm text-gray-300">Record a storage unit visit</div>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 p-6 h-auto flex-col">
              <div className="text-lg font-semibold">Flea Market</div>
              <div className="text-sm text-gray-300">Log a flea market trip</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}