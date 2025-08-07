import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin,
  Calendar,
  Users,
  BarChart3,
  Search,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Hotel {
  id: string;
  name: string;
  location: string;
  description?: string;
  created_at: string;
}

interface HotelStats {
  hotel_id: string;
  total_users: number;
  total_revenue: number;
  avg_occupancy: number;
}

export default function AdminHotelManagement() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelStats, setHotelStats] = useState<HotelStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const { toast } = useToast();

  const [newHotel, setNewHotel] = useState({
    name: '',
    location: '',
    description: ''
  });

  const [editHotel, setEditHotel] = useState({
    name: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch hotels
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (hotelsError) throw hotelsError;

      // Fetch hotel statistics
      const hotelStatsPromises = (hotelsData || []).map(async (hotel) => {
        // Count users
        const { count: userCount } = await supabase
          .from('user_hotels')
          .select('*', { count: 'exact', head: true })
          .eq('hotel_id', hotel.id);

        // Get revenue data
        const { data: metricsData } = await supabase
          .from('hotel_metrics')
          .select('revenue, occupancy')
          .eq('hotel_id', hotel.id);

        const totalRevenue = metricsData?.reduce((sum, metric) => sum + Number(metric.revenue), 0) || 0;
        const avgOccupancy = metricsData?.length 
          ? metricsData.reduce((sum, metric) => sum + metric.occupancy, 0) / metricsData.length 
          : 0;

        return {
          hotel_id: hotel.id,
          total_users: userCount || 0,
          total_revenue: totalRevenue,
          avg_occupancy: Math.round(avgOccupancy)
        };
      });

      const statsData = await Promise.all(hotelStatsPromises);

      setHotels(hotelsData || []);
      setHotelStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load hotel data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createHotel = async () => {
    try {
      const { error } = await supabase.rpc('admin_create_hotel', {
        hotel_name: newHotel.name,
        hotel_location: newHotel.location,
        hotel_description: newHotel.description || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel created successfully"
      });

      setIsCreateDialogOpen(false);
      setNewHotel({ name: '', location: '', description: '' });
      fetchData();
    } catch (error: any) {
      console.error('Error creating hotel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create hotel",
        variant: "destructive"
      });
    }
  };

  const updateHotel = async () => {
    if (!selectedHotel) return;

    try {
      const { error } = await supabase
        .from('hotels')
        .update({
          name: editHotel.name,
          location: editHotel.location,
          description: editHotel.description
        })
        .eq('id', selectedHotel.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel updated successfully"
      });

      setIsEditDialogOpen(false);
      setSelectedHotel(null);
      fetchData();
    } catch (error: any) {
      console.error('Error updating hotel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update hotel",
        variant: "destructive"
      });
    }
  };

  const deleteHotel = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('admin_delete_hotel', {
        hotel_id: hotelId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel deleted successfully"
      });

      fetchData();
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete hotel",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setEditHotel({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || ''
    });
    setIsEditDialogOpen(true);
  };

  // Filter hotels
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHotelStats = (hotelId: string) => {
    return hotelStats.find(stat => stat.hotel_id === hotelId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Hotel Management
              </h1>
              <p className="text-muted-foreground">
                Manage hotels and their configurations
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Hotel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                    placeholder="Grand Hotel"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newHotel.location}
                    onChange={(e) => setNewHotel({...newHotel, location: e.target.value})}
                    placeholder="Istanbul, Turkey"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newHotel.description}
                    onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
                    placeholder="Luxury hotel with modern amenities..."
                    rows={3}
                  />
                </div>
                <Button onClick={createHotel} className="w-full">
                  Create Hotel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotels.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotelStats.reduce((sum, stat) => sum + stat.total_users, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₺{hotelStats.reduce((sum, stat) => sum + stat.total_revenue, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotelStats.length > 0 
                ? Math.round(hotelStats.reduce((sum, stat) => sum + stat.avg_occupancy, 0) / hotelStats.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hotels ({filteredHotels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((hotel) => {
                  const stats = getHotelStats(hotel.id);
                  return (
                    <TableRow key={hotel.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{hotel.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {hotel.location}
                          </div>
                          {hotel.description && (
                            <div className="text-xs text-muted-foreground max-w-xs truncate">
                              {hotel.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {stats?.total_users || 0} users
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₺{(stats?.total_revenue || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {stats?.avg_occupancy || 0}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(hotel.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(hotel)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHotel(hotel.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Hotel Name</Label>
              <Input
                id="edit_name"
                value={editHotel.name}
                onChange={(e) => setEditHotel({...editHotel, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_location">Location</Label>
              <Input
                id="edit_location"
                value={editHotel.location}
                onChange={(e) => setEditHotel({...editHotel, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={editHotel.description}
                onChange={(e) => setEditHotel({...editHotel, description: e.target.value})}
                rows={3}
              />
            </div>
            <Button onClick={updateHotel} className="w-full">
              Update Hotel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}