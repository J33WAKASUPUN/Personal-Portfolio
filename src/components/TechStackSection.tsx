import { useState, useEffect, useRef } from 'react';
import { Code2, Sparkles, Terminal, Cpu, Database, Globe, Layers } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';

interface TechStack {
  _id: string;
  name: string;
  category: string;
  logoUrl?: string;
  officialColor?: string;
  slug: string;
  order: number;
  isVisible: boolean;
}

interface GroupedTechStack {
  [category: string]: TechStack[];
}

const TechStackSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [groupedTechStacks, setGroupedTechStacks] = useState<GroupedTechStack>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setIsVisible(true);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchTechStackData();
  }, []);

  const fetchTechStackData = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getVisibleTechStack();
      setTechStacks(data);
      
      const grouped = data.reduce((acc: GroupedTechStack, tech: TechStack) => {
        let category = tech.category;
        
        // MERGE LOGIC: Group DevOps and Cloud together
        if (['DevOps', 'Cloud', 'Infrastructure'].includes(category)) {
          category = 'DevOps & Cloud';
        }

        if (!acc[category]) acc[category] = [];
        acc[category].push(tech);
        return acc;
      }, {});
      
      setGroupedTechStacks(grouped);
    } catch (error) {
      console.error('❌ Failed to fetch tech stack:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Object.keys(groupedTechStacks);

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('front')) return <Globe className="w-3 h-3" />;
    if (lower.includes('back')) return <Terminal className="w-3 h-3" />;
    if (lower.includes('data')) return <Database className="w-3 h-3" />;
    if (lower.includes('devops') || lower.includes('cloud')) return <Cpu className="w-3 h-3" />;
    return <Layers className="w-3 h-3" />;
  };

  if (isLoading) return null;
  if (categories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="relative py-24 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--deep-electric-blue)/0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Compact */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// TechStack.initialize()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Technology Arsenal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The elite set of tools and frameworks powering my digital missions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* MAIN TERMINAL CONTAINER (Matches Experience Section Style) */}
        <div 
          className={`max-w-6xl mx-auto glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          
          {/* Terminal Header (Traffic Lights) */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--deep-electric-blue)/0.1)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <span className="ml-4 font-orbitron text-xs text-muted-foreground uppercase tracking-wider">
                system_modules.exe
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[hsl(var(--neon-cyan))] opacity-70">
              <Sparkles className="w-3 h-3" />
              <span>MODULES_LOADED: {techStacks.length}</span>
            </div>
          </div>

          {/* Terminal Body - Dense Grid Content */}
          <div className="p-6 md:p-8 space-y-8">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                
                {/* Category Header */}
                <div className="flex items-center gap-2 relative">
                  <div className="text-[hsl(var(--neon-magenta))]">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-[hsl(var(--neon-magenta))] uppercase tracking-wider whitespace-nowrap">
                    {category}
                  </h3>
                  <div className="h-px flex-1 bg-[hsl(var(--neon-magenta)/0.2)]" />
                </div>

                {/* ULTRA-DENSE TECH GRID (Up to 9 cols) */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3">
                  {groupedTechStacks[category].map((tech) => (
                    <div 
                      key={tech._id} 
                      className="group relative bg-[hsl(var(--deep-electric-blue)/0.05)] border border-[hsl(var(--deep-electric-blue)/0.2)] hover:border-[hsl(var(--neon-cyan)/0.5)] rounded-md p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,243,255,0.15)] flex flex-col items-center justify-center gap-2 cursor-default"
                    >
                      {/* Tech Icon - ORIGINAL COLORS (No Grayscale) */}
                      <div className="w-8 h-8 relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        <img 
                          src={tech.logoUrl} 
                          alt={tech.name}
                          className="w-full h-full object-contain"
                          style={{ 
                            // Subtle glow matching the official color
                            filter: tech.officialColor ? `drop-shadow(0 0 5px ${tech.officialColor}40)` : 'none'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}&background=random&color=fff&size=64`;
                          }}
                        />
                      </div>
                      
                      {/* Micro Tech Name */}
                      <span className="font-mono text-[9px] text-center text-muted-foreground group-hover:text-[hsl(var(--neon-cyan))] transition-colors truncate w-full leading-tight">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
        </div>
        
         <div className={`mt-16 flex justify-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[hsl(var(--neon-cyan))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-cyan))]" />
            <div className="w-32 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-magenta))]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[hsl(var(--neon-magenta))]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;