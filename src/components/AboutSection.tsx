import { useEffect, useRef, useState } from 'react';
import { Cpu, Target, Rocket, Shield } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';

interface AboutStats {
  experience: string;
  projectsCompleted: number;
  technologies: number;
  commitment: string;
}

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<AboutStats>({
    experience: '0+ Months',
    projectsCompleted: 0,
    technologies: 0,
    commitment: '100%',
  });

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

  useEffect(() => {
    fetchStats();
  }, []);

  const calculateExperience = () => {
    // Career start date: Roughly August 2025
    const careerStartDate = new Date('2025-08-01');
    const currentDate = new Date();

    const yearsDiff = currentDate.getFullYear() - careerStartDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - careerStartDate.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;

    if (totalMonths < 0) return '0+ Months';

    if (totalMonths < 12) {
      return `${totalMonths}+ Month${totalMonths === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(totalMonths / 12);
      return `${years}+ Year${years === 1 ? '' : 's'}`;
    }
  };

  const fetchStats = async () => {
    try {
      const [projects, techStack] = await Promise.all([
        portfolioApi.getVisibleProjects().catch(() => []),
        portfolioApi.getVisibleTechStack().catch(() => []),
      ]);

      setStats({
        experience: calculateExperience(),
        projectsCompleted: projects.length || 0,
        technologies: techStack.length || 0,
        commitment: '100%',
      });
    } catch (error) {
      console.error('Failed to fetch about stats:', error);
      setStats({
        experience: calculateExperience(),
        projectsCompleted: 0,
        technologies: 0,
        commitment: '100%',
      });
    }
  };

  const statsDisplay = [
    { icon: Cpu, value: stats.experience, label: 'Experience' },
    { icon: Target, value: `${stats.projectsCompleted}+`, label: 'Projects Built' },
    { icon: Rocket, value: `${stats.technologies}+`, label: 'Tech Stack' },
    { icon: Shield, value: stats.commitment, label: 'Dedication' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--neon-cyan)/0.05)] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[40%] w-[500px] h-[500px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// System.loadProfile()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Identity Matrix
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] mx-auto" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - Stats Grid */}
          <div 
            className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            {statsDisplay.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center hover-glow group border border-[hsl(var(--deep-electric-blue)/0.3)]"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-xl bg-[hsl(var(--neon-cyan)/0.05)] border border-[hsl(var(--neon-cyan)/0.2)] group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors">
                    <stat.icon className="w-8 h-8 text-[hsl(var(--neon-cyan))] group-hover:text-[hsl(var(--neon-magenta))] transition-colors" />
                  </div>
                </div>
                <p className="font-orbitron text-3xl md:text-4xl font-bold text-neon-gradient mb-2">
                  {stat.value}
                </p>
                <p className="font-orbitron text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Terminal Style Card */}
          <div 
            className={`glass-card p-8 scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--deep-electric-blue)/0.05)] -mx-8 px-8 -mt-8 pt-8 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <span className="ml-4 font-orbitron text-xs text-muted-foreground uppercase tracking-wider opacity-70">
                mission_briefing.exe
              </span>
            </div>

            {/* Terminal Content - UPDATED */}
            <div className="space-y-4 font-mono text-sm md:text-base">
              <p className="text-[hsl(var(--neon-cyan))]">
                <span className="text-muted-foreground">{'>'}</span> Initializing profile data...
              </p>
              
              <p className="text-foreground leading-relaxed">
                I am an adaptability-focused <span className="font-bold text-[hsl(var(--neon-cyan))]">Full-Stack Engineer</span> and CS student at SLIATE. I specialize in building cloud-native solutions, effectively bridging the gap between intuitive UI design and complex backend architecture.
              </p>
              
              <p className="text-foreground leading-relaxed">
                Currently, I am delivering value as an <span className="text-[hsl(var(--neon-magenta))]">Associate Software Engineer</span>. My work centers on creating scalable web and mobile applications while ensuring high performance and adaptability in dynamic environments.
              </p>
              
              <p className="text-foreground leading-relaxed">
                Beyond coding, I am an enthusiast in <span className="text-[hsl(var(--neon-cyan))]">DevOps practices</span> and <span className="text-[hsl(var(--neon-magenta))]">AI/ML</span>. I am constantly learning how to deploy and manage applications to ensure they are robust, scalable, and ready for the future.
              </p>
              
              <div className="pt-2 flex items-center gap-2">
                <span className="text-muted-foreground">{'>'}</span> 
                <span className="text-[hsl(var(--neon-cyan))]">Current Status:</span> 
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-400 text-xs font-orbitron tracking-wider">OPEN FOR OPPORTUNITIES</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Decorative Element */}
        <div className={`mt-16 flex justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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

export default AboutSection;