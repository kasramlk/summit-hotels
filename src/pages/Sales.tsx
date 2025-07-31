import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { 
  PieChart, 
  TrendingUp, 
  Globe, 
  Smartphone,
  Users,
  Building
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area } from 'recharts';

// SVG Illustration Component
const SalesChannelIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48 mb-6">
    <defs>
      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(215 100% 25%)" />
        <stop offset="100%" stopColor="hsl(197 100% 45%)" />
      </linearGradient>
      <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(44 99% 50%)" />
        <stop offset="100%" stopColor="hsl(44 99% 40%)" />
      </linearGradient>
    </defs>
    
    {/* Desktop/Laptop */}
    <rect x="50" y="120" width="120" height="80" fill="url(#screenGradient)" rx="8" />
    <rect x="60" y="130" width="100" height="60" fill="hsl(206 33% 96%)" rx="4" />
    <rect x="110" y="200" width="20" height="30" fill="hsl(0 0% 40%)" />
    <ellipse cx="120" cy="240" rx="40" ry="8" fill="hsl(0 0% 40%)" />
    
    {/* Smartphone */}
    <rect x="200" y="100" width="50" height="100" fill="url(#phoneGradient)" rx="12" />
    <rect x="210" y="110" width="30" height="50" fill="hsl(206 33% 96%)" rx="4" />
    <circle cx="225" cy="175" r="8" fill="hsl(206 33% 90%)" />
    
    {/* Tablet */}
    <rect x="280" y="110" width="80" height="60" fill="hsl(197 100% 45%)" rx="8" />
    <rect x="290" y="120" width="60" height="40" fill="hsl(206 33% 96%)" rx="4" />
    
    {/* Connection Lines */}
    <path d="M 120 120 Q 200 80 225 100" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    <path d="M 225 200 Q 250 220 280 160" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    <path d="M 170 160 Q 200 140 280 140" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    
    {/* Analytics Icons */}
    <circle cx="120" cy="50" r="15" fill="hsl(215 100% 25%)" />
    <text x="120" y="55" textAnchor="middle" fill="white" fontSize="12">📊</text>
    
    <circle cx="225" cy="50" r="15" fill="hsl(197 100% 45%)" />
    <text x="225" y="55" textAnchor="middle" fill="white" fontSize="12">📱</text>
    
    <circle cx="320" cy="50" r="15" fill="hsl(44 99% 50%)" />
    <text x="320" y="55" textAnchor="middle" fill="hsl(215 100% 25%)" fontSize="12">🌐</text>
  </svg>
);

interface SalesChannelData {
  channel_name: string;
  percentage: number;
  revenue: number;
  bookings: number;
  trend: string;
}

const Sales = () => {
  const { selectedHotel } = useHotel();
  const [salesData, setSalesData] = useState<SalesChannelData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedHotel) {
      fetchSalesData();
    }
  }, [selectedHotel]);

  const fetchSalesData = async () => {
    if (!selectedHotel) return;
    
    try {
      // Fetch sales channels
      const { data: channels, error: channelsError } = await supabase
        .from('sales_channels')
        .select('*')
        .eq('hotel_id', selectedHotel.id);

      if (channelsError) throw channelsError;

      // Fetch hotel metrics for revenue calculation
      const { data: metrics, error: metricsError } = await supabase
        .from('hotel_metrics')
        .select('*')
        .eq('hotel_id', selectedHotel.id)
        .order('month');

      if (metricsError) throw metricsError;

      // Transform and enhance data
      const totalRevenue = metrics?.reduce((sum, m) => sum + m.revenue, 0) || 0;
      
      const enhancedChannels = (channels || []).map(channel => ({
        ...channel,
        revenue: Math.round((channel.percentage / 100) * totalRevenue),
        bookings: Math.round((channel.percentage / 100) * 2500), // Simulated bookings
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }));

      setSalesData(enhancedChannels);

      // Create monthly trends data
      const trends = (metrics || []).map(item => ({
        month: item.month,
        direct: Math.round(item.revenue * 0.35),
        booking_com: Math.round(item.revenue * 0.25),
        expedia: Math.round(item.revenue * 0.20),
        corporate: Math.round(item.revenue * 0.15),
        walk_in: Math.round(item.revenue * 0.05)
      }));

      setMonthlyTrends(trends);
    } catch (error) {
      console.error('Error fetching sales data:', error);
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
            <p className="text-muted-foreground">Please select a hotel to view sales analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = salesData.reduce((sum, item) => sum + item.bookings, 0);
  const topChannel = salesData.reduce((prev, current) => 
    prev.percentage > current.percentage ? prev : current
  );
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Colors for charts
  const COLORS = [
    'hsl(215 100% 25%)', // Resolution Blue
    'hsl(197 100% 45%)', // Cerulean
    'hsl(44 99% 50%)',   // Yellow
    'hsl(0 0% 40%)',     // Gray
    'hsl(206 33% 70%)'   // Light Gray
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Illustration */}
      <div className="booking-card p-6">
        <SalesChannelIllustration />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sales Channel Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive booking channel performance for {selectedHotel.name} • {selectedHotel.location}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <EnhancedStatsCard
          title="Total Channel Revenue"
          value={totalRevenue}
          description="All channels combined"
          icon={TrendingUp}
          badge={{ text: 'YTD', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Total Bookings"
          value={totalBookings}
          description="Across all channels"
          icon={Users}
          badge={{ text: 'TOTAL', variant: 'outline' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Top Channel"
          value={topChannel?.channel_name || 'N/A'}
          description={`${topChannel?.percentage || 0}% of revenue`}
          icon={PieChart}
          badge={{ text: 'LEADER', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Avg Booking Value"
          value={`$${avgBookingValue}`}
          description="Per reservation"
          icon={Globe}
          badge={{ text: 'AVG', variant: 'outline' }}
          className="booking-card"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Channel Distribution */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Revenue Distribution by Channel</span>
            </CardTitle>
            <CardDescription>Percentage breakdown of revenue sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ channel_name, percentage }) => `${channel_name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Channel Performance</span>
            </CardTitle>
            <CardDescription>Revenue and bookings by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel_name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(215 100% 25%)" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Channel Trends */}
        <Card className="booking-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Monthly Channel Trends</span>
            </CardTitle>
            <CardDescription>Revenue trends by channel over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215 100% 25%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(215 100% 25%)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(197 100% 45%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(197 100% 45%)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="expediaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(44 99% 50%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(44 99% 50%)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="direct"
                  stackId="1"
                  stroke="hsl(215 100% 25%)"
                  fill="url(#directGradient)"
                  name="Direct Booking"
                />
                <Area
                  type="monotone"
                  dataKey="booking_com"
                  stackId="1"
                  stroke="hsl(197 100% 45%)"
                  fill="url(#bookingGradient)"
                  name="Booking.com"
                />
                <Area
                  type="monotone"
                  dataKey="expedia"
                  stackId="1"
                  stroke="hsl(44 99% 50%)"
                  fill="url(#expediaGradient)"
                  name="Expedia"
                />
                <Area
                  type="monotone"
                  dataKey="corporate"
                  stackId="1"
                  stroke="hsl(0 0% 40%)"
                  fill="hsl(0 0% 40%)"
                  fillOpacity={0.6}
                  name="Corporate"
                />
                <Area
                  type="monotone"
                  dataKey="walk_in"
                  stackId="1"
                  stroke="hsl(206 33% 70%)"
                  fill="hsl(206 33% 70%)"
                  fillOpacity={0.6}
                  name="Walk-in"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Channel Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {salesData.map((channel, index) => (
          <Card key={channel.channel_name} className="booking-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {channel.channel_name === 'Direct Booking' && <Globe className="h-5 w-5 text-primary" />}
                {channel.channel_name === 'Booking.com' && <Smartphone className="h-5 w-5 text-secondary" />}
                {channel.channel_name === 'Expedia' && <Users className="h-5 w-5 text-accent" />}
                {(channel.channel_name === 'Corporate' || channel.channel_name === 'Walk-in') && <Building className="h-5 w-5 text-muted-foreground" />}
                <span>{channel.channel_name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue Share:</span>
                  <span className="font-semibold">{channel.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue:</span>
                  <span className="font-semibold">${channel.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bookings:</span>
                  <span className="font-semibold">{channel.bookings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trend:</span>
                  <span className={`font-semibold ${channel.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {channel.trend === 'up' ? '📈 Growing' : '📉 Declining'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sales;