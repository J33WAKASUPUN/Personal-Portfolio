import { useEffect, useRef, useState } from 'react';
import TechLogo from './TechLogo';

interface TechItem {
  name: string;
  category: string;
}

interface TechCategory {
  name: string;
  icon: string;
  items: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    name: 'Frontend',
    icon: '🎨',
    items: [
      { name: 'React', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'Next.js', category: 'Frontend' },
      { name: 'Tailwind', category: 'Frontend' },
      { name: 'Vue.js', category: 'Frontend' },
    ],
  },
  {
    name: 'Backend',
    icon: '⚙️',
    items: [
      { name: 'Node.js', category: 'Backend' },
      { name: 'Python', category: 'Backend' },
      { name: 'Go', category: 'Backend' },
      { name: 'GraphQL', category: 'Backend' },
      { name: 'Express', category: 'Backend' },
    ],
  },
  {
    name: 'Database',
    icon: '🗄️',
    items: [
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'Redis', category: 'Database' },
      { name: 'Supabase', category: 'Database' },
    ],
  },
  {
    name: 'DevOps & Cloud',
    icon: '☁️',
    items: [
      { name: 'Docker', category: 'DevOps' },
      { name: 'Kubernetes', category: 'DevOps' },
      { name: 'AWS', category: 'Cloud' },
      { name: 'Terraform', category: 'DevOps' },
      { name: 'GitHub', category: 'DevOps' },
    ],
  },
  {
    name: 'Tools',
    icon: '🛠️',
    items: [
      { name: 'Git', category: 'Tools' },
      { name: 'Figma', category: 'Tools' },
      { name: 'Vite', category: 'Tools' },
      { name: 'Prisma', category: 'Tools' },
    ],
  },
];

const TechStackSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// TechStack.initialize()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Control Panel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The arsenal of technologies I command to build stellar applications. 
            Each tool precision-calibrated for maximum efficiency.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Control Panel Grid */}
        <div 
          className={`glass-card p-8 md:p-12 max-w-6xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-orbitron text-sm text-[hsl(var(--neon-cyan))] uppercase tracking-wider">
                Systems Online
              </span>
            </div>
            <div className="font-orbitron text-xs text-muted-foreground">
              v2.0.24
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techCategories.map((category, categoryIndex) => (
              <div
                key={category.name}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${categoryIndex * 100}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[hsl(var(--deep-electric-blue)/0.2)]">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-orbitron text-sm uppercase tracking-wider text-foreground">
                    {category.name}
                  </h3>
                </div>

                {/* Tech Items */}
                <div className="space-y-3">
                  {category.items.map((tech, index) => (
                    <div
                      key={tech.name}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.2)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all duration-300 cursor-default"
                      style={{ 
                        animation: isVisible ? `zeroGravity ${8 + index * 0.5}s ease-in-out infinite` : 'none',
                        animationDelay: `${index * 0.3}s`
                      }}
                    >
                      <TechLogo name={tech.name} size={28} />
                      <span className="font-orbitron text-sm text-foreground/80 group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Panel Footer */}
          <div className="mt-8 pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-cyan))] animate-pulse" />
              <span className="font-orbitron text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
            <div className="flex gap-4">
              {['CPU', 'MEM', 'NET'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-orbitron text-xs text-muted-foreground">{label}:</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] rounded-full"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 opacity-20 hidden lg:block">
          <div className="w-full h-full border border-[hsl(var(--deep-electric-blue)/0.5)] rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 opacity-20 hidden lg:block">
          <div className="w-full h-full border border-[hsl(var(--neon-magenta)/0.5)] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
