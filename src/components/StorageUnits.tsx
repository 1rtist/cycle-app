import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Plus, Building, TrendingUp, Package } from 'lucide-react';

const storageUnitsData = [
  {
    id: 'SU-001',
    name: 'Hillside Storage Unit #47',
    purchaseDate: '2024-01-15',
    totalCost: 425.00,
    totalRevenue: 1250.75,
    totalProfit: 825.75,
    roi: 194.3,
    itemsTotal: 24,
    itemsSold: 18,
    itemsListed: 4,
    itemsResearching: 2,
    status: 'active'
  },
  {
    id: 'SU-002',
    name: 'Downtown Mini Storage #12',
    purchaseDate: '2024-02-03',
    totalCost: 275.00,
    totalRevenue: 890.50,
    totalProfit: 615.50,
    roi: 223.8,
    itemsTotal: 18,
    itemsSold: 12,
    itemsListed: 6,
    itemsResearching: 0,
    status: 'active'
  },
  {
    id: 'SU-003',
    name: 'Westside Self Storage #89',
    purchaseDate: '2024-02-18',
    totalCost: 650.00,
    totalRevenue: 2150.25,
    totalProfit: 1500.25,
    roi: 230.8,
    itemsTotal: 32,
    itemsSold: 28,
    itemsListed: 3,
    itemsResearching: 1,
    status: 'completed'
  },
  {
    id: 'SU-004',
    name: 'Eastview Storage Facility #156',
    purchaseDate: '2024-03-10',
    totalCost: 380.00,
    totalRevenue: 145.00,
    totalProfit: -235.00,
    roi: -61.8,
    itemsTotal: 15,
    itemsSold: 3,
    itemsListed: 8,
    itemsResearching: 4,
    status: 'active'
  },
];

export function StorageUnits() {
  const [sortBy, setSortBy] = useState('roi');

  const sortedData = [...storageUnitsData].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.roi - a.roi;
      case 'profit':
        return b.totalProfit - a.totalProfit;
      case 'date':
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'active': return 'bg-blue-600';
      case 'paused': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi > 150) return 'text-green-400';
    if (roi > 50) return 'text-yellow-400';
    if (roi > 0) return 'text-blue-400';
    return 'text-red-400';
  };

  const totalStats = {
    totalCost: storageUnitsData.reduce((sum, unit) => sum + unit.totalCost, 0),
    totalRevenue: storageUnitsData.reduce((sum, unit) => sum + unit.totalRevenue, 0),
    totalProfit: storageUnitsData.reduce((sum, unit) => sum + unit.totalProfit, 0),
    averageROI: storageUnitsData.reduce((sum, unit) => sum + unit.roi, 0) / storageUnitsData.length,
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">Storage Units</h2>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0 hidden md:flex">
            <Plus className="w-4 h-4 mr-2" />
            Add Storage Unit
          </Button>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Investment</div>
                <div className="text-2xl font-semibold text-white">{formatCurrency(totalStats.totalCost)}</div>
              </div>
              <Building className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Revenue</div>
                <div className="text-2xl font-semibold text-green-400">{formatCurrency(totalStats.totalRevenue)}</div>
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
                <div className="text-2xl font-semibold text-blue-400">{formatCurrency(totalStats.totalProfit)}</div>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Average ROI</div>
                <div className={`text-2xl font-semibold ${getROIColor(totalStats.averageROI)}`}>
                  {totalStats.averageROI.toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 mr-4">Sort by:</span>
            <Button
              variant={sortBy === 'roi' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('roi')}
              className="text-white"
            >
              ROI
            </Button>
            <Button
              variant={sortBy === 'profit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('profit')}
              className="text-white"
            >
              Profit
            </Button>
            <Button
              variant={sortBy === 'date' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('date')}
              className="text-white"
            >
              Date
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Units Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedData.map((unit) => {
          const soldPercentage = (unit.itemsSold / unit.itemsTotal) * 100;
          
          return (
            <Card key={unit.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-200">{unit.name}</CardTitle>
                  <Badge className={`${getStatusColor(unit.status)} text-white capitalize`}>
                    {unit.status}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">Purchased: {formatDate(unit.purchaseDate)}</p>
                <p className="text-gray-400 text-sm">Unit ID: {unit.id}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Financial Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Cost</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(unit.totalCost)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                    <div className="text-lg font-semibold text-green-400">{formatCurrency(unit.totalRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Profit</div>
                    <div className={`text-lg font-semibold ${unit.totalProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {formatCurrency(unit.totalProfit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">ROI</div>
                    <div className={`text-lg font-semibold ${getROIColor(unit.roi)}`}>
                      {unit.roi.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Items Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Items Sold Progress</span>
                    <span className="text-gray-300">{unit.itemsSold}/{unit.itemsTotal} ({soldPercentage.toFixed(0)}%)</span>
                  </div>
                  <Progress value={soldPercentage} className="w-full" />
                </div>

                {/* Item Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Sold</div>
                    <div className="text-lg font-semibold text-green-400">{unit.itemsSold}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Listed</div>
                    <div className="text-lg font-semibold text-blue-400">{unit.itemsListed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Research</div>
                    <div className="text-lg font-semibold text-yellow-400">{unit.itemsResearching}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}