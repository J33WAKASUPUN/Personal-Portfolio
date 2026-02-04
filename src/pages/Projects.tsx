import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Building2, Star, ExternalLink, Github, Eye, X, Calendar, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Starfield from '@/components/Starfield';
import Footer from '@/components/Footer';
import { portfolioApi } from '@/lib/portfolioApi';

interface ProjectTechStack {
  techId: string;
  name: string;
  logoUrl: string;
  category: string;
}

interface Collaborator {
  name: string;
  imageUrl: string;
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
  companyWebsite?: string;
  collaborators?: Collaborator[];
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjectsList();
  }, [projects, filterFeatured]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getVisibleProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjectsList = () => {
    let filtered = [...projects];

    // Featured filter
    if (filterFeatured === 'featured') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    setFilteredProjects(filtered);
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield />
      <Navigation />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-orbitron text-sm uppercase tracking-wider">Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
              {'// Projects.all()'}
            </p>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-neon-gradient mb-4">
              All Projects
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              A comprehensive archive of my digital creations. Each project represents innovation, 
              problem-solving, and cutting-edge technology.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto" />
          </div>


          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => openProjectModal(project)}
                className="glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group flex flex-col cursor-pointer"
              >
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-orbitron text-[9px] text-muted-foreground uppercase tracking-wider truncate">
                      project.exe
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
                        className="flex items-center gap-1.5 px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full"
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
                </div>

                {/* Status Bar */}
                <div className="px-4 py-2 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                    <span className="text-[9px] text-muted-foreground font-mono">Click to view details</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
                <Filter className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
              </div>
              <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
                No Projects Found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try selecting "All" to see all projects
              </p>
              <button
                onClick={() => setFilterFeatured('all')}
                className="px-6 py-3 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
              >
                Show All Projects
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Project Details Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[hsl(var(--void-black))] border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-orbitron text-xs text-muted-foreground uppercase tracking-wider">
                    project_details.exe
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Project Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-orbitron text-3xl font-bold text-neon-gradient mb-3">
                      {selectedProject.title}
                    </h2>
                    {selectedProject.associatedCompany && (
                      <div className="flex items-center gap-3 mb-2">
                        {selectedProject.companyLogo && (
                          <img
                            src={selectedProject.companyLogo}
                            alt={selectedProject.associatedCompany}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <Building2 className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                        <span className="text-sm font-orbitron text-foreground">
                          {selectedProject.associatedCompany}
                        </span>
                        {selectedProject.companyWebsite && (
                          <a
                            href={selectedProject.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--neon-magenta))] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedProject.isFeatured && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--neon-magenta)/0.1)] border border-[hsl(var(--neon-magenta)/0.3)] rounded-full">
                      <Star className="w-4 h-4 text-[hsl(var(--neon-magenta))] fill-current" />
                      <span className="text-xs font-orbitron text-[hsl(var(--neon-magenta))] uppercase">Featured</span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(selectedProject.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{selectedProject.collaborators.length} Collaborator{selectedProject.collaborators.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Image */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.3)]">
                <img
                  src={selectedProject.thumbnailUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProject.title)}&background=random&size=800`;
                  }}
                />
              </div>

              {/* Full Description */}
              <div className="space-y-3">
                <h3 className="font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  About This Project
                </h3>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                  {selectedProject.fullDescription}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <h3 className="font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))]">
                  Technology Stack ({selectedProject.techStack.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedProject.techStack.map((tech) => (
                    <div
                      key={tech.techId}
                      className="flex items-center gap-2 p-3 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors"
                    >
                      <img
                        src={tech.logoUrl}
                        alt={tech.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${tech.name}&background=random&size=32`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-orbitron text-foreground font-bold truncate">
                          {tech.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground uppercase">
                          {tech.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborators */}
              {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))]">
                    Collaborators ({selectedProject.collaborators.length})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.collaborators.map((collab, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full"
                      >
                        <img
                          src={collab.imageUrl}
                          alt={collab.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.name)}&background=random&size=32`;
                          }}
                        />
                        <span className="text-sm font-orbitron text-foreground">
                          {collab.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live Project
                  </a>
                )}
                {selectedProject.repoLink && (
                  <a
                    href={selectedProject.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[hsl(var(--neon-magenta))] text-[hsl(var(--neon-magenta))] font-orbitron font-bold uppercase rounded-lg hover:bg-[hsl(var(--neon-magenta)/0.1)] hover:shadow-[0_0_25px_hsl(var(--neon-magenta)/0.5)] transition-all"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Projects;