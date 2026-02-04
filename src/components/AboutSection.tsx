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
    // Career start date: September 2025
    const careerStartDate = new Date('2025-08-31');
    const currentDate = new Date();

    // Calculate difference in months
    const yearsDiff = currentDate.getFullYear() - careerStartDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - careerStartDate.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;

    // If career hasn't started yet, return 0
    if (totalMonths < 0) {
      return '0+ Months';
    }

    // Format based on duration
    if (totalMonths < 12) {
      return `${totalMonths}+ Month${totalMonths === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      
      if (months === 0) {
        return `${years}+ Year${years === 1 ? '' : 's'}`;
      } else {
        return `${years}+ Year${years === 1 ? '' : 's'}`;
      }
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch projects and tech stack in parallel
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
      // Set fallback stats
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
    { icon: Target, value: `${stats.projectsCompleted}+`, label: 'Projects Completed' },
    { icon: Rocket, value: `${stats.technologies}+`, label: 'Technologies' },
    { icon: Shield, value: stats.commitment, label: 'Commitment' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-magenta/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-neon-cyan text-sm uppercase tracking-[0.3em] mb-4">
            {'// System.loadProfile()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Identity Matrix
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta mx-auto" />
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
                className="glass-card p-6 text-center hover-glow group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/20 group-hover:border-neon-cyan/50 transition-colors">
                    <stat.icon className="w-8 h-8 text-neon-cyan group-hover:text-neon-magenta transition-colors" />
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
            className={`glass-card p-8 scan-lines transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neon-cyan/20">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 font-orbitron text-sm text-muted-foreground">
                mission_briefing.exe
              </span>
            </div>

            {/* Terminal Content */}
            <div className="space-y-4 font-mono text-sm md:text-base">
              <p className="text-neon-cyan">
                <span className="text-muted-foreground">{'>'}</span> Initializing profile data...
              </p>
              <p className="text-foreground leading-relaxed">
                I'm a passionate <span className="text-neon-magenta">Software Engineer</span> with a love for 
                building elegant solutions to complex problems. My journey through the digital cosmos 
                has equipped me with expertise in full-stack development, cloud architecture, and 
                creating seamless user experiences.
              </p>
              <p className="text-foreground leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, and sharing knowledge with the developer community. I believe 
                in <span className="text-neon-cyan">clean code</span>, <span className="text-neon-magenta">innovative thinking</span>, 
                and the power of technology to transform ideas into reality.
              </p>
              <p className="text-neon-cyan">
                <span className="text-muted-foreground">{'>'}</span> Status: <span className="text-green-400">Ready for new missions</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Decorative Element */}
        <div className={`mt-16 flex justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-neon-cyan" />
            <div className="w-3 h-3 rotate-45 border border-neon-cyan" />
            <div className="w-32 h-px bg-gradient-to-r from-neon-cyan to-neon-magenta" />
            <div className="w-3 h-3 rotate-45 border border-neon-magenta" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-neon-magenta" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;