import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Search, Truck, Package, Calendar, ExternalLink } from 'lucide-react';

const shippingData = [
  {
    id: 1,
    title: 'Vintage Polaroid Camera',
    dateShipped: '2024-03-15',
    carrier: 'USPS',
    service: 'Priority Mail',
    shippingCost: 8.50,
    trackingNumber: '9400111899562543123456',
    status: 'delivered',
    buyer: 'j_photographer42',
    deliveredDate: '2024-03-18',
    estimatedDelivery: '2024-03-19'
  },
  {
    id: 2,
    title: 'Antique Table Lamp',
    dateShipped: '2024-03-12',
    carrier: 'FedEx',
    service: 'Ground',
    shippingCost: 12.00,
    trackingNumber: '773179591234',
    status: 'delivered',
    buyer: 'vintagelover88',
    deliveredDate: '2024-03-16',
    estimatedDelivery: '2024-03-16'
  },
  {
    id: 3,
    title: 'Cast Iron Skillet Set',
    dateShipped: '2024-03-20',
    carrier: 'UPS',
    service: 'Ground',
    shippingCost: 15.00,
    trackingNumber: '1Z999AA9876543210',
    status: 'in_transit',
    buyer: 'cookingpro2024',
    deliveredDate: null,
    estimatedDelivery: '2024-03-23'
  },
  {
    id: 4,
    title: 'Jewelry Music Box',
    dateShipped: '2024-03-18',
    carrier: 'USPS',
    service: 'First Class',
    shippingCost: 6.50,
    trackingNumber: '9400111299562543789012',
    status: 'delivered',
    buyer: 'collector_sarah',
    deliveredDate: '2024-03-21',
    estimatedDelivery: '2024-03-22'
  },
  {
    id: 5,
    title: 'Craftsman Power Drill Set',
    dateShipped: '2024-03-22',
    carrier: 'FedEx',
    service: 'Express',
    shippingCost: 24.50,
    trackingNumber: '773179598765',
    status: 'in_transit',
    buyer: 'toolmaniac99',
    deliveredDate: null,
    estimatedDelivery: '2024-03-24'
  },
  {
    id: 6,
    title: 'Vintage Tea Set',
    dateShipped: '2024-03-19',
    carrier: 'USPS',
    service: 'Priority Express',
    shippingCost: 18.75,
    trackingNumber: '9400111399562543345678',
    status: 'out_for_delivery',
    buyer: 'teatime_treasures',
    deliveredDate: null,
    estimatedDelivery: '2024-03-23'
  },
];

export function Shipping() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState('all');

  const filteredData = shippingData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCarrier = carrierFilter === 'all' || item.carrier === carrierFilter;
    return matchesSearch && matchesStatus && matchesCarrier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-600';
      case 'out_for_delivery': return 'bg-blue-600';
      case 'in_transit': return 'bg-yellow-600';
      case 'shipped': return 'bg-purple-600';
      case 'processing': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'in_transit': return 'In Transit';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCarrierLogo = (carrier: string) => {
    const colors = {
      'USPS': 'bg-blue-600',
      'FedEx': 'bg-purple-600',
      'UPS': 'bg-yellow-600'
    };
    return colors[carrier] || 'bg-gray-600';
  };

  const totalShippingCost = filteredData.reduce((sum, item) => sum + item.shippingCost, 0);
  const deliveredCount = filteredData.filter(item => item.status === 'delivered').length;
  const inTransitCount = filteredData.filter(item => item.status === 'in_transit' || item.status === 'out_for_delivery').length;

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Shipping Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Shipment
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Shipments</div>
                <div className="text-2xl font-semibold text-white">{filteredData.length}</div>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Delivered</div>
                <div className="text-2xl font-semibold text-green-400">{deliveredCount}</div>
              </div>
              <Truck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">In Transit</div>
                <div className="text-2xl font-semibold text-yellow-400">{inTransitCount}</div>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Shipping Costs</div>
                <div className="text-2xl font-semibold text-blue-400">{formatCurrency(totalShippingCost)}</div>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, tracking, or buyer..."
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
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Filter by carrier" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="USPS">USPS</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="UPS">UPS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300">Item Title</th>
                  <th className="text-left p-4 text-gray-300">Date Shipped</th>
                  <th className="text-left p-4 text-gray-300">Carrier</th>
                  <th className="text-right p-4 text-gray-300">Cost</th>
                  <th className="text-left p-4 text-gray-300">Tracking Number</th>
                  <th className="text-left p-4 text-gray-300">Buyer</th>
                  <th className="text-left p-4 text-gray-300">Est. Delivery</th>
                  <th className="text-center p-4 text-gray-300">Status</th>
                  <th className="text-center p-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                    <td className="p-4 text-white max-w-xs">
                      <div className="truncate">{item.title}</div>
                    </td>
                    <td className="p-4 text-gray-300">{formatDate(item.dateShipped)}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getCarrierLogo(item.carrier)}`}></div>
                        <span className="text-gray-300">{item.carrier}</span>
                        <span className="text-xs text-gray-400">({item.service})</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-300">{formatCurrency(item.shippingCost)}</td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      <div className="max-w-xs truncate">{item.trackingNumber}</div>
                    </td>
                    <td className="p-4 text-gray-300">{item.buyer}</td>
                    <td className="p-4 text-gray-300">
                      <div>{formatDate(item.estimatedDelivery)}</div>
                      {item.deliveredDate && (
                        <div className="text-xs text-green-400">
                          Delivered: {formatDate(item.deliveredDate)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={`${getStatusColor(item.status)} text-white`}>
                        {getStatusText(item.status)}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300">Recent Shipping Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                  <div>
                    <div className="text-gray-200 truncate max-w-xs">{item.title}</div>
                    <div className="text-xs text-gray-400">
                      {item.carrier} • {formatDate(item.dateShipped)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-300">{getStatusText(item.status)}</div>
                  <div className="text-xs text-gray-400">{formatCurrency(item.shippingCost)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}