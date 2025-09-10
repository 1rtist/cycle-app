import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TimelineSelector } from './TimelineSelector';
import { useData } from './DataContext';
import { TrendingUp, DollarSign, Package, Calendar, Target, Clock, Percent, Zap, RotateCcw, Star } from 'lucide-react';

const monthlyProfitData = [
  { month: 'Jan', storageUnits: 825, fleaMarkets: 271, total: 1096 },
  { month: 'Feb', storageUnits: 615, fleaMarkets: 436, total: 1051 },
  { month: 'Mar', storageUnits: 1500, fleaMarkets: 256, total: 1756 },
  { month: 'Apr', storageUnits: 1200, fleaMarkets: 380, total: 1580 },
  { month: 'May', storageUnits: 950, fleaMarkets: 420, total: 1370 },
  { month: 'Jun', storageUnits: 1100, fleaMarkets: 340, total: 1440 },
];

const categoryPerformance = [
  { category: 'Electronics', items: 15, avgProfit: 87.50, totalProfit: 1312.50 },
  { category: 'Antiques', items: 12, avgProfit: 65.40, totalProfit: 784.80 },
  { category: 'Tools', items: 8, avgProfit: 105.40, totalProfit: 843.20 },
  { category: 'Collectibles', items: 18, avgProfit: 42.30, totalProfit: 761.40 },
  { category: 'Jewelry', items: 6, avgProfit: 78.20, totalProfit: 469.20 },
  { category: 'Furniture', items: 4, avgProfit: 145.00, totalProfit: 580.00 },
];

const sourcePerformance = [
  { source: 'Storage Units', totalInvestment: 1730, totalRevenue: 4291, profit: 2561, roi: 148.1 },
  { source: 'Flea Markets', totalInvestment: 720, totalRevenue: 1607, profit: 887, roi: 123.2 },
];

const roiTrendData = [
  { month: 'Jan', storageROI: 194.3, fleaROI: 146.6, avgROI: 170.45 },
  { month: 'Feb', storageROI: 223.8, fleaROI: 177.9, avgROI: 200.85 },
  { month: 'Mar', storageROI: 230.8, fleaROI: 204.4, avgROI: 217.6 },
  { month: 'Apr', storageROI: 185.2, fleaROI: 165.3, avgROI: 175.25 },
  { month: 'May', storageROI: 201.5, fleaROI: 189.7, avgROI: 195.6 },
  { month: 'Jun', storageROI: 215.3, fleaROI: 178.2, avgROI: 196.75 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#8dd1e1'];

// Additional analytical data
const costBreakdownData = [
  { name: 'Item Purchase', storage: 1420, fleaMarket: 580, total: 2000 },
  { name: 'Travel/Gas', storage: 180, fleaMarket: 95, total: 275 },
  { name: 'Storage Fees', storage: 130, fleaMarket: 45, total: 175 },
  { name: 'eBay Fees', storage: 185, fleaMarket: 78, total: 263 },
  { name: 'Shipping', storage: 95, fleaMarket: 42, total: 137 }
];

const efficiencyMetrics = [
  { metric: 'Profit per Hour', storageUnits: 42.50, fleaMarkets: 38.20 },
  { metric: 'Items per Trip', storageUnits: 3.2, fleaMarkets: 2.8 },
  { metric: 'Cost per Item', storageUnits: 28.45, fleaMarkets: 31.20 },
  { metric: 'Success Rate', storageUnits: 78, fleaMarkets: 65 }
];

const timeAnalysisData = [
  { day: 'Mon', sales: 2, avgPrice: 67.50 },
  { day: 'Tue', sales: 4, avgPrice: 89.25 },
  { day: 'Wed', sales: 3, avgPrice: 72.80 },
  { day: 'Thu', sales: 6, avgPrice: 91.40 },
  { day: 'Fri', sales: 8, avgPrice: 95.60 },
  { day: 'Sat', sales: 12, avgPrice: 103.20 },
  { day: 'Sun', sales: 9, avgPrice: 88.90 }
];

const categoryTrendData = [
  { month: 'Jan', Electronics: 65, Antiques: 45, Tools: 72, Collectibles: 38 },
  { month: 'Feb', Electronics: 78, Antiques: 52, Tools: 68, Collectibles: 41 },
  { month: 'Mar', Electronics: 82, Antiques: 58, Tools: 85, Collectibles: 47 },
  { month: 'Apr', Electronics: 75, Antiques: 62, Tools: 79, Collectibles: 52 },
  { month: 'May', Electronics: 89, Antiques: 67, Tools: 91, Collectibles: 48 },
  { month: 'Jun', Electronics: 94, Antiques: 71, Tools: 88, Collectibles: 55 }
];

const storageUtilizationData = [
  { unit: 'SU-001', utilization: 85, profit: 1420, items: 12 },
  { unit: 'SU-002', utilization: 72, profit: 980, items: 8 },
  { unit: 'SU-003', utilization: 91, profit: 1680, items: 15 },
  { unit: 'SU-004', utilization: 45, profit: 420, items: 3 }
];

// Inventory turnover and velocity analysis
const inventoryTurnoverData = [
  { category: 'Electronics', avgDaysToSell: 8.5, turnoverRate: 4.3, fastMovers: 12, slowMovers: 3 },
  { category: 'Tools', avgDaysToSell: 12.2, turnoverRate: 3.8, fastMovers: 6, slowMovers: 2 },
  { category: 'Antiques', avgDaysToSell: 18.7, turnoverRate: 2.9, fastMovers: 8, slowMovers: 4 },
  { category: 'Collectibles', avgDaysToSell: 22.4, turnoverRate: 2.1, fastMovers: 11, slowMovers: 7 },
  { category: 'Jewelry', avgDaysToSell: 15.8, turnoverRate: 3.2, fastMovers: 4, slowMovers: 2 },
  { category: 'Furniture', avgDaysToSell: 35.6, turnoverRate: 1.8, fastMovers: 2, slowMovers: 2 }
];

const seasonalTrendData = [
  { month: 'Jan', electronics: 850, tools: 420, antiques: 380, collectibles: 290 },
  { month: 'Feb', electronics: 920, tools: 380, antiques: 450, collectibles: 310 },
  { month: 'Mar', electronics: 1100, tools: 480, antiques: 520, collectibles: 340 },
  { month: 'Apr', electronics: 1050, tools: 520, antiques: 480, collectibles: 380 },
  { month: 'May', electronics: 1200, tools: 580, antiques: 420, collectibles: 410 },
  { month: 'Jun', electronics: 1350, tools: 620, antiques: 460, collectibles: 450 },
  { month: 'Jul', electronics: 1180, tools: 540, antiques: 400, collectibles: 420 },
  { month: 'Aug', electronics: 980, tools: 450, antiques: 380, collectibles: 350 },
  { month: 'Sep', electronics: 1080, tools: 490, antiques: 540, collectibles: 390 },
  { month: 'Oct', electronics: 1250, tools: 560, antiques: 620, collectibles: 480 },
  { month: 'Nov', electronics: 1420, tools: 680, antiques: 720, collectibles: 550 },
  { month: 'Dec', electronics: 1650, tools: 750, antiques: 850, collectibles: 680 }
];

export function Analytics() {
  const { inventoryItems, storageUnits, fleaMarketTrips } = useData();
  
  const [dateRange, setDateRange] = useState<{ start: string; end: string; type: string; label: string }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    type: 'month',
    label: 'This Month'
  });

  const [filteredData, setFilteredData] = useState({
    monthlyProfitData: monthlyProfitData,
    categoryPerformance: categoryPerformance,
    roiTrendData: roiTrendData,
    timeAnalysisData: timeAnalysisData,
    categoryTrendData: categoryTrendData
  });

  // Function to filter items based on date range
  const filterItemsByDateRange = (items: any[], range: { start: string; end: string; type: string; label: string }) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    
    return items.filter(item => {
      // Check if item has a relevant date (sold date, purchase date, trip date)
      let itemDate = null;
      
      if (item.dateSold) {
        itemDate = new Date(item.dateSold);
      } else if (item.datePurchased) {
        itemDate = new Date(item.datePurchased);
      } else if (item.date) {
        itemDate = new Date(item.date);
      }
      
      if (!itemDate) return false;
      
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const handleDateRangeChange = (range: { start: string; end: string; type: string; label: string }) => {
    setDateRange(range);
    
    // Filter actual data based on selected date range
    const filteredInventory = filterItemsByDateRange(inventoryItems, range);
    const filteredTrips = filterItemsByDateRange(fleaMarketTrips, range);
    
    // Recalculate data based on filtered items
    const soldItems = filteredInventory.filter(item => item.status === 'sold' || item.status === 'shipped');
    
    // Monthly data calculation for filtered items
    const monthlyMap = new Map();
    soldItems.forEach(item => {
      if (item.dateSold) {
        const month = new Date(item.dateSold).toLocaleDateString('en-US', { month: 'short' });
        const existing = monthlyMap.get(month) || { month, storageUnits: 0, fleaMarkets: 0, total: 0 };
        const profit = Math.max(0, item.profit);
        
        if (item.sourceType === 'Storage Unit') {
          existing.storageUnits += profit;
        } else if (item.sourceType === 'Flea Market') {
          existing.fleaMarkets += profit;
        }
        existing.total += profit;
        monthlyMap.set(month, existing);
      }
    });
    
    // Category performance for filtered items
    const categoryMap = new Map();
    soldItems.forEach(item => {
      const category = item.category || 'Other';
      const existing = categoryMap.get(category) || { category, items: 0, avgProfit: 0, totalProfit: 0 };
      existing.items += 1;
      existing.totalProfit += Math.max(0, item.profit);
      existing.avgProfit = existing.totalProfit / existing.items;
      categoryMap.set(category, existing);
    });

    const newData = {
      monthlyProfitData: Array.from(monthlyMap.values()),
      categoryPerformance: Array.from(categoryMap.values()),
      roiTrendData: Array.from(monthlyMap.values()).map(month => ({
        month: month.month,
        storageROI: month.storageUnits > 0 ? (month.storageUnits / (month.storageUnits + 100)) * 100 : 0,
        fleaROI: month.fleaMarkets > 0 ? (month.fleaMarkets / (month.fleaMarkets + 50)) * 100 : 0,
        avgROI: month.total > 0 ? (month.total / (month.total + 150)) * 100 : 0
      })),
      timeAnalysisData: range.type === 'year' ? timeAnalysisData : timeAnalysisData.slice(0, 3),
      categoryTrendData: range.type === 'year' ? categoryTrendData : categoryTrendData.slice(-3)
    };
    
    setFilteredData(newData);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalProfit = sourcePerformance.reduce((sum, source) => sum + source.profit, 0);
  const totalInvestment = sourcePerformance.reduce((sum, source) => sum + source.totalInvestment, 0);
  const overallROI = (totalProfit / totalInvestment) * 100;
  
  // Additional calculations using filtered data
  const totalItems = filteredData.categoryPerformance.reduce((sum, cat) => sum + cat.items, 0);
  const avgDaysToSell = inventoryTurnoverData.reduce((sum, cat) => sum + cat.avgDaysToSell, 0) / inventoryTurnoverData.length;
  const totalCostBreakdown = costBreakdownData.reduce((sum, cost) => sum + cost.total, 0);
  const avgProfitMargin = (totalProfit / (totalProfit + totalCostBreakdown)) * 100;

  useEffect(() => {
    // Initialize with month view
    handleDateRangeChange(dateRange);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white">
      <div className="flex flex-col">
        <div className="flex items-center space-x-4 mb-2">
          <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
          <div className="w-px h-6 bg-gray-600"></div>
          <h2 className="text-2xl font-semibold">Analytics</h2>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Timeline Selector */}
      <TimelineSelector onDateRangeChange={handleDateRangeChange} />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total ROI</div>
                <div className="text-2xl font-semibold text-green-400">{overallROI.toFixed(1)}%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Profit</div>
                <div className="text-2xl font-semibold text-blue-400">{formatCurrency(totalProfit)}</div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Items Sold</div>
                <div className="text-2xl font-semibold text-yellow-400">{totalItems}</div>
              </div>
              <Package className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Profit Margin</div>
                <div className="text-2xl font-semibold text-purple-400">{avgProfitMargin.toFixed(1)}%</div>
              </div>
              <Percent className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Avg Days to Sell</div>
                <div className="text-2xl font-semibold text-orange-400">{avgDaysToSell}</div>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Avg Profit/Item</div>
                <div className="text-2xl font-semibold text-cyan-400">{formatCurrency(totalProfit / totalItems)}</div>
              </div>
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Monthly Profit Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData.monthlyProfitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Bar dataKey="storageUnits" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="fleaMarkets" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Storage Units</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Flea Markets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">ROI Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData.roiTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Area type="monotone" dataKey="storageROI" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="fleaROI" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="avgROI" stroke="#ffc658" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Storage ROI</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Flea ROI</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Average</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300">Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-300">Category</th>
                  <th className="text-right p-3 text-gray-300">Items Sold</th>
                  <th className="text-right p-3 text-gray-300">Avg Profit</th>
                  <th className="text-right p-3 text-gray-300">Total Profit</th>
                  <th className="text-right p-3 text-gray-300">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.categoryPerformance.map((cat, index) => {
                  const percentage = (cat.totalProfit / filteredData.categoryPerformance.reduce((sum, c) => sum + c.totalProfit, 0)) * 100;
                  return (
                    <tr key={cat.category} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                      <td className="p-3 text-white">{cat.category}</td>
                      <td className="p-3 text-right text-gray-300">{cat.items}</td>
                      <td className="p-3 text-right text-gray-300">{formatCurrency(cat.avgProfit)}</td>
                      <td className="p-3 text-right text-green-400">{formatCurrency(cat.totalProfit)}</td>
                      <td className="p-3 text-right text-blue-400">{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Source Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Source Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourcePerformance.map((source, index) => (
                <div key={source.source} className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-semibold">{source.source}</h4>
                    <span className={`text-lg font-semibold ${source.roi > 150 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {source.roi.toFixed(1)}% ROI
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Investment</div>
                      <div className="text-white">{formatCurrency(source.totalInvestment)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Revenue</div>
                      <div className="text-white">{formatCurrency(source.totalRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Profit</div>
                      <div className="text-green-400">{formatCurrency(source.profit)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Profit Distribution by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcePerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="profit"
                  >
                    {sourcePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {sourcePerformance.map((item, index) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-300">{item.source}</span>
                  </div>
                  <span className="text-white">{formatCurrency(item.profit)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-Based Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Sales by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData.timeAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Bar dataKey="sales" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Category Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData.categoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Line type="monotone" dataKey="Electronics" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Tools" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Antiques" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Collectibles" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4 flex-wrap">
              <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Electronics</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Tools</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Antiques</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Collectibles</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300">Cost Breakdown Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBreakdownData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                <Bar dataKey="storage" stackId="a" fill="#3b82f6" />
                <Bar dataKey="fleaMarket" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-300 text-sm">Storage Units</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-300 text-sm">Flea Markets</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency & Utilization Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Source Efficiency Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {efficiencyMetrics.map((metric, index) => (
                <div key={metric.metric} className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-semibold">{metric.metric}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Storage Units</div>
                      <div className="text-lg text-blue-400">
                        {typeof metric.storageUnits === 'number' && metric.storageUnits < 10 
                          ? metric.storageUnits.toFixed(1) 
                          : metric.metric === 'Success Rate' 
                            ? `${metric.storageUnits}%` 
                            : formatCurrency(metric.storageUnits)
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Flea Markets</div>
                      <div className="text-lg text-green-400">
                        {typeof metric.fleaMarkets === 'number' && metric.fleaMarkets < 10 
                          ? metric.fleaMarkets.toFixed(1) 
                          : metric.metric === 'Success Rate' 
                            ? `${metric.fleaMarkets}%` 
                            : formatCurrency(metric.fleaMarkets)
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Storage Unit Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storageUtilizationData.map((unit, index) => (
                <div key={unit.unit} className="bg-gray-900 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{unit.unit}</span>
                    <span className={`text-sm font-semibold ${unit.utilization > 80 ? 'text-green-400' : unit.utilization > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {unit.utilization}% utilized
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Profit</div>
                      <div className="text-green-400">{formatCurrency(unit.profit)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Items</div>
                      <div className="text-blue-400">{unit.items}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${unit.utilization > 80 ? 'bg-green-500' : unit.utilization > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${unit.utilization}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Turnover Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Inventory Turnover Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-3 text-gray-300">Category</th>
                    <th className="text-right p-3 text-gray-300">Avg Days</th>
                    <th className="text-right p-3 text-gray-300">Turnover Rate</th>
                    <th className="text-right p-3 text-gray-300">Velocity</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryTurnoverData.map((cat, index) => {
                    const velocityRating = cat.turnoverRate > 4 ? 'Fast' : cat.turnoverRate > 3 ? 'Medium' : 'Slow';
                    const velocityColor = cat.turnoverRate > 4 ? 'text-green-400' : cat.turnoverRate > 3 ? 'text-yellow-400' : 'text-red-400';
                    
                    return (
                      <tr key={cat.category} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                        <td className="p-3 text-white">{cat.category}</td>
                        <td className="p-3 text-right text-gray-300">{cat.avgDaysToSell.toFixed(0)}.00</td>
                        <td className="p-3 text-right text-blue-400">{cat.turnoverRate.toFixed(1)}x</td>
                        <td className={`p-3 text-right ${velocityColor}`}>{velocityRating}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Seasonal Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Area type="monotone" dataKey="electronics" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="tools" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="antiques" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="collectibles" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4 flex-wrap">
              <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Electronics</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Tools</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Antiques</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2"></div><span className="text-gray-300 text-sm">Collectibles</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}