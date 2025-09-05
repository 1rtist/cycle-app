import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Plus, MapPin, TrendingUp, Package, Calendar } from 'lucide-react';

const fleaTripsData = [
  {
    id: 'FM-001',
    name: 'Rose Bowl Flea Market',
    date: '2024-02-10',
    location: 'Pasadena, CA',
    totalCost: 185.00,
    totalRevenue: 456.25,
    totalProfit: 271.25,
    roi: 146.6,
    itemsTotal: 12,
    itemsSold: 9,
    itemsListed: 2,
    itemsResearching: 1,
    status: 'active',
    entryFee: 15.00,
    travelCost: 25.00
  },
  {
    id: 'FM-002',
    name: 'Long Beach Antique Market',
    date: '2024-02-24',
    location: 'Long Beach, CA',
    totalCost: 245.00,
    totalRevenue: 680.75,
    totalProfit: 435.75,
    roi: 177.9,
    itemsTotal: 15,
    itemsSold: 11,
    itemsListed: 4,
    itemsResearching: 0,
    status: 'active',
    entryFee: 10.00,
    travelCost: 35.00
  },
  {
    id: 'FM-003',
    name: 'Melrose Trading Post',
    date: '2024-03-05',
    location: 'Los Angeles, CA',
    totalCost: 125.00,
    totalRevenue: 380.50,
    totalProfit: 255.50,
    roi: 204.4,
    itemsTotal: 8,
    itemsSold: 7,
    itemsListed: 1,
    itemsResearching: 0,
    status: 'completed',
    entryFee: 5.00,
    travelCost: 20.00
  },
  {
    id: 'FM-004',
    name: 'Santa Monica Flea Market',
    date: '2024-03-18',
    location: 'Santa Monica, CA',
    totalCost: 165.00,
    totalRevenue: 89.99,
    totalProfit: -75.01,
    roi: -45.5,
    itemsTotal: 6,
    itemsSold: 2,
    itemsListed: 3,
    itemsResearching: 1,
    status: 'active',
    entryFee: 8.00,
    travelCost: 30.00
  },
];

export function FleaTrips() {
  const [sortBy, setSortBy] = useState('roi');

  const sortedData = [...fleaTripsData].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.roi - a.roi;
      case 'profit':
        return b.totalProfit - a.totalProfit;
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
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
      case 'planned': return 'bg-purple-600';
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
    totalCost: fleaTripsData.reduce((sum, trip) => sum + trip.totalCost, 0),
    totalRevenue: fleaTripsData.reduce((sum, trip) => sum + trip.totalRevenue, 0),
    totalProfit: fleaTripsData.reduce((sum, trip) => sum + trip.totalProfit, 0),
    averageROI: fleaTripsData.reduce((sum, trip) => sum + trip.roi, 0) / fleaTripsData.length,
    totalTrips: fleaTripsData.length,
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">Flea Market</h2>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0 hidden md:flex">
            <Plus className="w-4 h-4 mr-2" />
            Add Flea Trip
          </Button>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Trips</div>
                <div className="text-2xl font-semibold text-white">{totalStats.totalTrips}</div>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Investment</div>
                <div className="text-2xl font-semibold text-white">{formatCurrency(totalStats.totalCost)}</div>
              </div>
              <MapPin className="w-8 h-8 text-gray-400" />
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

      {/* Flea Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedData.map((trip) => {
          const soldPercentage = (trip.itemsSold / trip.itemsTotal) * 100;
          
          return (
            <Card key={trip.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-200">{trip.name}</CardTitle>
                  <Badge className={`${getStatusColor(trip.status)} text-white capitalize`}>
                    {trip.status}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">Date: {formatDate(trip.date)}</p>
                <p className="text-gray-400 text-sm">Location: {trip.location}</p>
                <p className="text-gray-400 text-sm">Trip ID: {trip.id}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trip Costs Breakdown */}
                <div className="bg-gray-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Trip Costs</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Entry Fee: {formatCurrency(trip.entryFee)}</div>
                    <div>Travel: {formatCurrency(trip.travelCost)}</div>
                    <div>Items: {formatCurrency(trip.totalCost - trip.entryFee - trip.travelCost)}</div>
                    <div className="font-semibold">Total: {formatCurrency(trip.totalCost)}</div>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                    <div className="text-lg font-semibold text-green-400">{formatCurrency(trip.totalRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Profit</div>
                    <div className={`text-lg font-semibold ${trip.totalProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {formatCurrency(trip.totalProfit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">ROI</div>
                    <div className={`text-lg font-semibold ${getROIColor(trip.roi)}`}>
                      {trip.roi.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Avg per Item</div>
                    <div className="text-lg font-semibold text-yellow-400">
                      {formatCurrency(trip.totalProfit / trip.itemsTotal)}
                    </div>
                  </div>
                </div>

                {/* Items Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Items Sold Progress</span>
                    <span className="text-gray-300">{trip.itemsSold}/{trip.itemsTotal} ({soldPercentage.toFixed(0)}%)</span>
                  </div>
                  <Progress value={soldPercentage} className="w-full" />
                </div>

                {/* Item Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Sold</div>
                    <div className="text-lg font-semibold text-green-400">{trip.itemsSold}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Listed</div>
                    <div className="text-lg font-semibold text-blue-400">{trip.itemsListed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Research</div>
                    <div className="text-lg font-semibold text-yellow-400">{trip.itemsResearching}</div>
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