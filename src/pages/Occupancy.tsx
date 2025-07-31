import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { 
  Users, 
  Bed, 
  Calendar, 
  TrendingUp,
  Clock,
  UserCheck,
  UserX,
  Building
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// SVG Illustration Component
const OccupancyIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48 mb-6">
    <defs>
      <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(215 100% 25%)" />
        <stop offset="100%" stopColor="hsl(197 100% 45%)" />
      </linearGradient>
      <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(44 99% 50%)" />
        <stop offset="100%" stopColor="hsl(44 99% 40%)" />
      </linearGradient>
    </defs>
    
    {/* Hotel Building */}
    <rect x="50" y="80" width="300" height="180" fill="url(#buildingGradient)" rx="8" />
    
    {/* Windows Grid */}
    {[...Array(6)].map((_, floor) => 
      [...Array(8)].map((_, room) => (
        <rect
          key={`${floor}-${room}`}
          x={70 + room * 35}
          y={100 + floor * 25}
          width="20"
          height="15"
          fill={Math.random() > 0.3 ? "url(#windowGradient)" : "hsl(206 33% 90%)"}
          rx="2"
        />
      ))
    )}
    
    {/* Roof */}
    <polygon points="30,80 200,30 370,80" fill="hsl(0 0% 40%)" />
    
    {/* Ground */}
    <rect x="0" y="260" width="400" height="40" fill="hsl(206 33% 94%)" />
    
    {/* Trees */}
    <circle cx="30" cy="240" r="20" fill="hsl(120 50% 40%)" />
    <rect x="28" y="240" width="4" height="25" fill="hsl(25 50% 30%)" />
    
    <circle cx="370" cy="235" r="25" fill="hsl(120 50% 40%)" />
    <rect x="368" y="235" width="4" height="30" fill="hsl(25 50% 30%)" />
  </svg>
);

interface OccupancyData {
  date: string;
  occupancy: number;
  available_rooms: number;
  occupied_rooms: number;
  revenue: number;
}

const Occupancy = () => {
  const { selectedHotel } = useHotel();
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedHotel) {
      fetchOccupancyData();
    }
  }, [selectedHotel]);

  const fetchOccupancyData = async () => {
    if (!selectedHotel) return;
    
    try {
      const { data, error } = await supabase
        .from('hotel_metrics')
        .select('*')
        .eq('hotel_id', selectedHotel.id)
        .order('month');

      if (error) throw error;

      // Transform data with additional occupancy metrics
      const transformedData = (data || []).map(item => ({
        date: item.month,
        occupancy: item.occupancy,
        available_rooms: 100, // Assuming 100 total rooms
        occupied_rooms: Math.floor((item.occupancy / 100) * 100),
        revenue: item.revenue
      }));

      setOccupancyData(transformedData);
    } catch (error) {
      console.error('Error fetching occupancy data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedHotel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Building className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Hotel Selected</h3>
            <p className="text-muted-foreground">Please select a hotel to view occupancy analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const avgOccupancy = occupancyData.length > 0 
    ? Math.round(occupancyData.reduce((sum, item) => sum + item.occupancy, 0) / occupancyData.length) 
    : 0;
  
  const totalRoomsOccupied = occupancyData.reduce((sum, item) => sum + item.occupied_rooms, 0);
  const currentOccupancy = occupancyData[occupancyData.length - 1]?.occupancy || 0;
  const previousOccupancy = occupancyData[occupancyData.length - 2]?.occupancy || 0;
  const occupancyChange = previousOccupancy > 0 
    ? ((currentOccupancy - previousOccupancy) / previousOccupancy * 100).toFixed(1)
    : '0';

  // Occupancy distribution for pie chart
  const occupancyDistribution = [
    { name: 'Occupied', value: currentOccupancy, fill: 'hsl(215 100% 25%)' },
    { name: 'Available', value: 100 - currentOccupancy, fill: 'hsl(206 33% 80%)' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Illustration */}
      <div className="booking-card p-6">
        <OccupancyIllustration />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Occupancy Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive room utilization insights for {selectedHotel.name} • {selectedHotel.location}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <EnhancedStatsCard
          title="Current Occupancy"
          value={`${currentOccupancy}%`}
          change={`${occupancyChange}% vs last month`}
          changeType={parseFloat(occupancyChange) >= 0 ? 'positive' : 'negative'}
          trend={parseFloat(occupancyChange) >= 0 ? 'up' : 'down'}
          icon={Users}
          badge={{ text: 'LIVE', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Average Occupancy"
          value={`${avgOccupancy}%`}
          description="12-month average"
          icon={TrendingUp}
          badge={{ text: 'YTD', variant: 'outline' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Rooms Occupied"
          value={occupancyData[occupancyData.length - 1]?.occupied_rooms || 0}
          description="Out of 100 total rooms"
          icon={Bed}
          badge={{ text: 'CURRENT', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Total Room Nights"
          value={totalRoomsOccupied}
          description="Past 12 months"
          icon={Calendar}
          badge={{ text: 'TOTAL', variant: 'outline' }}
          className="booking-card"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy Trend */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Occupancy Trend</span>
            </CardTitle>
            <CardDescription>Monthly occupancy rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215 100% 25%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(215 100% 25%)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stroke="hsl(215 100% 25%)"
                  fillOpacity={1}
                  fill="url(#occupancyGradient)"
                  name="Occupancy %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Current Occupancy Distribution */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Current Room Status</span>
            </CardTitle>
            <CardDescription>Real-time room availability breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupancyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Occupancy vs Revenue */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bed className="h-5 w-5 text-primary" />
              <span>Occupancy vs Revenue</span>
            </CardTitle>
            <CardDescription>Correlation between room utilization and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar yAxisId="left" dataKey="occupancy" fill="hsl(215 100% 25%)" name="Occupancy %" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(44 99% 50%)" strokeWidth={3} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Occupancy Pattern */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Rooms Occupied by Month</span>
            </CardTitle>
            <CardDescription>Number of rooms occupied each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="occupied_rooms"
                  stroke="hsl(197 100% 45%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(197 100% 45%)', strokeWidth: 2, r: 5 }}
                  name="Occupied Rooms"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <span>Peak Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Highest Occupancy:</span>
                <span className="font-semibold">{Math.max(...occupancyData.map(d => d.occupancy))}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best Month:</span>
                <span className="font-semibold">
                  {occupancyData.find(d => d.occupancy === Math.max(...occupancyData.map(d => d.occupancy)))?.date || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Performance:</span>
                <span className="font-semibold text-green-600">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-600" />
              <span>Improvement Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lowest Occupancy:</span>
                <span className="font-semibold">{Math.min(...occupancyData.map(d => d.occupancy))}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Challenging Month:</span>
                <span className="font-semibold">
                  {occupancyData.find(d => d.occupancy === Math.min(...occupancyData.map(d => d.occupancy)))?.date || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Opportunity:</span>
                <span className="font-semibold text-amber-600">Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Forecasts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projected Next Month:</span>
                <span className="font-semibold">{Math.min(95, currentOccupancy + 3)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trend:</span>
                <span className="font-semibold text-green-600">Upward</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <span className="font-semibold">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Occupancy;