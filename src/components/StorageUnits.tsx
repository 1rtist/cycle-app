import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { DateSelector } from './DateSelector';
import { Header } from './Header';
import { AddStorageTripDialog } from './AddStorageTripDialog';
import { useData } from './DataContext';
import { Plus, Building, TrendingUp, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface StorageUnitsProps {
  onSettingsClick: () => void;
}

export function StorageUnits({ onSettingsClick }: StorageUnitsProps) {
  const { storageUnits, inventoryItems } = useData();
  const [sortBy, setSortBy] = useState('roi');
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  const toggleExpanded = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  // Calculate metrics for each storage unit based on inventory data
  const enrichedUnits = storageUnits.map(unit => {
    const unitItems = inventoryItems.filter(item => item.sourceId === unit.id);
    const soldItems = unitItems.filter(item => item.status === 'sold' || item.status === 'shipped');
    
    const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0);
    const totalInvestment = unitItems.reduce((sum, item) => sum + item.buyPrice, 0);
    const totalProfit = soldItems.reduce((sum, item) => sum + Math.max(0, item.profit), 0);
    const roi = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    
    return {
      ...unit,
      unitItems,
      soldItems,
      totalRevenue,
      totalInvestment,
      totalProfit,
      roi,
      itemsTotal: unitItems.length,
      itemsSold: soldItems.length,
      itemsListed: unitItems.filter(item => item.status === 'listed').length,
      itemsResearching: unitItems.filter(item => item.status === 'researching').length
    };
  });

  const sortedData = [...enrichedUnits].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.roi - a.roi;
      case 'profit':
        return b.totalProfit - a.totalProfit;
      case 'date':
        return new Date(b.dateAcquired).getTime() - new Date(a.dateAcquired).getTime();
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
    totalCost: enrichedUnits.reduce((sum, unit) => sum + unit.totalCost, 0),
    totalRevenue: enrichedUnits.reduce((sum, unit) => sum + unit.totalRevenue, 0),
    totalProfit: enrichedUnits.reduce((sum, unit) => sum + unit.totalProfit, 0),
    averageROI: enrichedUnits.length > 0 ? enrichedUnits.reduce((sum, unit) => sum + unit.roi, 0) / enrichedUnits.length : 0,
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <Header title="Storage Units" onSettingsClick={onSettingsClick}>
        <AddStorageTripDialog />
      </Header>

      {/* Date Selector */}
      <DateSelector onDateRangeChange={(range) => console.log('Date range changed:', range)} />

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
              className={sortBy === 'roi' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'}
            >
              ROI
            </Button>
            <Button
              variant={sortBy === 'profit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('profit')}
              className={sortBy === 'profit' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'}
            >
              Profit
            </Button>
            <Button
              variant={sortBy === 'date' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('date')}
              className={sortBy === 'date' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'}
            >
              Date
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Units Grid */}
      {sortedData.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">No storage units found.</div>
            <p className="text-gray-500 text-sm">Add your first storage unit trip to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedData.map((unit) => {
            const soldPercentage = unit.itemsTotal > 0 ? (unit.itemsSold / unit.itemsTotal) * 100 : 0;
            const isExpanded = expandedUnits.includes(unit.id);
            
            return (
              <Card key={unit.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-200">{unit.name}</CardTitle>
                    <Badge className={`${getStatusColor(unit.isActive ? 'active' : 'completed')} text-white capitalize`}>
                      {unit.isActive ? 'active' : 'completed'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Purchased: {formatDate(unit.dateAcquired)}</p>
                  <p className="text-gray-400 text-sm">Unit ID: {unit.id}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Trip Costs Breakdown */}
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Storage Unit Costs</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">Monthly Fee: {formatCurrency(unit.monthlyFee)}</div>
                      <div className="text-gray-400">Total Paid: {formatCurrency(unit.totalCost)}</div>
                      <div className="text-gray-400">Items Investment: {formatCurrency(unit.totalInvestment)}</div>
                      <div className="text-gray-400 font-semibold">Total Investment: {formatCurrency(unit.totalCost + unit.totalInvestment)}</div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Total Cost</div>
                      <div className="text-lg font-semibold text-white">{formatCurrency(unit.totalCost + unit.totalInvestment)}</div>
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

                  {/* Expandable Details */}
                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(unit.id)}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        View Detailed Breakdown
                        {isExpanded ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {/* Trips */}
                      {unit.trips && unit.trips.length > 0 && (
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <h4 className="text-gray-300 font-medium mb-3">Storage Unit Trips</h4>
                          <div className="space-y-2">
                            {unit.trips.map((trip, index) => (
                              <div key={trip.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                                <div>
                                  <div className="text-gray-200 text-sm">{formatDate(trip.date)}</div>
                                  <div className="text-xs text-gray-400">{trip.itemsFound} items found</div>
                                  {trip.notes && <div className="text-xs text-gray-500">{trip.notes}</div>}
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-gray-300">Cost: {formatCurrency(trip.totalCost)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      {unit.unitItems && unit.unitItems.length > 0 && (
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <h4 className="text-gray-300 font-medium mb-3">Items from This Unit</h4>
                          <div className="space-y-2">
                            {unit.unitItems.map((item, index) => (
                              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'sold' ? 'bg-green-400' : 
                                    item.status === 'listed' ? 'bg-blue-400' : 'bg-yellow-400'
                                  }`} />
                                  <div>
                                    <div className="text-gray-200 text-sm">{item.title}</div>
                                    <div className="text-xs text-gray-400 capitalize">{item.status}</div>
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-gray-300">Cost: {formatCurrency(item.buyPrice)}</div>
                                  {item.sellPrice > 0 && (
                                    <div className="text-green-400">Sale: {formatCurrency(item.sellPrice)}</div>
                                  )}
                                  {item.sellPrice > 0 && (
                                    <div className="text-blue-400">Profit: {formatCurrency(item.profit)}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}