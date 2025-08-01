import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Cell,
  Pie,
  Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useHotel } from '@/context/HotelContext';

interface HotelMetric {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  occupancy: number;
}

interface SalesChannel {
  channel_name: string;
  percentage: number;
}

const CHANNEL_COLORS = {
  'Direct Booking': '#8B5CF6',
  'Booking.com': '#3B82F6',
  'Expedia': '#F59E0B',
  'Hotels.com': '#EF4444',
  'Agoda': '#10B981'
};

const AnimatedKPI = ({ title, value, change, icon: Icon, color }: any) => (
  <Card className="overflow-hidden relative bg-gradient-to-br from-background to-background/50 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 group">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${color} transition-transform duration-300 group-hover:scale-110`} />
    </CardHeader>
    <CardContent className="relative">
      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {value}
      </div>
      {change && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className={`inline-flex items-center ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </span>
          {' '}vs last month
        </p>
      )}
    </CardContent>
  </Card>
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
        style={{
          left: `${20 + i * 20}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + i}s`
        }}
      />
    ))}
  </div>
);

export default function AnalyticsDashboard() {
  const { selectedHotel, hotels } = useHotel();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('occurred');
  const [hotelMetrics, setHotelMetrics] = useState<HotelMetric[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);

  useEffect(() => {
    if (selectedHotel) {
      fetchAnalyticsData();
    }
  }, [selectedHotel]);

  const fetchAnalyticsData = async () => {
    if (!selectedHotel) return;
    
    setLoading(true);
    try {
      // Fetch hotel metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('hotel_metrics')
        .select('*')
        .eq('hotel_id', selectedHotel.id)
        .order('month');

      if (metricsError) throw metricsError;

      // Fetch sales channels
      const { data: channelsData, error: channelsError } = await supabase
        .from('sales_channels')
        .select('*')
        .eq('hotel_id', selectedHotel.id);

      if (channelsError) throw channelsError;

      setHotelMetrics(metricsData || []);
      setSalesChannels(channelsData || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const chartData = hotelMetrics.map(metric => ({
    month: metric.month.split(' ')[0], // Get month name only
    revenue: Number(metric.revenue),
    profit: Number(metric.profit),
    occupancy: metric.occupancy
  }));

  const channelData = salesChannels.map(channel => ({
    name: channel.channel_name,
    value: channel.percentage,
    percentage: channel.percentage
  }));

  // Calculate KPIs
  const totalRevenue = hotelMetrics.reduce((sum, metric) => sum + Number(metric.revenue), 0);
  const totalProfit = hotelMetrics.reduce((sum, metric) => sum + Number(metric.profit), 0);
  const avgOccupancy = hotelMetrics.length > 0 
    ? hotelMetrics.reduce((sum, metric) => sum + metric.occupancy, 0) / hotelMetrics.length 
    : 0;
  const bestChannel = salesChannels.reduce((best, current) => 
    current.percentage > (best?.percentage || 0) ? current : best, null as SalesChannel | null);

  // Calculate month-over-month growth
  const revenueGrowth = hotelMetrics.length >= 2 
    ? ((Number(hotelMetrics[hotelMetrics.length - 1]?.revenue) - Number(hotelMetrics[hotelMetrics.length - 2]?.revenue)) / Number(hotelMetrics[hotelMetrics.length - 2]?.revenue) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading premium analytics...</p>
        </div>
      </div>
    );
  }

  if (!selectedHotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="max-w-md w-full mx-4 border-2 border-primary/20 bg-background/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Premium Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Please select a hotel to view analytics</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto p-6 space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Premium Analytics
                </h1>
                <p className="text-muted-foreground">
                  {selectedHotel.name} • {selectedHotel.location}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Live Data
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedKPI
            title="Total Revenue"
            value={`₺${totalRevenue.toLocaleString()}`}
            change={`${revenueGrowth.startsWith('-') ? '' : '+'}${revenueGrowth}%`}
            icon={DollarSign}
            color="text-green-600"
          />
          <AnimatedKPI
            title="Total Profit"
            value={`₺${totalProfit.toLocaleString()}`}
            change="+8.3%"
            icon={TrendingUp}
            color="text-blue-600"
          />
          <AnimatedKPI
            title="Average Occupancy"
            value={`${avgOccupancy.toFixed(1)}%`}
            change="+5.2%"
            icon={Users}
            color="text-purple-600"
          />
          <AnimatedKPI
            title="Best Channel"
            value={bestChannel?.channel_name || 'N/A'}
            change="+15.7%"
            icon={CalendarDays}
            color="text-orange-600"
          />
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-primary/20">
            <TabsTrigger 
              value="occurred" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Gerçekleşen Konaklamalar
            </TabsTrigger>
            <TabsTrigger 
              value="future"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Satış Performansı & Gelecek Rezervasyonlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="occurred" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Trend */}
              <Card className="border-2 border-primary/10 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <span>Monthly Revenue Trend - 2024</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Distribution */}
              <Card className="border-2 border-primary/10 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <span>Sales Channel Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                        >
                          {channelData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHANNEL_COLORS[entry.name as keyof typeof CHANNEL_COLORS] || '#8884d8'} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Table */}
            <Card className="border-2 border-primary/10 bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Monthly Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3">Month</th>
                        <th className="text-right p-3">Revenue</th>
                        <th className="text-right p-3">Expenses</th>
                        <th className="text-right p-3">Profit</th>
                        <th className="text-right p-3">Occupancy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelMetrics.map((metric, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-primary/5">
                          <td className="p-3 font-medium">{metric.month}</td>
                          <td className="text-right p-3">₺{Number(metric.revenue).toLocaleString()}</td>
                          <td className="text-right p-3">₺{Number(metric.expenses).toLocaleString()}</td>
                          <td className="text-right p-3">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              ₺{Number(metric.profit).toLocaleString()}
                            </Badge>
                          </td>
                          <td className="text-right p-3">{metric.occupancy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profit Trend */}
              <Card className="border-2 border-primary/10 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Profit Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Occupancy Trend */}
              <Card className="border-2 border-primary/10 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Occupancy Rate Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="occupancy" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}