import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { AdvancedAreaChart, GaugeChart, ComparisonChart } from '@/components/AdvancedCharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
  rooms_sold: number;
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
}

const Revenue = () => {
  const { selectedHotel } = useHotel();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedHotel) {
      fetchRevenueData();
    }
  }, [selectedHotel]);

  const fetchRevenueData = async () => {
    if (!selectedHotel) return;
    
    try {
      const { data, error } = await supabase
        .from('hotel_metrics')
        .select('*')
        .eq('hotel_id', selectedHotel.id)
        .order('month');

      if (error) throw error;

      // Transform data and add calculated metrics
      const transformedData = (data || []).map(item => ({
        month: item.month,
        revenue: item.revenue,
        profit: item.profit,
        rooms_sold: Math.floor((item.occupancy / 100) * 100), // Simulate rooms sold
        adr: Math.floor(item.revenue / Math.max(1, (item.occupancy / 100) * 100)), // Average Daily Rate
        revpar: Math.floor(item.revenue / 100) // Revenue Per Available Room
      }));

      setRevenueData(transformedData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
          <DollarSign className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Hotel Selected</h3>
            <p className="text-muted-foreground">Please select a hotel to view revenue analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgADR = revenueData.length > 0 ? Math.round(revenueData.reduce((sum, item) => sum + item.adr, 0) / revenueData.length) : 0;
  const avgRevPAR = revenueData.length > 0 ? Math.round(revenueData.reduce((sum, item) => sum + item.revpar, 0) / revenueData.length) : 0;

  // Calculate growth rates
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = currentMonth && previousMonth 
    ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
    : '0';
  
  const profitGrowth = currentMonth && previousMonth 
    ? ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1)
    : '0';

  // Prepare comparison data
  const comparisonData = [
    { metric: 'Revenue', current: currentMonth?.revenue || 0, previous: previousMonth?.revenue || 0, target: 500000 },
    { metric: 'Profit', current: currentMonth?.profit || 0, previous: previousMonth?.profit || 0, target: 200000 },
    { metric: 'ADR', current: currentMonth?.adr || 0, previous: previousMonth?.adr || 0, target: 300 },
    { metric: 'RevPAR', current: currentMonth?.revpar || 0, previous: previousMonth?.revpar || 0, target: 250 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Revenue Analysis</h1>
        <p className="text-muted-foreground">
          Comprehensive revenue insights for {selectedHotel.name} • {selectedHotel.location}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <EnhancedStatsCard
          title="Total Revenue"
          value={totalRevenue}
          change={`${revenueGrowth}% vs last month`}
          changeType={parseFloat(revenueGrowth) >= 0 ? 'positive' : 'negative'}
          trend={parseFloat(revenueGrowth) >= 0 ? 'up' : 'down'}
          icon={DollarSign}
          badge={{ text: 'YTD', variant: 'secondary' }}
        />
        
        <EnhancedStatsCard
          title="Total Profit"
          value={totalProfit}
          change={`${profitGrowth}% vs last month`}
          changeType={parseFloat(profitGrowth) >= 0 ? 'positive' : 'negative'}
          trend={parseFloat(profitGrowth) >= 0 ? 'up' : 'down'}
          icon={TrendingUp}
          badge={{ text: 'NET', variant: 'outline' }}
        />
        
        <EnhancedStatsCard
          title="Avg ADR"
          value={`$${avgADR}`}
          description="Average Daily Rate"
          icon={Target}
          badge={{ text: 'DAILY', variant: 'secondary' }}
        />
        
        <EnhancedStatsCard
          title="Avg RevPAR"
          value={`$${avgRevPAR}`}
          description="Revenue Per Available Room"
          icon={BarChart3}
          badge={{ text: 'EFFICIENCY', variant: 'secondary' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Revenue & Profit Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue and profit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1} />
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
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--secondary))"
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Performance vs Targets</span>
            </CardTitle>
            <CardDescription>Current vs previous month vs targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ComparisonChart data={comparisonData} height={300} />
          </CardContent>
        </Card>

        {/* ADR Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Average Daily Rate (ADR)</span>
            </CardTitle>
            <CardDescription>Daily rate performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line
                  type="monotone"
                  dataKey="adr"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="ADR ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RevPAR Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Revenue Per Available Room</span>
            </CardTitle>
            <CardDescription>RevPAR efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                <Bar dataKey="revpar" fill="hsl(var(--primary))" name="RevPAR ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Revenue;