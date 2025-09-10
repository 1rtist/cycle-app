import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Header } from './Header';
import { useData } from './DataContext';
import { Plus, Search, Filter, Check, X, Edit } from 'lucide-react';

interface InventoryProps {
  onSettingsClick: () => void;
}

export function Inventory({ onSettingsClick }: InventoryProps) {
  const { inventoryItems, addInventoryItem, updateInventoryItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    sourceType: '',
    sourceId: '',
    buyPrice: 0,
    sellPrice: 0,
    fees: 0,
    shippingCost: 0,
    status: 'researching' as const,
    category: ''
  });

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
      updateInventoryItem(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const updateEditField = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const addNewItem = () => {
    addInventoryItem({
      ...newItem,
      datePurchased: new Date().toISOString().split('T')[0]
    });
    
    setNewItem({
      title: '',
      sourceType: '',
      sourceId: '',
      buyPrice: 0,
      sellPrice: 0,
      fees: 0,
      shippingCost: 0,
      status: 'researching',
      category: ''
    });
    setShowAddDialog(false);
  };

  const updateNewItemField = (field: string, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <Header title="Inventory" onSettingsClick={onSettingsClick}>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Item</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new item to your inventory from any source (storage unit, flea market, etc.).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => updateNewItemField('title', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter item title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-white">Source</Label>
                  <Select value={newItem.sourceType} onValueChange={(value) => updateNewItemField('sourceType', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Storage Unit" className="text-white">Storage Unit</SelectItem>
                      <SelectItem value="Flea Market" className="text-white">Flea Market</SelectItem>
                      <SelectItem value="Estate Sale" className="text-white">Estate Sale</SelectItem>
                      <SelectItem value="Garage Sale" className="text-white">Garage Sale</SelectItem>
                      <SelectItem value="Online" className="text-white">Online</SelectItem>
                      <SelectItem value="Other" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sourceId" className="text-white">Source ID</Label>
                  <Input
                    id="sourceId"
                    value={newItem.sourceId}
                    onChange={(e) => updateNewItemField('sourceId', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., SU-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyPrice" className="text-white">Buy Price</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    step="0.01"
                    value={newItem.buyPrice}
                    onChange={(e) => updateNewItemField('buyPrice', parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sellPrice" className="text-white">Sell Price</Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    step="0.01"
                    value={newItem.sellPrice}
                    onChange={(e) => updateNewItemField('sellPrice', parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fees" className="text-white">Fees</Label>
                  <Input
                    id="fees"
                    type="number"
                    step="0.01"
                    value={newItem.fees}
                    onChange={(e) => updateNewItemField('fees', parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipping" className="text-white">Shipping Cost</Label>
                  <Input
                    id="shipping"
                    type="number"
                    step="0.01"
                    value={newItem.shippingCost}
                    onChange={(e) => updateNewItemField('shippingCost', parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">Status</Label>
                <Select value={newItem.status} onValueChange={(value) => updateNewItemField('status', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="researching" className="text-white">Researching</SelectItem>
                    <SelectItem value="listed" className="text-white">Listed</SelectItem>
                    <SelectItem value="sold" className="text-white">Sold</SelectItem>
                    <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-600 text-white hover:bg-gray-700">
                  Cancel
                </Button>
                <Button onClick={addNewItem} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Header>

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
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="sold" className="text-white">Sold</SelectItem>
                <SelectItem value="listed" className="text-white">Listed</SelectItem>
                <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                <SelectItem value="researching" className="text-white">Researching</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">All Sources</SelectItem>
                <SelectItem value="Storage Unit" className="text-white">Storage Unit</SelectItem>
                <SelectItem value="Flea Market" className="text-white">Flea Market</SelectItem>
                <SelectItem value="Estate Sale" className="text-white">Estate Sale</SelectItem>
                <SelectItem value="Garage Sale" className="text-white">Garage Sale</SelectItem>
                <SelectItem value="Online" className="text-white">Online</SelectItem>
                <SelectItem value="Other" className="text-white">Other</SelectItem>
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
                  <th className="text-left p-4 text-gray-300">Source</th>
                  <th className="text-left p-4 text-gray-300">Source ID</th>
                  <th className="text-left p-4 text-gray-300">Date Purchased</th>
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
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-400">
                      {inventoryItems.length === 0 ? 'No items in inventory. Add your first item to get started!' : 'No items match your current filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
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
                        <td className="p-4 text-gray-300">
                          {isEditing ? (
                            <Select value={displayItem.sourceType} onValueChange={(value) => updateEditField('sourceType', value)}>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="Storage Unit" className="text-white">Storage Unit</SelectItem>
                                <SelectItem value="Flea Market" className="text-white">Flea Market</SelectItem>
                                <SelectItem value="Estate Sale" className="text-white">Estate Sale</SelectItem>
                                <SelectItem value="Garage Sale" className="text-white">Garage Sale</SelectItem>
                                <SelectItem value="Online" className="text-white">Online</SelectItem>
                                <SelectItem value="Other" className="text-white">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            item.sourceType
                          )}
                        </td>
                        <td className="p-4 text-gray-300">
                          {isEditing ? (
                            <Input
                              value={displayItem.sourceId}
                              onChange={(e) => updateEditField('sourceId', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white text-sm"
                            />
                          ) : (
                            item.sourceId
                          )}
                        </td>
                        <td className="p-4 text-gray-300">
                          {formatDate(item.datePurchased)}
                        </td>
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
                          {formatCurrency(item.profit)}
                        </td>
                        <td className="p-4 text-center">
                          {isEditing ? (
                            <Select value={displayItem.status} onValueChange={(value) => updateEditField('status', value)}>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="researching" className="text-white">Researching</SelectItem>
                                <SelectItem value="listed" className="text-white">Listed</SelectItem>
                                <SelectItem value="sold" className="text-white">Sold</SelectItem>
                                <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={`${getStatusColor(item.status)} text-white capitalize`}>
                              {item.status}
                            </Badge>
                          )}
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
                  })
                )}
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