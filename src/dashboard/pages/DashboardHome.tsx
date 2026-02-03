import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { 
  Rocket, 
  FolderKanban, 
  BookOpen, 
  Eye, 
  TrendingUp,
  Award,
  Code2,
  Briefcase,
  Star,
  Activity,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  projects: {
    total: number;
    featured: number;
    visible: number;
  };
  blogs: {
    total: number;
    featured: number;
    visible: number;
  };
  experience: {
    total: number;
    roles: number;
    visible: number;
  };
  techStack: {
    total: number;
    byCategory: Record<string, number>;
  };
  certifications: {
    total: number;
    visible: number;
  };
  socialLinks: {
    total: number;
    visible: number;
  };
  analytics: {
    totalVisits: number;
    uniqueVisitors: number;
    topPage: string;
  };
}

const DashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [
        projects,
        blogs,
        experience,
        techStack,
        certifications,
        socialLinks,
        analytics,
      ] = await Promise.all([
        api.get('/projects/all'),
        api.get('/blogs/all'),
        api.get('/experience/all'),
        api.get('/tech-stack/all'),
        api.get('/certifications/all'),
        api.get('/social-links/all'),
        api.get('/analytics/dashboard').catch(() => ({ 
          summary: { totalVisits: 0, uniqueVisitors: 0 },
          pageViews: []
        })),
      ]);

      // Calculate stats
      const statsData: DashboardStats = {
        projects: {
          total: projects.length,
          featured: projects.filter((p: any) => p.isFeatured).length,
          visible: projects.filter((p: any) => p.isVisible).length,
        },
        blogs: {
          total: blogs.length,
          featured: blogs.filter((b: any) => b.isFeatured).length,
          visible: blogs.filter((b: any) => b.isVisible).length,
        },
        experience: {
          total: experience.length,
          roles: experience.reduce((sum: number, exp: any) => sum + exp.roles.length, 0),
          visible: experience.filter((e: any) => e.isVisible).length,
        },
        techStack: {
          total: techStack.length,
          byCategory: techStack.reduce((acc: Record<string, number>, tech: any) => {
            acc[tech.category] = (acc[tech.category] || 0) + 1;
            return acc;
          }, {}),
        },
        certifications: {
          total: certifications.length,
          visible: certifications.filter((c: any) => c.isVisible).length,
        },
        socialLinks: {
          total: socialLinks.length,
          visible: socialLinks.filter((s: any) => s.isVisible).length,
        },
        analytics: {
          totalVisits: analytics.summary?.totalVisits || 0,
          uniqueVisitors: analytics.summary?.uniqueVisitors || 0,
          topPage: analytics.pageViews?.[0]?.page || 'Homepage',
        },
      };

      setStats(statsData);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard stats');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-400">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Welcome to your portfolio mission control center
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="glass-card p-6 border border-[hsl(var(--neon-cyan)/0.3)] bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.05)] to-[hsl(var(--neon-magenta)/0.05)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-foreground mb-1">
              Portfolio Analytics
            </h2>
            <p className="text-sm text-muted-foreground">Real-time visitor tracking</p>
          </div>
          <Link 
            to="/dashboard/analytics"
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron text-xs rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
          >
            View Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(var(--neon-cyan)/0.2)] flex items-center justify-center">
              <Eye className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            </div>
            <p className="text-3xl font-orbitron font-bold text-foreground">
              {stats.analytics.totalVisits.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Visits</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(var(--neon-magenta)/0.2)] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[hsl(var(--neon-magenta))]" />
            </div>
            <p className="text-3xl font-orbitron font-bold text-foreground">
              {stats.analytics.uniqueVisitors.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(var(--deep-electric-blue)/0.2)] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <p className="text-lg font-orbitron font-bold text-foreground truncate">
              {stats.analytics.topPage}
            </p>
            <p className="text-sm text-muted-foreground">Top Page</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <Link 
          to="/dashboard/projects"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-cyan)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            </div>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.projects.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Total Projects</p>
          <div className="flex gap-4 text-xs">
            <span className="text-yellow-400">⭐ {stats.projects.featured} Featured</span>
            <span className="text-green-400">👁️ {stats.projects.visible} Visible</span>
          </div>
        </Link>

        {/* Blogs */}
        <Link 
          to="/dashboard/blogs"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-magenta)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-[hsl(var(--neon-magenta))]" />
            </div>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.blogs.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Blog Posts</p>
          <div className="flex gap-4 text-xs">
            <span className="text-yellow-400">⭐ {stats.blogs.featured} Featured</span>
            <span className="text-green-400">👁️ {stats.blogs.visible} Visible</span>
          </div>
        </Link>

        {/* Tech Stack */}
        <Link 
          to="/dashboard/tech-stack"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.2)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <span className="text-xs text-muted-foreground">
              {Object.keys(stats.techStack.byCategory).length} Categories
            </span>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.techStack.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Technologies</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(stats.techStack.byCategory).slice(0, 3).map(([category, count]) => (
              <span key={category} className="text-xs px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] rounded">
                {category}: {count}
              </span>
            ))}
          </div>
        </Link>

        {/* Experience */}
        <Link 
          to="/dashboard/experience"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-cyan)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.experience.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Companies</p>
          <div className="flex gap-4 text-xs">
            <span className="text-blue-400">💼 {stats.experience.roles} Roles</span>
            <span className="text-green-400">👁️ {stats.experience.visible} Visible</span>
          </div>
        </Link>

        {/* Certifications */}
        <Link 
          to="/dashboard/certifications"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--neon-magenta)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-[hsl(var(--neon-magenta))]" />
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.certifications.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Certifications</p>
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {stats.certifications.visible} Verified</span>
          </div>
        </Link>

        {/* Social Links */}
        <Link 
          to="/dashboard/social-links"
          className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.2)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-6 h-6 text-[hsl(var(--deep-electric-blue))]" />
            </div>
          </div>
          <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
            {stats.socialLinks.total}
          </p>
          <p className="text-sm text-muted-foreground mb-3">Social Links</p>
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">🔗 {stats.socialLinks.visible} Active</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
        <h2 className="font-orbitron text-xl font-bold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/projects"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.05)] transition-all text-center"
          >
            <FolderKanban className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            <span className="text-sm font-orbitron text-foreground">Add Project</span>
          </Link>
          <Link
            to="/dashboard/blogs"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.05)] transition-all text-center"
          >
            <BookOpen className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            <span className="text-sm font-orbitron text-foreground">Write Blog</span>
          </Link>
          <Link
            to="/dashboard/tech-stack"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.05)] transition-all text-center"
          >
            <Code2 className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            <span className="text-sm font-orbitron text-foreground">Add Tech</span>
          </Link>
          <Link
            to="/dashboard/analytics"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.05)] transition-all text-center"
          >
            <Activity className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
            <span className="text-sm font-orbitron text-foreground">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Hero CTA */}
      <div className="glass-card p-8 border-2 border-[hsl(var(--neon-cyan)/0.3)] bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.05)] to-transparent text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center animate-float">
          <Rocket className="w-10 h-10 text-background" />
        </div>
        <h2 className="font-orbitron text-2xl font-bold text-neon-gradient mb-3">
          Portfolio Ready for Launch! 🚀
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Your mission control is fully operational. All systems are go! 
          {stats.projects.total > 0 && stats.blogs.total > 0 
            ? ' Your portfolio is live and tracking visitors.'
            : ' Add more content to make your portfolio shine.'}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
          >
            View Live Site
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            to="/dashboard/hero"
            className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))] font-orbitron font-bold rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-all"
          >
            Manage Hero Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;