import React, { useEffect, useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Building2,
  Star,
  Target,
  AlertCircle
} from 'lucide-react';

interface MetricData {
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

const Dashboard = () => {
  const { selectedHotel } = useHotel();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [loading, setLoading] = useState(true);

  // Chart colors using design system
  const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  useEffect(() => {
    if (selectedHotel) {
      fetchMetrics();
      fetchSalesChannels();
    }
  }, [selectedHotel]);

  const fetchMetrics = async () => {
    if (!selectedHotel) return;

    try {
      const { data, error } = await supabase
        .from('hotel_metrics')
        .select('*')
        .eq('hotel_id', selectedHotel.id)
        .order('month');

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchSalesChannels = async () => {
    if (!selectedHotel) return;

    try {
      const { data, error } = await supabase
        .from('sales_channels')
        .select('*')
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;
      setSalesChannels(data || []);
    } catch (error) {
      console.error('Error fetching sales channels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const currentMonth = metrics[metrics.length - 1];
  const previousMonth = metrics[metrics.length - 2];
  
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = metrics.reduce((sum, m) => sum + m.profit, 0);
  const avgOccupancy = metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.occupancy, 0) / metrics.length) : 0;
  
  const revenueChange = currentMonth && previousMonth 
    ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
    : '0';
  
  const profitChange = currentMonth && previousMonth
    ? ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Hotel Selected</h3>
            <p className="text-muted-foreground">Please select a hotel to view the dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview for {selectedHotel.name} • {selectedHotel.location}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue}
          change={`${revenueChange}% from last month`}
          changeType={parseFloat(revenueChange) >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Profit"
          value={totalProfit}
          change={`${profitChange}% from last month`}
          changeType={parseFloat(profitChange) >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
        />
        <StatsCard
          title="Avg Occupancy"
          value={`${avgOccupancy}%`}
          description="12-month average"
          icon={Users}
        />
        <StatsCard
          title="Active Months"
          value={metrics.length}
          description="Data periods"
          icon={Calendar}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
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
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses */}
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Revenue vs Expenses</span>
            </CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
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
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Channels */}
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Sales Channels</span>
            </CardTitle>
            <CardDescription>Revenue distribution by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesChannels}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ channel_name, percentage }) => `${channel_name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {salesChannels.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Occupancy Rate</span>
            </CardTitle>
            <CardDescription>Monthly occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional insights */}
      {metrics.length === 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">No Data Available</h3>
                <p className="text-sm text-muted-foreground">
                  No metrics data found for {selectedHotel.name}. Please check if data has been imported.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;