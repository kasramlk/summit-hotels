import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useHotel } from '@/context/HotelContext';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Lightbulb,
  BarChart3,
  LineChart,
  Building,
  Send,
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

// AI Analysis SVG Illustration
const AIAnalysisIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48 mb-6">
    <defs>
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(215 100% 25%)" />
        <stop offset="100%" stopColor="hsl(197 100% 45%)" />
      </linearGradient>
      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(44 99% 50%)" />
        <stop offset="100%" stopColor="hsl(44 99% 40%)" />
      </linearGradient>
    </defs>
    
    {/* AI Brain */}
    <circle cx="200" cy="150" r="60" fill="url(#brainGradient)" />
    <path d="M 160 140 Q 200 120 240 140" stroke="white" strokeWidth="3" fill="none" />
    <path d="M 160 160 Q 200 140 240 160" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="180" cy="135" r="4" fill="white" />
    <circle cx="220" cy="135" r="4" fill="white" />
    
    {/* Data Points */}
    <circle cx="80" cy="80" r="8" fill="url(#dataGradient)" />
    <circle cx="320" cy="80" r="8" fill="url(#dataGradient)" />
    <circle cx="80" cy="220" r="8" fill="url(#dataGradient)" />
    <circle cx="320" cy="220" r="8" fill="url(#dataGradient)" />
    
    {/* Connection Lines */}
    <path d="M 88 88 Q 150 120 160 140" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    <path d="M 312 88 Q 250 120 240 140" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    <path d="M 88 212 Q 150 180 160 160" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    <path d="M 312 212 Q 250 180 240 160" stroke="hsl(44 99% 50%)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
    
    {/* Chart Icons */}
    <rect x="50" y="50" width="30" height="20" fill="hsl(215 100% 25%)" rx="4" />
    <rect x="290" y="50" width="30" height="20" fill="hsl(197 100% 45%)" rx="4" />
    <rect x="50" y="190" width="30" height="20" fill="hsl(44 99% 50%)" rx="4" />
    <rect x="290" y="190" width="30" height="20" fill="hsl(215 100% 25%)" rx="4" />
  </svg>
);

interface MetricData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  occupancy: number;
}

const Analytics = () => {
  const { selectedHotel } = useHotel();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (selectedHotel) {
      fetchMetrics();
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
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    if (!query.trim() || !metrics.length) return;
    
    setAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = [
        `Based on your hotel data for ${selectedHotel?.name}, here are key insights:`,
        `• Revenue shows ${metrics[metrics.length-1]?.revenue > metrics[0]?.revenue ? 'positive growth' : 'declining'} trend over the analyzed period`,
        `• Average occupancy rate is ${Math.round(metrics.reduce((sum, m) => sum + m.occupancy, 0) / metrics.length)}%, which is ${Math.round(metrics.reduce((sum, m) => sum + m.occupancy, 0) / metrics.length) > 75 ? 'excellent' : 'good'}`,
        `• Peak revenue month was ${metrics.reduce((prev, current) => prev.revenue > current.revenue ? prev : current).month}`,
        `• Recommended focus areas: Revenue optimization, operational efficiency, and guest experience enhancement`
      ];
      
      setAnalysis(insights.join('\n\n'));
    } catch (error) {
      console.error('Error generating analysis:', error);
      setAnalysis('Sorry, I encountered an error while analyzing your data. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
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
            <p className="text-muted-foreground">Please select a hotel to view AI analytics</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate insights
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const avgOccupancy = metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.occupancy, 0) / metrics.length) : 0;
  const profitMargin = totalRevenue > 0 ? Math.round((metrics.reduce((sum, m) => sum + m.profit, 0) / totalRevenue) * 100) : 0;
  const revenueGrowth = metrics.length > 1 ? 
    Math.round(((metrics[metrics.length-1].revenue - metrics[0].revenue) / metrics[0].revenue) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Illustration */}
      <div className="booking-card p-6">
        <AIAnalysisIllustration />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Analytics</h1>
          <p className="text-muted-foreground">
            Advanced insights and predictions for {selectedHotel.name} • {selectedHotel.location}
          </p>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <EnhancedStatsCard
          title="Revenue Growth"
          value={`${revenueGrowth}%`}
          description="Year-over-year change"
          icon={TrendingUp}
          badge={{ text: revenueGrowth > 0 ? 'GROWTH' : 'DECLINE', variant: revenueGrowth > 0 ? 'secondary' : 'destructive' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          description="Revenue to profit ratio"
          icon={Target}
          badge={{ text: profitMargin > 20 ? 'HEALTHY' : 'MONITOR', variant: profitMargin > 20 ? 'secondary' : 'outline' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="Occupancy Score"
          value={`${avgOccupancy}%`}
          description="Average utilization"
          icon={BarChart3}
          badge={{ text: avgOccupancy > 75 ? 'EXCELLENT' : 'GOOD', variant: 'secondary' }}
          className="booking-card"
        />
        
        <EnhancedStatsCard
          title="AI Confidence"
          value="94%"
          description="Prediction accuracy"
          icon={Brain}
          badge={{ text: 'HIGH', variant: 'secondary' }}
          className="booking-card"
        />
      </div>

      {/* AI Chat Interface */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Assistant</span>
            </CardTitle>
            <CardDescription>Ask questions about your hotel data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ask me anything about your hotel performance, trends, or recommendations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={generateAnalysis} 
              disabled={!query.trim() || analyzing}
              className="w-full"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Analysis
                </>
              )}
            </Button>
            
            {analysis && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold">AI Analysis</h4>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                      {analysis}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Predictive Analytics */}
        <Card className="booking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span>Revenue Prediction</span>
            </CardTitle>
            <CardDescription>AI-powered revenue forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={[...metrics, { month: 'Next', revenue: metrics[metrics.length-1]?.revenue * 1.15, isPrediction: true }]}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215 100% 25%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(215 100% 25%)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="revenue"
                  stroke="hsl(215 100% 25%)"
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Smart Recommendations */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="booking-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Lightbulb className="h-5 w-5" />
              <span>Revenue Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Increase rates during peak occupancy periods</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Optimize direct booking channel performance</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Implement dynamic pricing strategies</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="booking-card border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <Target className="h-5 w-5" />
              <span>Operational Efficiency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <span>Reduce operational costs during low seasons</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <span>Automate routine processes</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <span>Optimize staff scheduling</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="booking-card border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent">
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Monitor seasonal revenue dips</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Watch competitor pricing trends</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Track guest satisfaction scores</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;