import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';

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

export function Analytics() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalProfit = sourcePerformance.reduce((sum, source) => sum + source.profit, 0);
  const totalInvestment = sourcePerformance.reduce((sum, source) => sum + source.totalInvestment, 0);
  const overallROI = (totalProfit / totalInvestment) * 100;

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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="text-2xl font-semibold text-yellow-400">63</div>
              </div>
              <Package className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Avg Profit/Item</div>
                <div className="text-2xl font-semibold text-purple-400">{formatCurrency(totalProfit / 63)}</div>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
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
                <BarChart data={monthlyProfitData}>
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
                <AreaChart data={roiTrendData}>
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
                {categoryPerformance.map((cat, index) => {
                  const percentage = (cat.totalProfit / categoryPerformance.reduce((sum, c) => sum + c.totalProfit, 0)) * 100;
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
    </div>
  );
}