import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Hotel {
  id: string;
  name: string;
  location: string;
  description?: string;
  created_at: string;
  user_count?: number;
}

const AdminHotelManagement = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          user_hotels (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const hotelsWithUserCount = data?.map(hotel => ({
        ...hotel,
        user_count: hotel.user_hotels?.length || 0,
      })) || [];

      setHotels(hotelsWithUserCount);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.rpc('admin_create_hotel', {
        hotel_name: formData.name,
        hotel_location: formData.location,
        hotel_description: formData.description || null
      });

      if (error) throw error;

      await fetchHotels(); // Refresh the list
      setFormData({ name: '', location: '', description: '' });
      setIsAddDialogOpen(false);
      toast.success('Hotel added successfully');
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast.error('Failed to add hotel');
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('admin_delete_hotel', {
        hotel_id: hotelId
      });

      if (error) throw error;

      await fetchHotels(); // Refresh the list
      toast.success('Hotel deleted successfully');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Management</h1>
          <p className="text-muted-foreground">
            Manage all hotels in the system and their configurations.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Create a new hotel property in the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddHotel} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Hotel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>{hotel.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.location}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteHotel(hotel.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hotel.description && (
                  <p className="text-sm text-muted-foreground">
                    {hotel.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{hotel.user_count} users</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Added {new Date(hotel.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hotels.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first hotel.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminHotelManagement;