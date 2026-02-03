import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, X, ExternalLink, Github, Building2, Users, Sparkles, Search, Filter } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface TechStack {
  _id: string;
  name: string;
  logoUrl: string;
  category: string;
}

interface Collaborator {
  name: string;
  imageUrl: string;
}

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
  collaborators?: Collaborator[];
  associatedCompany?: string;
  companyLogo?: string;
  companyWebsite?: string;
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    thumbnailUrl: '',
    techStack: [] as { techId: string; name: string; category: string }[],
    repoLink: '',
    liveLink: '',
    collaborators: [] as Collaborator[],
    associatedCompany: '',
    companyLogo: '',
    companyWebsite: '',
    isFeatured: false,
    order: 0,
    isVisible: true,
  });

  // Tech stack selection for modal
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [techSearchQuery, setTechSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchTechStacks();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, filterFeatured]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Project[]>('/projects/all');
      setProjects(data);
    } catch (error: any) {
      toast.error('Failed to fetch projects: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechStacks = async () => {
    try {
      const data = await api.get<TechStack[]>('/tech-stack/all');
      setTechStacks(data);
    } catch (error: any) {
      toast.error('Failed to fetch tech stacks: ' + error.message);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Featured filter
    if (filterFeatured === 'featured') {
      filtered = filtered.filter((p) => p.isFeatured);
    } else if (filterFeatured === 'regular') {
      filtered = filtered.filter((p) => !p.isFeatured);
    }

    // Sort by featured, order, then created date
    filtered.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredProjects(filtered);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setSelectedTechIds([]);
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      thumbnailUrl: '',
      techStack: [],
      repoLink: '',
      liveLink: '',
      collaborators: [],
      associatedCompany: '',
      companyLogo: '',
      companyWebsite: '',
      isFeatured: false,
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setSelectedTechIds(project.techStack.map((t) => t.techId));
    setFormData({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription,
      thumbnailUrl: project.thumbnailUrl,
      techStack: project.techStack.map((t) => ({
        techId: t.techId,
        name: t.name,
        category: t.category,
      })),
      repoLink: project.repoLink || '',
      liveLink: project.liveLink || '',
      collaborators: project.collaborators || [],
      associatedCompany: project.associatedCompany || '',
      companyLogo: project.companyLogo || '',
      companyWebsite: project.companyWebsite || '',
      isFeatured: project.isFeatured,
      order: project.order,
      isVisible: project.isVisible,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build tech stack array with techId and category
    const techStackData = selectedTechIds.map((techId) => {
      const tech = techStacks.find((t) => t._id === techId);
      return {
        techId,
        name: tech!.name,
        category: tech!.category,
      };
    });

    const submitData = {
      ...formData,
      techStack: techStackData,
    };

    try {
      if (editingProject) {
        await api.patch(`/projects/${editingProject._id}`, submitData);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', submitData);
        toast.success('Project created successfully');
      }

      setShowModal(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      await api.patch(`/projects/${project._id}`, { isVisible: !project.isVisible });
      toast.success(`${project.title} is now ${!project.isVisible ? 'visible' : 'hidden'}`);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await api.patch(`/projects/${project._id}/toggle-featured`, {});
      toast.success(`${project.title} is now ${!project.isFeatured ? 'featured' : 'not featured'}`);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle featured status');
    }
  };

  const addCollaborator = () => {
    setFormData({
      ...formData,
      collaborators: [...formData.collaborators, { name: '', imageUrl: '' }],
    });
  };

  const removeCollaborator = (index: number) => {
    const newCollaborators = formData.collaborators.filter((_, i) => i !== index);
    setFormData({ ...formData, collaborators: newCollaborators });
  };

  const updateCollaborator = (index: number, field: 'name' | 'imageUrl', value: string) => {
    const newCollaborators = [...formData.collaborators];
    newCollaborators[index][field] = value;
    setFormData({ ...formData, collaborators: newCollaborators });
  };

  const filteredTechForSelection = techStacks.filter((tech) =>
    tech.name.toLowerCase().includes(techSearchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
            Projects Management
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects • {projects.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
            />
          </div>

          {/* Featured Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Projects' },
              { value: 'featured', label: 'Featured' },
              { value: 'regular', label: 'Regular' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterFeatured(option.value as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-orbitron text-sm uppercase tracking-wider transition-all ${
                  filterFeatured === option.value
                    ? 'bg-[hsl(var(--neon-cyan))] text-background shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]'
                    : 'bg-[hsl(var(--deep-electric-blue)/0.2)] text-foreground border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className={`group relative rounded-lg border transition-all ${
              project.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Featured Badge */}
            {project.isFeatured && (
              <div className="absolute top-4 right-4 z-10">
                <span className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--neon-magenta))] text-background text-xs font-orbitron font-bold rounded-full shadow-[0_0_15px_hsl(var(--neon-magenta)/0.5)]">
                  <Star className="w-3 h-3 fill-current" />
                  FEATURED
                </span>
              </div>
            )}

            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=random&size=400`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title & Company */}
              <div>
                <h3 className="font-orbitron text-lg font-bold text-foreground mb-1 line-clamp-1">
                  {project.title}
                </h3>
                {project.associatedCompany && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--deep-electric-blue))]">
                    <Building2 className="w-3 h-3" />
                    <span>{project.associatedCompany}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 4).map((tech) => (
                  <div
                    key={tech.techId}
                    className="flex items-center gap-1.5 px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full"
                  >
                    <img src={tech.logoUrl} alt={tech.name} className="w-3 h-3 object-contain" />
                    <span className="text-[10px] font-orbitron text-foreground/80">{tech.name}</span>
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

              {/* Links & Collaborators */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  {project.repoLink && (
                    <a
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-[hsl(var(--deep-electric-blue)/0.2)] text-[hsl(var(--deep-electric-blue))] hover:bg-[hsl(var(--deep-electric-blue)/0.3)] transition-colors"
                    >
                      <Github className="w-3 h-3" />
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-[hsl(var(--neon-cyan)/0.2)] text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.3)] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{project.collaborators.length}</span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.2)]">
                <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => toggleVisibility(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))] rounded-lg hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all text-sm"
                  title={project.isVisible ? 'Hide' : 'Show'}
                >
                  {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    project.isFeatured
                      ? 'bg-[hsl(var(--neon-magenta)/0.2)] border border-[hsl(var(--neon-magenta)/0.3)] text-[hsl(var(--neon-magenta))]'
                      : 'bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))]'
                  } hover:opacity-80`}
                  title={project.isFeatured ? 'Unfeature' : 'Feature'}
                >
                  <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project._id, project.title)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              {searchQuery || filterFeatured !== 'all' ? 'No Projects Found' : 'No Projects Yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterFeatured !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'}
            </p>
            {!searchQuery && filterFeatured === 'all' && (
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[hsl(var(--void-black))] pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)] z-10">
              <h2 className="font-orbitron text-2xl font-bold text-neon-gradient">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-red-500 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Basic Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    minLength={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                    placeholder="My Awesome Project"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    minLength={10}
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground resize-none transition-all"
                    placeholder="Brief project overview (for cards)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length} / 500 characters
                  </p>
                </div>

                {/* Full Description */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    required
                    minLength={50}
                    rows={6}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground resize-none transition-all"
                    placeholder="Detailed project description, features, challenges solved, etc."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fullDescription.length} characters
                  </p>
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://example.com/project-thumbnail.jpg"
                  />
                  {formData.thumbnailUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title || 'Project')}&background=random&size=400`;
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack Section */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Tech Stack *
                </h3>

                {/* Search Tech Stacks */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={techSearchQuery}
                    onChange={(e) => setTechSearchQuery(e.target.value)}
                    placeholder="Search technologies..."
                    className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                  />
                </div>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-4 bg-[hsl(var(--void-black)/0.5)] rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)]">
                  {filteredTechForSelection.map((tech) => {
                    const isSelected = selectedTechIds.includes(tech._id);
                    return (
                      <button
                        key={tech._id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTechIds(selectedTechIds.filter((id) => id !== tech._id));
                          } else {
                            setSelectedTechIds([...selectedTechIds, tech._id]);
                          }
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.1)] shadow-[0_0_10px_hsl(var(--neon-cyan)/0.3)]'
                            : 'border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                        }`}
                      >
                        <img src={tech.logoUrl} alt={tech.name} className="w-8 h-8 mx-auto mb-2 object-contain" />
                        <p className="text-[10px] font-orbitron text-center text-foreground truncate">
                          {tech.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedTechIds.length} {selectedTechIds.length === 1 ? 'technology' : 'technologies'} selected
                </p>
              </div>

              {/* Links Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                {/* Repo Link */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.repoLink}
                    onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                {/* Live Link */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Company Section */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Associated Company (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.associatedCompany}
                      onChange={(e) => setFormData({ ...formData, associatedCompany: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Collaborators Section */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Collaborators (Optional)
                  </h3>
                  <button
                    type="button"
                    onClick={addCollaborator}
                    className="px-3 py-1.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-sm font-orbitron"
                  >
                    + Add
                  </button>
                </div>

                {formData.collaborators.map((collab, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={collab.name}
                        onChange={(e) => updateCollaborator(index, 'name', e.target.value)}
                        placeholder="Collaborator name"
                        className="w-full px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={collab.imageUrl}
                        onChange={(e) => updateCollaborator(index, 'imageUrl', e.target.value)}
                        placeholder="Image URL"
                        className="w-full px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCollaborator(index)}
                      className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Settings Section */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Project Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display Order */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      min={0}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Is Featured */}
                  <div className="flex items-center gap-3 p-4 bg-[hsl(var(--neon-magenta)/0.05)] rounded-lg border border-[hsl(var(--neon-magenta)/0.3)]">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-magenta))] bg-transparent checked:bg-[hsl(var(--neon-magenta))] focus:ring-2 focus:ring-[hsl(var(--neon-magenta)/0.3)] cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                      <p className="font-orbitron text-sm text-foreground flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured Project
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formData.isFeatured ? 'Will be highlighted on homepage' : 'Regular project'}
                      </p>
                    </label>
                  </div>

                  {/* Is Visible */}
                  <div className="flex items-center gap-3 p-4 bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)]">
                    <input
                      type="checkbox"
                      id="isVisible"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-cyan))] bg-transparent checked:bg-[hsl(var(--neon-cyan))] focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] cursor-pointer"
                    />
                    <label htmlFor="isVisible" className="flex-1 cursor-pointer">
                      <p className="font-orbitron text-sm text-foreground">Visible on Portfolio</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.isVisible ? 'Public on your site' : 'Hidden from public'}
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)] sticky bottom-0 bg-[hsl(var(--void-black))] pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-transparent border border-[hsl(var(--deep-electric-blue)/0.5)] text-foreground font-orbitron rounded-lg hover:border-[hsl(var(--neon-cyan))] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedTechIds.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;