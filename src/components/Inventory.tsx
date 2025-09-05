import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Search, Filter, Check, X, Edit } from 'lucide-react';

const inventoryData = [
  {
    id: 1,
    title: 'Vintage Polaroid Camera',
    sourceType: 'Storage Unit',
    sourceId: 'SU-001',
    buyPrice: 25.00,
    sellPrice: 125.50,
    fees: 12.55,
    shippingCost: 8.50,
    profit: 79.45,
    status: 'sold'
  },
  {
    id: 2,
    title: 'Antique Table Lamp',
    sourceType: 'Flea Market',
    sourceId: 'FM-003',
    buyPrice: 15.00,
    sellPrice: 89.99,
    fees: 8.99,
    shippingCost: 12.00,
    profit: 54.00,
    status: 'sold'
  },
  {
    id: 3,
    title: 'Craftsman Power Drill Set',
    sourceType: 'Storage Unit',
    sourceId: 'SU-002',
    buyPrice: 35.00,
    sellPrice: 156.00,
    fees: 15.60,
    shippingCost: 0.00,
    profit: 105.40,
    status: 'listed'
  },
  {
    id: 4,
    title: 'Jewelry Music Box',
    sourceType: 'Flea Market',
    sourceId: 'FM-001',
    buyPrice: 8.00,
    sellPrice: 45.75,
    fees: 4.58,
    shippingCost: 6.50,
    profit: 26.67,
    status: 'sold'
  },
  {
    id: 5,
    title: 'Vintage Record Collection (50pcs)',
    sourceType: 'Storage Unit',
    sourceId: 'SU-001',
    buyPrice: 50.00,
    sellPrice: 0.00,
    fees: 0.00,
    shippingCost: 0.00,
    profit: -50.00,
    status: 'researching'
  },
  {
    id: 6,
    title: 'Cast Iron Skillet Set',
    sourceType: 'Flea Market',
    sourceId: 'FM-002',
    buyPrice: 20.00,
    sellPrice: 85.00,
    fees: 8.50,
    shippingCost: 15.00,
    profit: 41.50,
    status: 'shipped'
  },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [inventoryItems, setInventoryItems] = useState(inventoryData);

  const filteredData = inventoryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || item.sourceType === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (editingId) {
      const newProfit = (editData.sellPrice || 0) - (editData.buyPrice || 0) - (editData.fees || 0) - (editData.shippingCost || 0);
      const updatedItem = { ...editData, profit: newProfit };
      
      setInventoryItems(prev => 
        prev.map(item => item.id === editingId ? updatedItem : item)
      );
      setEditingId(null);
      setEditData({});
    }
  };

  const updateEditField = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-green-600';
      case 'listed': return 'bg-blue-600';
      case 'shipped': return 'bg-yellow-600';
      case 'researching': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">Inventory</h2>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="researching">Researching</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Storage Unit">Storage Unit</SelectItem>
                <SelectItem value="Flea Market">Flea Market</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300">Title</th>
                  <th className="text-left p-4 text-gray-300">Source Type</th>
                  <th className="text-left p-4 text-gray-300">Source ID</th>
                  <th className="text-right p-4 text-gray-300">Buy Price</th>
                  <th className="text-right p-4 text-gray-300">Sell Price</th>
                  <th className="text-right p-4 text-gray-300">Fees</th>
                  <th className="text-right p-4 text-gray-300">Shipping</th>
                  <th className="text-right p-4 text-gray-300">Profit</th>
                  <th className="text-center p-4 text-gray-300">Status</th>
                  <th className="text-center p-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const isEditing = editingId === item.id;
                  const displayItem = isEditing ? editData : item;
                  
                  return (
                    <tr key={item.id} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                      <td className="p-4 text-white">
                        {isEditing ? (
                          <Input
                            value={displayItem.title}
                            onChange={(e) => updateEditField('title', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white text-sm"
                          />
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="p-4 text-gray-300">{item.sourceType}</td>
                      <td className="p-4 text-gray-300">{item.sourceId}</td>
                      <td className="p-4 text-right text-gray-300">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={displayItem.buyPrice}
                            onChange={(e) => updateEditField('buyPrice', parseFloat(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white text-sm w-24 text-right"
                          />
                        ) : (
                          formatCurrency(item.buyPrice)
                        )}
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={displayItem.sellPrice}
                            onChange={(e) => updateEditField('sellPrice', parseFloat(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white text-sm w-24 text-right"
                          />
                        ) : (
                          item.sellPrice > 0 ? formatCurrency(item.sellPrice) : '-'
                        )}
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={displayItem.fees}
                            onChange={(e) => updateEditField('fees', parseFloat(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white text-sm w-24 text-right"
                          />
                        ) : (
                          item.fees > 0 ? formatCurrency(item.fees) : '-'
                        )}
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={displayItem.shippingCost}
                            onChange={(e) => updateEditField('shippingCost', parseFloat(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white text-sm w-24 text-right"
                          />
                        ) : (
                          item.shippingCost > 0 ? formatCurrency(item.shippingCost) : '-'
                        )}
                      </td>
                      <td className={`p-4 text-right ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.profit !== -50 ? formatCurrency(item.profit) : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <Badge className={`${getStatusColor(item.status)} text-white capitalize`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <div className="flex justify-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={saveEdit}
                              className="text-green-400 hover:text-green-300 h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                            className="text-blue-400 hover:text-blue-300 h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Items</div>
            <div className="text-2xl font-semibold text-white">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Investment</div>
            <div className="text-2xl font-semibold text-white">
              {formatCurrency(filteredData.reduce((sum, item) => sum + item.buyPrice, 0))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Revenue</div>
            <div className="text-2xl font-semibold text-white">
              {formatCurrency(filteredData.reduce((sum, item) => sum + (item.sellPrice || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Profit</div>
            <div className="text-2xl font-semibold text-green-400">
              {formatCurrency(filteredData.reduce((sum, item) => sum + (item.profit > 0 ? item.profit : 0), 0))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}