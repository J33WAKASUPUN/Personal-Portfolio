import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Github, Building2, Star, Eye } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';
import GlitchButton from './GlitchButton';

interface ProjectTechStack {
  techId: string;
  name: string;
  logoUrl: string;
  category: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  thumbnailUrl: string;
  techStack: ProjectTechStack[];
  repoLink?: string;
  liveLink?: string;
  associatedCompany?: string;
  companyLogo?: string;
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getFeaturedProjects();
      console.log('✅ Featured projects loaded:', data.length, 'records');
      setProjects(data);
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading projects...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-cyan)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Projects.featured()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my most impactful work. Each project showcases cutting-edge technologies 
            and innovative solutions to real-world challenges.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Projects Horizontal Scroll */}
        <div className="space-y-12">
          {/* Gradient Overlays */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Scrollable Project Cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  className="snap-start flex-shrink-0 w-[400px]"
                  style={{
                    animation: isVisible
                      ? `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
                      : 'none',
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {/* CRT Monitor Card */}
                  <div className="glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group h-full flex flex-col">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <div className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 font-orbitron text-[9px] text-muted-foreground uppercase tracking-wider truncate">
                          {project.title.toLowerCase().replace(/\s+/g, '_')}.exe
                        </span>
                      </div>
                      {project.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=random&size=400`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      
                      {/* Company Badge */}
                      {project.associatedCompany && (
                        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-full">
                          {project.companyLogo && (
                            <img
                              src={project.companyLogo}
                              alt={project.associatedCompany}
                              className="w-4 h-4 object-contain"
                            />
                          )}
                          <Building2 className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                          <span className="text-[10px] font-orbitron text-foreground">{project.associatedCompany}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-[hsl(var(--neon-cyan))] transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <div
                            key={tech.techId}
                            className="flex items-center gap-1.5 px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors"
                          >
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-3 h-3 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${tech.name}&background=random&size=16`;
                              }}
                            />
                            <span className="text-[10px] font-orbitron text-foreground/80 uppercase">
                              {tech.name}
                            </span>
                          </div>
                        ))}
                        {project.techStack.length > 4 && (
                          <div className="px-2 py-1 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full">
                            <span className="text-[10px] font-orbitron text-[hsl(var(--neon-cyan))]">
                              +{project.techStack.length - 4}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron text-xs uppercase rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live
                          </a>
                        )}
                        {project.repoLink && (
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-transparent border border-[hsl(var(--neon-magenta))] text-[hsl(var(--neon-magenta))] font-orbitron text-xs uppercase rounded-lg hover:bg-[hsl(var(--neon-magenta)/0.1)] hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.5)] transition-all"
                          >
                            <Github className="w-3 h-3" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="px-4 py-2 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                        <span className="text-[9px] text-muted-foreground font-mono">Click to explore</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <GlitchButton
            variant="primary"
            onClick={() => navigate('/projects')}
          >
            Explore All Projects
          </GlitchButton>
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

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;