import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useData } from './DataContext';
import { Plus } from 'lucide-react';

interface AddStorageTripDialogProps {
  trigger?: React.ReactNode;
}

export function AddStorageTripDialog({ trigger }: AddStorageTripDialogProps) {
  const { storageUnits, addStorageTrip, addStorageUnit } = useData();
  const [open, setOpen] = useState(false);
  const [isCreatingNewUnit, setIsCreatingNewUnit] = useState(false);
  const [newTrip, setNewTrip] = useState({
    unitId: '',
    date: new Date().toISOString().split('T')[0],
    unitCost: 0,
    travelCost: 0,
    fees: 0,
    itemsFound: 0,
    notes: ''
  });
  const [newStorageUnit, setNewStorageUnit] = useState({
    id: '',
    name: '',
    location: '',
    monthlyFee: 0
  });

  const updateField = (field: string, value: any) => {
    setNewTrip(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isCreatingNewUnit) {
      if (!newStorageUnit.id || !newStorageUnit.name) return;
      
      // Create the new storage unit first
      addStorageUnit({
        id: newStorageUnit.id,
        name: newStorageUnit.name,
        location: newStorageUnit.location,
        monthlyFee: newStorageUnit.monthlyFee,
        totalCost: newStorageUnit.monthlyFee,
        dateAcquired: newTrip.date,
        isActive: true
      });
      
      // Use the new unit ID for the trip
      const totalCost = newTrip.unitCost + newTrip.travelCost + newTrip.fees;
      addStorageTrip({
        ...newTrip,
        unitId: newStorageUnit.id,
        totalCost
      });
    } else {
      if (!newTrip.unitId) return;
      
      const totalCost = newTrip.unitCost + newTrip.travelCost + newTrip.fees;
      addStorageTrip({
        ...newTrip,
        totalCost
      });
    }
    
    // Reset form
    setNewTrip({
      unitId: '',
      date: new Date().toISOString().split('T')[0],
      unitCost: 0,
      travelCost: 0,
      fees: 0,
      itemsFound: 0,
      notes: ''
    });
    setNewStorageUnit({
      id: '',
      name: '',
      location: '',
      monthlyFee: 0
    });
    setIsCreatingNewUnit(false);
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
          <DialogTitle className="text-white">Add Storage Unit Trip</DialogTitle>
          <DialogDescription className="text-gray-400">
            Record a new trip to one of your storage units with associated costs and items found.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Storage Unit Selection/Creation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Storage Unit</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingNewUnit(!isCreatingNewUnit)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                {isCreatingNewUnit ? 'Select Existing' : 'Create New'}
              </Button>
            </div>
            
            {isCreatingNewUnit ? (
              <div className="space-y-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="unitName" className="text-white text-sm">Storage Unit Name</Label>
                    <Input
                      id="unitName"
                      value={newStorageUnit.name}
                      onChange={(e) => setNewStorageUnit(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Unit A, Big Storage, etc."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitId" className="text-white text-sm">Unit ID</Label>
                    <Input
                      id="unitId"
                      value={newStorageUnit.id}
                      onChange={(e) => setNewStorageUnit(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="SU-001, A-123, etc."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="unitLocation" className="text-white text-sm">Location</Label>
                    <Input
                      id="unitLocation"
                      value={newStorageUnit.location}
                      onChange={(e) => setNewStorageUnit(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="123 Main St, City"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyFee" className="text-white text-sm">Monthly Fee</Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      step="0.01"
                      value={newStorageUnit.monthlyFee}
                      onChange={(e) => setNewStorageUnit(prev => ({ ...prev, monthlyFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Select value={newTrip.unitId} onValueChange={(value) => updateField('unitId', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select storage unit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {storageUnits.map(unit => (
                    <SelectItem key={unit.id} value={unit.id} className="text-white">
                      {unit.name} - {unit.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
              <Label htmlFor="unitCost" className="text-white">Unit Cost</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={newTrip.unitCost}
                onChange={(e) => updateField('unitCost', parseFloat(e.target.value) || 0)}
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
              <Label htmlFor="fees" className="text-white">Additional Fees</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                value={newTrip.fees}
                onChange={(e) => updateField('fees', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemsFound" className="text-white">Items Found</Label>
              <Input
                id="itemsFound"
                type="number"
                value={newTrip.itemsFound}
                onChange={(e) => updateField('itemsFound', parseInt(e.target.value) || 0)}
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
              disabled={isCreatingNewUnit ? (!newStorageUnit.id || !newStorageUnit.name) : !newTrip.unitId}
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