import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, BarChart3, Database, TrendingUp, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStats {
  totalHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  recentActivity: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const [hotelsRes, usersRes, bookingsRes, revenueRes] = await Promise.all([
        supabase.from('hotels').select('id', { count: 'exact' }),
        supabase.from('user_hotels').select('user_id', { count: 'exact' }),
        supabase.from('bookings').select('id, total_amount', { count: 'exact' }),
        supabase.from('hotel_metrics').select('revenue'),
      ]);

      const totalRevenue = revenueRes.data?.reduce((sum, metric) => sum + (metric.revenue || 0), 0) || 0;

      setStats({
        totalHotels: hotelsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        totalRevenue,
        activeUsers: usersRes.count || 0, // Simplified for demo
        recentActivity: 24, // Demo value
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      description: 'Properties in system',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      description: 'All time bookings',
      icon: BarChart3,
      color: 'text-orange-600',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      description: 'All time revenue',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      description: 'Active this month',
      icon: UserCheck,
      color: 'text-purple-600',
    },
    {
      title: 'Data Points',
      value: '12.5K',
      description: 'Analytics records',
      icon: Database,
      color: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and manage system-wide operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New hotel registered', time: '2 hours ago', type: 'success' },
                { action: 'User role updated', time: '4 hours ago', type: 'info' },
                { action: 'System backup completed', time: '6 hours ago', type: 'success' },
                { action: 'Data import processed', time: '8 hours ago', type: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <Building2 className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm">Add Hotel</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <Users className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm">Manage Users</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <Database className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm">Import Data</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <BarChart3 className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm">View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;