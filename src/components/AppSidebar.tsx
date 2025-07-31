import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  BarChart3,
  Building2,
  Settings,
  PieChart,
  GitCompare,
  CreditCard
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & KPIs'
  },
  {
    title: 'Revenue Analysis',
    url: '/revenue',
    icon: TrendingUp,
    description: 'Financial metrics'
  },
  {
    title: 'Occupancy Rates',
    url: '/occupancy',
    icon: Users,
    description: 'Room utilization'
  },
  {
    title: 'Sales Reports',
    url: '/sales',
    icon: PieChart,
    description: 'Channel performance'
  },
  {
    title: 'Before/After',
    url: '/comparison',
    icon: GitCompare,
    description: 'Performance comparison'
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
    description: 'Detailed insights'
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-sidebar-background">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Hotel Manager</h2>
                <p className="text-xs text-sidebar-foreground/60">Luxury Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">
            {!collapsed ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      isActive(item.url)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    } transition-all duration-200`}
                  >
                    <NavLink to={item.url} className="flex items-center space-x-3 p-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Billing */}
        <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
          <SidebarMenuButton
            asChild
            className={`w-full ${
              isActive('/billing')
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <NavLink to="/billing" className="flex items-center space-x-3 p-3">
              <CreditCard className="h-5 w-5" />
              {!collapsed && <span className="text-sm">Billing</span>}
            </NavLink>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <NavLink to="/settings" className="flex items-center space-x-3 p-3">
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}