import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { 
  GitCompare, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Star,
  DollarSign,
  Users,
  Building
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// SVG Illustration Component
const ComparisonIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48 mb-6">
    <defs>
      <linearGradient id="beforeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(0 0% 60%)" />
        <stop offset="100%" stopColor="hsl(0 0% 40%)" />
      </linearGradient>
      <linearGradient id="afterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(215 100% 25%)" />
        <stop offset="100%" stopColor="hsl(197 100% 45%)" />
      </linearGradient>
      <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(44 99% 50%)" />
        <stop offset="100%" stopColor="hsl(44 99% 40%)" />
      </linearGradient>
    </defs>
    
    {/* Before Building (Left) */}
    <rect x="30" y="120" width="120" height="100" fill="url(#beforeGradient)" rx="8" />
    <text x="90" y="175" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">BEFORE</text>
    
    {/* Windows - Before */}
    {[...Array(3)].map((_, floor) => 
      [...Array(4)].map((_, room) => (
        <rect
          key={`before-${floor}-${room}`}
          x={40 + room * 25}
          y={130 + floor * 25}
          width="15"
          height="12"
          fill={Math.random() > 0.7 ? "hsl(44 99% 50%)" : "hsl(0 0% 80%)"}
          rx="2"
        />
      ))
    )}
    
    {/* Arrow */}
    <path d="M 170 170 L 210 170" stroke="url(#arrowGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" />
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="hsl(44 99% 50%)" />
      </marker>
    </defs>
    
    {/* After Building (Right) */}
    <rect x="250" y="100" width="120" height="120" fill="url(#afterGradient)" rx="8" />
    <text x="310" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">AFTER</text>
    
    {/* Windows - After */}
    {[...Array(4)].map((_, floor) => 
      [...Array(4)].map((_, room) => (
        <rect
          key={`after-${floor}-${room}`}
          x={260 + room * 25}
          y={110 + floor * 25}
          width="15"
          height="12"
          fill={Math.random() > 0.2 ? "hsl(44 99% 50%)" : "hsl(206 33% 90%)"}
          rx="2"
        />
      ))
    )}
    
    {/* Improvement Indicators */}
    <circle cx="90" cy="80" r="25" fill="hsl(0 0% 40%)" opacity="0.8" />
    <text x="90" y="85" textAnchor="middle" fill="white" fontSize="12">65%</text>
    
    <circle cx="310" cy="60" r="25" fill="hsl(120 50% 45%)" opacity="0.8" />
    <text x="310" y="65" textAnchor="middle" fill="white" fontSize="12">89%</text>
    
    {/* Performance Bars */}
    <rect x="50" y="250" width="80" height="12" fill="hsl(0 0% 60%)" rx="6" />
    <rect x="50" y="250" width="52" height="12" fill="hsl(0 84% 60%)" rx="6" />
    
    <rect x="270" y="250" width="80" height="12" fill="hsl(215 100% 25%)" rx="6" />
    <rect x="270" y="250" width="72" height="12" fill="hsl(120 50% 45%)" rx="6" />
  </svg>
);

interface ComparisonData {
  metric: string;
  before: number;
  after: number;
  improvement: number;
  unit: string;
}

const Comparison = () => {
  const { selectedHotel } = useHotel();
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedHotel) {
      fetchComparisonData();
    }
  }, [selectedHotel]);

  const fetchComparisonData = async () => {
    if (!selectedHotel) return;
    
    try {
      // Fetch comparison data
      const { data, error } = await supabase
        .from('hotel_comparisons')
        .select('*')
        .eq('hotel_id', selectedHotel.id);

      if (error) throw error;

      if (data && data.length > 0) {
        // Use actual comparison data
        const comparison = data[0];
        const comparisonMetrics = [
          {
            metric: 'Revenue',
            before: comparison.revenue_before,
            after: comparison.revenue_after,
            improvement: ((comparison.revenue_after - comparison.revenue_before) / comparison.revenue_before * 100),
            unit: '$'
          },
          {
            metric: 'Occupancy',
            before: comparison.occupancy_before,
            after: comparison.occupancy_after,
            improvement: ((comparison.occupancy_after - comparison.occupancy_before) / comparison.occupancy_before * 100),
            unit: '%'
          },
          {
            metric: 'ADR',
            before: comparison.adr_before,
            after: comparison.adr_after,
            improvement: ((comparison.adr_after - comparison.adr_before) / comparison.adr_before * 100),
            unit: '$'
          },
          {
            metric: 'Review Score',
            before: comparison.review_score_before,
            after: comparison.review_score_after,
            improvement: ((comparison.review_score_after - comparison.review_score_before) / comparison.review_score_before * 100),
            unit: '/5'
          }
        ];
        setComparisonData(comparisonMetrics);
      } else {
        // Generate sample comparison data
        const sampleData = [
          {
            metric: 'Revenue',
            before: 320000,
            after: 450000,
            improvement: 40.6,
            unit: '$'
          },
          {
            metric: 'Occupancy',
            before: 65,
            after: 85,
            improvement: 30.8,
            unit: '%'
          },
          {
            metric: 'ADR',
            before: 180,
            after: 250,
            improvement: 38.9,
            unit: '$'
          },
          {
            metric: 'Review Score',
            before: 3.8,
            after: 4.6,
            improvement: 21.1,
            unit: '/5'
          },
          {
            metric: 'Staff Efficiency',
            before: 72,
            after: 89,
            improvement: 23.6,
            unit: '%'
          },
          {
            metric: 'Guest Satisfaction',
            before: 78,
            after: 92,
            improvement: 17.9,
            unit: '%'
          }
        ];
        setComparisonData(sampleData);
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
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
            <p className="text-muted-foreground">Please select a hotel to view comparison analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall metrics
  const avgImprovement = comparisonData.reduce((sum, item) => sum + item.improvement, 0) / comparisonData.length;
  const bestImprovement = Math.max(...comparisonData.map(item => item.improvement));
  const totalRevenuIncrease = comparisonData.find(item => item.metric === 'Revenue')?.improvement || 0;
  const occupancyIncrease = comparisonData.find(item => item.metric === 'Occupancy')?.improvement || 0;

  // Prepare radar chart data
  const radarData = comparisonData.slice(0, 6).map(item => ({
    metric: item.metric,
    before: item.before,
    after: item.after,
    fullMark: Math.max(item.before, item.after) * 1.2
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Illustration */}
      <div className="booking-card p-6">
        <ComparisonIllustration />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Before/After Comparison</h1>
          <p className="text-muted-foreground">
            Performance transformation analysis for {selectedHotel.name} • {selectedHotel.location}
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <EnhancedStatsCard
          title="Average Improvement"
          value={`${avgImprovement.toFixed(1)}%`}
          description="Across all metrics"
          icon={TrendingUp}
          trend="up"
          badge={{ text: 'OVERALL', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Revenue Growth"
          value={`${totalRevenuIncrease.toFixed(1)}%`}
          description="Revenue increase"
          icon={DollarSign}
          trend="up"
          badge={{ text: 'REVENUE', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Occupancy Boost"
          value={`${occupancyIncrease.toFixed(1)}%`}
          description="Occupancy improvement"
          icon={Users}
          trend="up"
          badge={{ text: 'OCCUPANCY', variant: 'outline' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Best Metric"
          value={`${bestImprovement.toFixed(1)}%`}
          description="Top improvement"
          icon={Award}
          trend="up"
          badge={{ text: 'BEST', variant: 'secondary' }}
          className="booking-card"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Before vs After Comparison */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <span>Before vs After Metrics</span>
            </CardTitle>
            <CardDescription>Direct comparison of key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="before" fill="hsl(0 0% 60%)" name="Before" />
                <Bar dataKey="after" fill="hsl(215 100% 25%)" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Performance Radar</span>
            </CardTitle>
            <CardDescription>360° view of improvements across all metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
                <Radar
                  name="Before"
                  dataKey="before"
                  stroke="hsl(0 0% 60%)"
                  fill="hsl(0 0% 60%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="After"
                  dataKey="after"
                  stroke="hsl(215 100% 25%)"
                  fill="hsl(215 100% 25%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Improvement Percentage */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Improvement Rates</span>
            </CardTitle>
            <CardDescription>Percentage improvement for each metric</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="metric" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Improvement']}
                />
                <Bar 
                  dataKey="improvement" 
                  fill="hsl(120 50% 45%)" 
                  name="Improvement %" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Timeline Visualization */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Transformation Journey</span>
            </CardTitle>
            <CardDescription>Performance evolution over the implementation period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={[
                  { phase: 'Initial', revenue: comparisonData.find(d => d.metric === 'Revenue')?.before || 0, occupancy: comparisonData.find(d => d.metric === 'Occupancy')?.before || 0 },
                  { phase: 'Month 1', revenue: (comparisonData.find(d => d.metric === 'Revenue')?.before || 0) * 1.1, occupancy: (comparisonData.find(d => d.metric === 'Occupancy')?.before || 0) * 1.05 },
                  { phase: 'Month 2', revenue: (comparisonData.find(d => d.metric === 'Revenue')?.before || 0) * 1.2, occupancy: (comparisonData.find(d => d.metric === 'Occupancy')?.before || 0) * 1.12 },
                  { phase: 'Month 3', revenue: (comparisonData.find(d => d.metric === 'Revenue')?.before || 0) * 1.3, occupancy: (comparisonData.find(d => d.metric === 'Occupancy')?.before || 0) * 1.2 },
                  { phase: 'Final', revenue: comparisonData.find(d => d.metric === 'Revenue')?.after || 0, occupancy: comparisonData.find(d => d.metric === 'Occupancy')?.after || 0 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="phase" stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="revenue"
                  stroke="hsl(215 100% 25%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(215 100% 25%)', strokeWidth: 2, r: 5 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  stroke="hsl(197 100% 45%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(197 100% 45%)', strokeWidth: 2, r: 5 }}
                  name="Occupancy"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comparisonData.map((metric, index) => (
          <Card key={metric.metric} className="booking-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{metric.metric}</span>
                {metric.improvement > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Before</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {metric.unit === '$' ? `$${metric.before.toLocaleString()}` : `${metric.before}${metric.unit}`}
                    </p>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(metric.after / Math.max(metric.before, metric.after)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">After</p>
                    <p className="text-2xl font-bold text-primary">
                      {metric.unit === '$' ? `$${metric.after.toLocaleString()}` : `${metric.after}${metric.unit}`}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    metric.improvement > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {metric.improvement > 0 ? '↗' : '↘'} {Math.abs(metric.improvement).toFixed(1)}% improvement
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

export default Comparison;