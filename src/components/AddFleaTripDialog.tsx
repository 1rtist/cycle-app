import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useData } from './DataContext';
import { Plus } from 'lucide-react';

interface AddFleaTripDialogProps {
  trigger?: React.ReactNode;
}

export function AddFleaTripDialog({ trigger }: AddFleaTripDialogProps) {
  const { addFleaMarketTrip } = useData();
  const [open, setOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    id: '',
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    entryFee: 0,
    travelCost: 0,
    totalSpent: 0,
    itemsPurchased: 0,
    notes: ''
  });

  const updateField = (field: string, value: any) => {
    setNewTrip(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newTrip.name || !newTrip.location) return;
    
    const totalCost = newTrip.entryFee + newTrip.travelCost + newTrip.totalSpent;
    
    addFleaMarketTrip({
      ...newTrip,
      id: `FM-${Date.now()}`,
      totalCost
    });
    
    // Reset form
    setNewTrip({
      id: '',
      name: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      entryFee: 0,
      travelCost: 0,
      totalSpent: 0,
      itemsPurchased: 0,
      notes: ''
    });
    setOpen(false);
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="w-4 h-4 mr-2" />
      Add New Trip
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Flea Market Trip</DialogTitle>
          <DialogDescription className="text-gray-400">
            Record a new flea market visit with trip details, costs, and items purchased.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Flea Market Name</Label>
            <Input
              id="name"
              value={newTrip.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Rose Bowl Flea Market"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">Location</Label>
            <Input
              id="location"
              value={newTrip.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Pasadena, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">Trip Date</Label>
            <Input
              id="date"
              type="date"
              value={newTrip.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryFee" className="text-white">Entry Fee</Label>
              <Input
                id="entryFee"
                type="number"
                step="0.01"
                value={newTrip.entryFee}
                onChange={(e) => updateField('entryFee', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travelCost" className="text-white">Travel Cost</Label>
              <Input
                id="travelCost"
                type="number"
                step="0.01"
                value={newTrip.travelCost}
                onChange={(e) => updateField('travelCost', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalSpent" className="text-white">Items Cost</Label>
              <Input
                id="totalSpent"
                type="number"
                step="0.01"
                value={newTrip.totalSpent}
                onChange={(e) => updateField('totalSpent', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemsPurchased" className="text-white">Items Purchased</Label>
              <Input
                id="itemsPurchased"
                type="number"
                value={newTrip.itemsPurchased}
                onChange={(e) => updateField('itemsPurchased', parseInt(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={newTrip.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Add any notes about this trip..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!newTrip.name || !newTrip.location}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Add Trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}