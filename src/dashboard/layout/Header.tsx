import { useAuth } from '../utils/authContext';
import { User, Bell } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] backdrop-blur-xl sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Welcome Message */}
        <div>
          <h2 className="font-orbitron text-lg font-semibold text-foreground">
            Welcome back! 👋
          </h2>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[hsl(var(--neon-magenta))] rounded-full animate-pulse" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black))]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center">
              <User className="w-4 h-4 text-background" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-orbitron text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;