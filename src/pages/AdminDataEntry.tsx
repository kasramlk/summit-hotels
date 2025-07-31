import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Download, BarChart3, Building2, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Hotel {
  id: string;
  name: string;
  location: string;
}

const AdminDataEntry = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  // Hotel Metrics Form State
  const [metricsData, setMetricsData] = useState({
    month: '',
    revenue: '',
    expenses: '',
    profit: '',
    occupancy: '',
  });

  // Revenue Data Form State
  const [revenueData, setRevenueData] = useState({
    restaurant_revenue: '',
    bar_revenue: '',
    room_service_revenue: '',
    event_catering_revenue: '',
    total_covers: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, location')
        .order('name');

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to load hotels');
    }
  };

  const handleMetricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) {
      toast.error('Please select a hotel');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_metrics')
        .insert([{
          hotel_id: selectedHotel,
          month: metricsData.month,
          revenue: parseFloat(metricsData.revenue),
          expenses: parseFloat(metricsData.expenses),
          profit: parseFloat(metricsData.profit),
          occupancy: parseInt(metricsData.occupancy),
        }]);

      if (error) throw error;

      toast.success('Hotel metrics added successfully');
      setMetricsData({
        month: '',
        revenue: '',
        expenses: '',
        profit: '',
        occupancy: '',
      });
    } catch (error) {
      console.error('Error adding metrics:', error);
      toast.error('Failed to add metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel || !date) {
      toast.error('Please select a hotel and date');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fb_revenue')
        .insert([{
          hotel_id: selectedHotel,
          revenue_date: format(date, 'yyyy-MM-dd'),
          restaurant_revenue: parseFloat(revenueData.restaurant_revenue) || 0,
          bar_revenue: parseFloat(revenueData.bar_revenue) || 0,
          room_service_revenue: parseFloat(revenueData.room_service_revenue) || 0,
          event_catering_revenue: parseFloat(revenueData.event_catering_revenue) || 0,
          total_covers: parseInt(revenueData.total_covers) || 0,
        }]);

      if (error) throw error;

      toast.success('F&B revenue data added successfully');
      setRevenueData({
        restaurant_revenue: '',
        bar_revenue: '',
        room_service_revenue: '',
        event_catering_revenue: '',
        total_covers: '',
      });
      setDate(undefined);
    } catch (error) {
      console.error('Error adding revenue data:', error);
      toast.error('Failed to add revenue data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Entry</h1>
        <p className="text-muted-foreground">
          Manually enter hotel metrics and operational data.
        </p>
      </div>

      {/* Hotel Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Hotel Selection</span>
          </CardTitle>
          <CardDescription>
            Select the hotel you want to add data for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel</Label>
            <Select value={selectedHotel} onValueChange={setSelectedHotel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Entry Forms */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Hotel Metrics</TabsTrigger>
          <TabsTrigger value="revenue">F&B Revenue</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="import">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Metrics</CardTitle>
              <CardDescription>
                Add monthly performance metrics for the selected hotel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMetricsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      placeholder="e.g., January 2024"
                      value={metricsData.month}
                      onChange={(e) => setMetricsData(prev => ({ ...prev, month: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupancy">Occupancy (%)</Label>
                    <Input
                      id="occupancy"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="85"
                      value={metricsData.occupancy}
                      onChange={(e) => setMetricsData(prev => ({ ...prev, occupancy: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Revenue ($)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      step="0.01"
                      placeholder="50000.00"
                      value={metricsData.revenue}
                      onChange={(e) => setMetricsData(prev => ({ ...prev, revenue: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Expenses ($)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      step="0.01"
                      placeholder="30000.00"
                      value={metricsData.expenses}
                      onChange={(e) => setMetricsData(prev => ({ ...prev, expenses: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit">Profit ($)</Label>
                    <Input
                      id="profit"
                      type="number"
                      step="0.01"
                      placeholder="20000.00"
                      value={metricsData.profit}
                      onChange={(e) => setMetricsData(prev => ({ ...prev, profit: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading || !selectedHotel}>
                  {loading ? 'Adding...' : 'Add Metrics'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>F&B Revenue</CardTitle>
              <CardDescription>
                Add daily food & beverage revenue data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRevenueSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant">Restaurant Revenue ($)</Label>
                    <Input
                      id="restaurant"
                      type="number"
                      step="0.01"
                      placeholder="2500.00"
                      value={revenueData.restaurant_revenue}
                      onChange={(e) => setRevenueData(prev => ({ ...prev, restaurant_revenue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bar">Bar Revenue ($)</Label>
                    <Input
                      id="bar"
                      type="number"
                      step="0.01"
                      placeholder="800.00"
                      value={revenueData.bar_revenue}
                      onChange={(e) => setRevenueData(prev => ({ ...prev, bar_revenue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-service">Room Service Revenue ($)</Label>
                    <Input
                      id="room-service"
                      type="number"
                      step="0.01"
                      placeholder="500.00"
                      value={revenueData.room_service_revenue}
                      onChange={(e) => setRevenueData(prev => ({ ...prev, room_service_revenue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catering">Event Catering Revenue ($)</Label>
                    <Input
                      id="catering"
                      type="number"
                      step="0.01"
                      placeholder="1200.00"
                      value={revenueData.event_catering_revenue}
                      onChange={(e) => setRevenueData(prev => ({ ...prev, event_catering_revenue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="covers">Total Covers</Label>
                    <Input
                      id="covers"
                      type="number"
                      placeholder="150"
                      value={revenueData.total_covers}
                      onChange={(e) => setRevenueData(prev => ({ ...prev, total_covers: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading || !selectedHotel || !date}>
                  {loading ? 'Adding...' : 'Add Revenue Data'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>
                Coming soon - operational metrics entry forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Operational Metrics</h3>
                <p className="text-muted-foreground">
                  Staff hours, maintenance requests, energy consumption, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Data Import</CardTitle>
              <CardDescription>
                Import data from CSV files for faster data entry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">CSV files only</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv" />
                  </label>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataEntry;