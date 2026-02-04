import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Rocket, 
  FolderKanban, 
  Code2, 
  Briefcase, 
  GraduationCap,
  BookOpen, 
  Award, 
  Share2, 
  BarChart3,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../utils/authContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/home' },
    { icon: Rocket, label: 'Hero Section', path: '/dashboard/hero' },
    { icon: FolderKanban, label: 'Projects', path: '/dashboard/projects' },
    { icon: Code2, label: 'Tech Stack', path: '/dashboard/tech-stack' },
    { icon: Briefcase, label: 'Experience', path: '/dashboard/experience' },
    { icon: GraduationCap, label: 'Education', path: '/dashboard/education' },
    { icon: BookOpen, label: 'Blogs', path: '/dashboard/blogs' },
    { icon: Award, label: 'Certifications', path: '/dashboard/certifications' },
    { icon: Share2, label: 'Social Links', path: '/dashboard/social-links' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  ];

  return (
    <aside className="w-64 bg-[hsl(var(--void-black))] border-r border-[hsl(var(--deep-electric-blue)/0.3)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]">
            <Rocket className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="font-orbitron text-lg font-bold text-neon-gradient">
              Mission Control
            </h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-sm transition-all ${
                isActive
                  ? 'bg-[hsl(var(--neon-cyan)/0.1)] text-[hsl(var(--neon-cyan))] border border-[hsl(var(--neon-cyan)/0.3)] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--deep-electric-blue)/0.1)]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;