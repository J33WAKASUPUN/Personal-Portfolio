import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Activity, 
  Monitor, 
  Globe, 
  ExternalLink,
  Calendar,
  Laptop,
  Smartphone,
  Tablet,
  Chrome,
  RefreshCw
} from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  avgVisitsPerUser: number;
}

interface PageView {
  page: string;
  count: number;
}

interface TopContent {
  name: string;
  views: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface BrowserData {
  browser: string;
  count: number;
}

interface OSData {
  os: string;
  count: number;
}

interface ReferrerData {
  referrer: string;
  count: number;
}

interface VisitsByDate {
  date: string;
  count: number;
}

interface DashboardData {
  summary: AnalyticsSummary;
  pageViews: PageView[];
  topContent: {
    projects: TopContent[];
    blogs: TopContent[];
  };
  audience: {
    devices: DeviceData[];
    browsers: BrowserData[];
    operatingSystems: OSData[];
  };
  traffic: {
    referrers: ReferrerData[];
    visitsByDate: VisitsByDate[];
  };
}

const COLORS = {
  primary: 'hsl(var(--neon-cyan))',
  secondary: 'hsl(var(--deep-electric-blue))',
  accent: 'hsl(var(--neon-magenta))',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
];

const AnalyticsPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await api.get<DashboardData>('/analytics/dashboard');
      setData(dashboardData);
    } catch (error: any) {
      toast.error('Failed to fetch analytics: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'desktop':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
        <Activity className="w-16 h-16 text-[hsl(var(--deep-electric-blue))] mx-auto mb-4" />
        <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
          No Analytics Data Yet
        </h3>
        <p className="text-muted-foreground">
          Start tracking visitors to see analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your portfolio performance and visitor insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as any)}
                className={`px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-wider transition-all ${
                  timeRange === option.value
                    ? 'bg-[hsl(var(--neon-cyan))] text-background shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]'
                    : 'bg-[hsl(var(--deep-electric-blue)/0.2)] text-foreground border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Visits */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-cyan)/0.1)] flex items-center justify-center">
              <Eye className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5%</span>
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {data.summary.totalVisits.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Page Views</p>
        </div>

        {/* Unique Visitors */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-magenta)/0.1)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[hsl(var(--neon-magenta))]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2%</span>
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {data.summary.uniqueVisitors.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Unique Visitors</p>
        </div>

        {/* Avg Visits Per User */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.2)] flex items-center justify-center">
              <Activity className="w-6 h-6 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+5.1%</span>
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {data.summary.avgVisitsPerUser.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">Avg. Pages Per Visit</p>
        </div>
      </div>

      {/* Visits Over Time Chart */}
      <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
              Visits Over Time
            </h3>
            <p className="text-xs text-muted-foreground">Daily page views for the last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</p>
          </div>
          <Calendar className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.traffic.visitsByDate}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--deep-electric-blue))" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--void-black))',
                border: '1px solid hsl(var(--deep-electric-blue))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={COLORS.primary}
              strokeWidth={2}
              dot={{ fill: COLORS.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
                Top Pages
              </h3>
              <p className="text-xs text-muted-foreground">Most visited pages</p>
            </div>
            <Globe className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
          </div>
          <div className="space-y-3">
            {data.pageViews.slice(0, 5).map((page, index) => (
              <div
                key={page.page}
                className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--neon-cyan)/0.2)] flex items-center justify-center text-xs font-orbitron font-bold text-[hsl(var(--neon-cyan))]">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-orbitron text-foreground truncate">
                    {page.page || 'Homepage'}
                  </p>
                </div>
                <span className="text-sm font-orbitron font-bold text-[hsl(var(--neon-cyan))]">
                  {page.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Projects */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
                Top Projects
              </h3>
              <p className="text-xs text-muted-foreground">Most viewed projects</p>
            </div>
            <ExternalLink className="w-5 h-5 text-[hsl(var(--neon-magenta))]" />
          </div>
          {data.topContent.projects.length > 0 ? (
            <div className="space-y-3">
              {data.topContent.projects.slice(0, 5).map((project, index) => (
                <div
                  key={project.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--neon-magenta)/0.2)] flex items-center justify-center text-xs font-orbitron font-bold text-[hsl(var(--neon-magenta))]">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-orbitron text-foreground truncate">
                      {project.name}
                    </p>
                  </div>
                  <span className="text-sm font-orbitron font-bold text-[hsl(var(--neon-magenta))]">
                    {project.views}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No project views tracked yet
            </p>
          )}
        </div>
      </div>

      {/* Audience Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
                Devices
              </h3>
              <p className="text-xs text-muted-foreground">Device breakdown</p>
            </div>
            <Monitor className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.audience.devices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(entry) => `${entry.device}: ${entry.count}`}
              >
                {data.audience.devices.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {data.audience.devices.map((device, index) => (
              <div key={device.device} className="flex items-center gap-2">
                {getDeviceIcon(device.device)}
                <span className="text-xs text-foreground capitalize flex-1">
                  {device.device}
                </span>
                <span className="text-xs font-orbitron font-bold" style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}>
                  {device.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
                Browsers
              </h3>
              <p className="text-xs text-muted-foreground">Browser breakdown</p>
            </div>
            <Chrome className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
          </div>
          <div className="space-y-3">
            {data.audience.browsers.slice(0, 5).map((browser, index) => {
              const total = data.audience.browsers.reduce((sum, b) => sum + b.count, 0);
              const percentage = ((browser.count / total) * 100).toFixed(1);
              return (
                <div key={browser.browser}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-orbitron">
                      {browser.browser}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[hsl(var(--deep-electric-blue)/0.2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
                Operating Systems
              </h3>
              <p className="text-xs text-muted-foreground">OS breakdown</p>
            </div>
            <Activity className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
          </div>
          <div className="space-y-3">
            {data.audience.operatingSystems.slice(0, 5).map((os, index) => {
              const total = data.audience.operatingSystems.reduce((sum, o) => sum + o.count, 0);
              const percentage = ((os.count / total) * 100).toFixed(1);
              return (
                <div key={os.os}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-orbitron">
                      {os.os}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[hsl(var(--deep-electric-blue)/0.2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-orbitron text-lg font-bold text-foreground mb-1">
              Traffic Sources
            </h3>
            <p className="text-xs text-muted-foreground">Top referrers</p>
          </div>
          <ExternalLink className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
        </div>
        {data.traffic.referrers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.traffic.referrers.map((referrer) => (
              <div
                key={referrer.referrer}
                className="p-4 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-foreground font-orbitron truncate flex-1">
                    {new URL(referrer.referrer).hostname}
                  </p>
                  <span className="text-sm font-orbitron font-bold text-[hsl(var(--neon-cyan))]">
                    {referrer.count}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {referrer.referrer}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No referrer data yet. Share your portfolio to track traffic sources!
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;