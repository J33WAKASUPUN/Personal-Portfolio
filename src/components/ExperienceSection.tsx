import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin, Building2, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';

interface Role {
  title: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  responsibilities: string[];
  achievements: string[];
}

interface Experience {
  _id: string;
  company: string;
  companyLogo: string;
  companyWebsite?: string;
  location: string;
  industry?: string;
  roles: Role[];
  order: number;
  isVisible: boolean;
}

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('👁️ Experience Section in view:', entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('✅ IntersectionObserver attached to Experience Section');
      
      // Check if already in viewport on mount
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        console.log('🔵 Section already in viewport, setting visible immediately');
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const fetchExperienceData = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getVisibleExperience();
      console.log('✅ Experience data loaded:', data.length, 'records');
      console.log('📊 Experience data structure:', data);
      setExperiences(data);
    } catch (error) {
      console.error('❌ Failed to fetch experience:', error);
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrentRole?: boolean) => {
    const start = new Date(startDate);
    const end = isCurrentRole ? new Date() : endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading professional journey...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no data
  if (experiences.length === 0) {
    console.log('⚠️ Experience Section hidden: No data available');
    return null;
  }

  console.log('✅ Experience Section rendering with data');

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-cyan)/0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Experience.load()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Professional Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From code to impact. Each role represents a chapter in my evolution as a software engineer, 
            solving real-world problems and driving innovation.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Experience Cards - CRT Monitor Style */}
        <div className="mb-20">
          <div 
            className={`max-w-6xl mx-auto ${
              experiences.length === 1 
                ? 'flex justify-center' 
                : 'grid md:grid-cols-2 gap-8'
            }`}
          >
            {experiences.map((exp, index) => (
              <div
                key={exp._id}
                className={`glass-card p-8 scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${
                  experiences.length === 1 ? 'max-w-2xl w-full' : ''
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 font-orbitron text-xs text-muted-foreground uppercase tracking-wider">
                    career_record_{index + 1}.exe
                  </span>
                </div>

                {/* Company Logo & Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[hsl(var(--deep-electric-blue)/0.3)] group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors flex-shrink-0 bg-white/5">
                    <img
                      src={exp.companyLogo}
                      alt={exp.company}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.company)}&background=random&size=64`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-orbitron text-xl font-bold text-[hsl(var(--neon-cyan))] mb-1 group-hover:text-[hsl(var(--neon-magenta))] transition-colors">
                      {exp.company}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                      {exp.industry && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {exp.industry}
                        </span>
                      )}
                    </div>
                    {exp.companyWebsite && (
                      <a
                        href={exp.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--neon-magenta))] transition-colors font-orbitron uppercase tracking-wider"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit Company
                      </a>
                    )}
                  </div>
                </div>

                {/* Roles Timeline */}
                <div className="space-y-6">
                  {exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="relative pl-6 border-l-2 border-[hsl(var(--deep-electric-blue)/0.3)]">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${
                          role.isCurrentRole
                            ? 'bg-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(var(--neon-cyan))] animate-pulse'
                            : 'bg-[hsl(var(--deep-electric-blue))]'
                        }`}
                      />

                      {/* Role Content */}
                      <div className="space-y-3">
                        {/* Role Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-orbitron text-base font-bold text-foreground mb-1">
                              {role.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full text-[hsl(var(--deep-electric-blue))] font-orbitron uppercase">
                                {role.employmentType}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(role.startDate)} - {role.isCurrentRole ? 'Present' : formatDate(role.endDate || '')}
                              </span>
                              <span className="text-[hsl(var(--neon-cyan))] font-orbitron">
                                ({calculateDuration(role.startDate, role.endDate, role.isCurrentRole)})
                              </span>
                            </div>
                          </div>
                          {role.isCurrentRole && (
                            <span className="px-2 py-1 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full text-[hsl(var(--neon-cyan))] font-orbitron text-[10px] uppercase flex-shrink-0">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Responsibilities */}
                        {role.responsibilities.length > 0 && (
                          <div>
                            <h5 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2 flex items-center gap-2">
                              <Briefcase className="w-3 h-3" />
                              Key Responsibilities
                            </h5>
                            <ul className="space-y-1">
                              {role.responsibilities.map((resp, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                  <span className="text-[hsl(var(--neon-cyan))]">▸</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Achievements */}
                        {role.achievements.length > 0 && (
                          <div>
                            <h5 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-magenta))] mb-2 flex items-center gap-2">
                              <Award className="w-3 h-3" />
                              Achievements
                            </h5>
                            <ul className="space-y-1">
                              {role.achievements.map((ach, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                  <span className="text-[hsl(var(--neon-magenta))]">★</span>
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

export default ExperienceSection;