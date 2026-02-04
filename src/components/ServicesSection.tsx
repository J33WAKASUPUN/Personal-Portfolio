import { useEffect, useRef, useState } from 'react';
import { Code2, Cloud, Zap, Rocket, Shield, Database } from 'lucide-react';

interface Service {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
  glowColor: string;
}

const services: Service[] = [
  {
    id: 1,
    icon: Code2,
    title: 'Frontend & UX Engineering',
    description: 'Crafting immersive, pixel-perfect user experiences across web and mobile platforms using modern design systems.',
    features: [
      'React, Next.js & React Native',
      'UI/UX Design & Prototyping',
      'Responsive & Mobile-First',
      'Performance Optimization',
    ],
    color: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))]',
    glowColor: 'hsl(var(--neon-cyan))',
  },
  {
    id: 2,
    icon: Database,
    title: 'Backend & Data Systems',
    description: 'Architecting robust, scalable server-side solutions and high-performance data structures for complex applications.',
    features: [
      'Node.js, NestJS & Microservices',
      'SQL (PostgreSQL) & NoSQL',
      'RESTful & GraphQL APIs',
      'System Architecture Design',
    ],
    color: 'from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-purple))]',
    glowColor: 'hsl(var(--neon-magenta))',
  },
  {
    id: 3,
    icon: Cloud,
    title: 'Cloud & DevOps Strategy',
    description: 'Designing secure, resilient cloud environments with automated deployment pipelines and containerization.',
    features: [
      'AWS, Azure & Cloud Native',
      'Docker & Kubernetes',
      'CI/CD Automation',
      'Security & Infrastructure Code',
    ],
    color: 'from-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-cyan))]',
    glowColor: 'hsl(var(--deep-electric-blue))',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[hsl(var(--neon-cyan)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Services.offer()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            What I Deliver
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive software solutions tailored to transform your ideas into powerful digital experiences.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Outer Shell - For Glow/Shadow (No Overflow Hidden) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[hsl(var(--deep-electric-blue)/0.5)] to-[hsl(var(--neon-cyan)/0.5)] rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
              
              {/* Inner Card - For Content & Scanlines (Overflow Hidden OK here) */}
              <div className="relative h-full glass-card scan-lines bg-[hsl(var(--void-black)/0.9)] rounded-2xl overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.3)] flex flex-col">
                
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--deep-electric-blue)/0.1)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                  <span className="ml-3 font-orbitron text-[10px] text-muted-foreground uppercase tracking-wider opacity-70">
                    module_0{service.id}.exe
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-8 flex flex-col flex-grow">
                  {/* Icon */}
                  <div className="relative mb-6 self-start">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                    >
                      <div className="w-full h-full bg-[hsl(var(--void-black))] rounded-[10px] flex items-center justify-center">
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    {/* Inner Icon Glow */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                      style={{
                        background: `radial-gradient(circle at center, ${service.glowColor}40, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono"
                      >
                        <span className="text-[hsl(var(--neon-cyan))]">›</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Bar */}
                  <div className="mt-auto pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                      <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">
                        Operational
                      </span>
                    </div>
                    <Zap className="w-4 h-4 text-[hsl(var(--neon-cyan))] opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`mt-16 flex justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="glass-card px-8 py-4 border border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center gap-8 bg-[hsl(var(--void-black)/0.6)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
              <div>
                <p className="font-orbitron text-xl font-bold text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Core Modules</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[hsl(var(--deep-electric-blue)/0.3)]" />
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[hsl(var(--neon-magenta))]" />
              <div>
                <p className="font-orbitron text-xl font-bold text-foreground">100%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mission Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
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

export default ServicesSection;