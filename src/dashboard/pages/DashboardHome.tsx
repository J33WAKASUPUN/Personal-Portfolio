const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio mission control center
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: '12', icon: '🚀' },
          { label: 'Blog Posts', value: '24', icon: '📝' },
          { label: 'Total Visitors', value: '1,234', icon: '👥' },
          { label: 'Tech Stack', value: '18', icon: '⚡' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] backdrop-blur-sm hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-orbitron font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="p-12 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] backdrop-blur-sm text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center">
          <span className="text-4xl">🚀</span>
        </div>
        <h2 className="font-orbitron text-2xl font-bold text-neon-gradient mb-3">
          Analytics Dashboard Coming Soon
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're building an amazing analytics dashboard to help you track your portfolio performance. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;