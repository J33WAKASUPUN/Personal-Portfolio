import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Building2, Briefcase, MapPin, Calendar, TrendingUp, Award } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

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
  createdAt: string;
  updatedAt: string;
}

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    companyLogo: '',
    companyWebsite: '',
    location: '',
    industry: '',
    roles: [
      {
        title: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        responsibilities: [''],
        achievements: [''],
      },
    ] as Role[],
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Experience[]>('/experience/all');
      setExperiences(data);
    } catch (error: any) {
      toast.error('Failed to fetch experiences: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      companyLogo: '',
      companyWebsite: '',
      location: '',
      industry: '',
      roles: [
        {
          title: '',
          employmentType: 'Full-time',
          startDate: '',
          endDate: '',
          isCurrentRole: false,
          responsibilities: [''],
          achievements: [''],
        },
      ],
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      companyLogo: experience.companyLogo,
      companyWebsite: experience.companyWebsite || '',
      location: experience.location,
      industry: experience.industry || '',
      roles: experience.roles.map((role) => ({
        ...role,
        responsibilities: role.responsibilities.length > 0 ? role.responsibilities : [''],
        achievements: role.achievements.length > 0 ? role.achievements : [''],
      })),
      order: experience.order,
      isVisible: experience.isVisible,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty responsibilities and achievements
    const cleanedRoles = formData.roles.map((role) => ({
      ...role,
      responsibilities: role.responsibilities.filter((r) => r.trim() !== ''),
      achievements: role.achievements.filter((a) => a.trim() !== ''),
    }));

    const submitData = {
      ...formData,
      roles: cleanedRoles,
    };

    try {
      if (editingExperience) {
        await api.patch(`/experience/${editingExperience._id}`, submitData);
        toast.success('Experience updated successfully');
      } else {
        await api.post('/experience', submitData);
        toast.success('Experience created successfully');
      }

      setShowModal(false);
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete experience at "${company}"?`)) {
      return;
    }

    try {
      await api.delete(`/experience/${id}`);
      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete experience');
    }
  };

  const toggleVisibility = async (experience: Experience) => {
    try {
      await api.patch(`/experience/${experience._id}`, { isVisible: !experience.isVisible });
      toast.success(`${experience.company} is now ${!experience.isVisible ? 'visible' : 'hidden'}`);
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  // Role management
  const addRole = () => {
    setFormData({
      ...formData,
      roles: [
        ...formData.roles,
        {
          title: '',
          employmentType: 'Full-time',
          startDate: '',
          endDate: '',
          isCurrentRole: false,
          responsibilities: [''],
          achievements: [''],
        },
      ],
    });
  };

  const removeRole = (index: number) => {
    const newRoles = formData.roles.filter((_, i) => i !== index);
    setFormData({ ...formData, roles: newRoles });
  };

  const updateRole = (index: number, field: keyof Role, value: any) => {
    const newRoles = [...formData.roles];
    (newRoles[index] as any)[field] = value;
    setFormData({ ...formData, roles: newRoles });
  };

  // Responsibilities management
  const addResponsibility = (roleIndex: number) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].responsibilities.push('');
    setFormData({ ...formData, roles: newRoles });
  };

  const removeResponsibility = (roleIndex: number, respIndex: number) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].responsibilities = newRoles[roleIndex].responsibilities.filter((_, i) => i !== respIndex);
    setFormData({ ...formData, roles: newRoles });
  };

  const updateResponsibility = (roleIndex: number, respIndex: number, value: string) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].responsibilities[respIndex] = value;
    setFormData({ ...formData, roles: newRoles });
  };

  // Achievements management
  const addAchievement = (roleIndex: number) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].achievements.push('');
    setFormData({ ...formData, roles: newRoles });
  };

  const removeAchievement = (roleIndex: number, achIndex: number) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].achievements = newRoles[roleIndex].achievements.filter((_, i) => i !== achIndex);
    setFormData({ ...formData, roles: newRoles });
  };

  const updateAchievement = (roleIndex: number, achIndex: number, value: string) => {
    const newRoles = [...formData.roles];
    newRoles[roleIndex].achievements[achIndex] = value;
    setFormData({ ...formData, roles: newRoles });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading experiences...</p>
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
            Experience Management
          </h1>
          <p className="text-muted-foreground">
            Manage your work experience • {experiences.length} {experiences.length === 1 ? 'company' : 'companies'}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6">
        {experiences.map((experience) => (
          <div
            key={experience._id}
            className={`glass-card p-6 border transition-all ${
              experience.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Company Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[hsl(var(--deep-electric-blue)/0.3)] flex-shrink-0 bg-white/5">
                  <img
                    src={experience.companyLogo}
                    alt={experience.company}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(experience.company)}&background=random&size=64`;
                    }}
                  />
                </div>

                {/* Company Info */}
                <div>
                  <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
                    {experience.company}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                    {experience.industry && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{experience.industry}</span>
                      </div>
                    )}
                    {experience.companyWebsite && (
                      <a
                        href={experience.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[hsl(var(--neon-cyan))] hover:underline"
                      >
                        🔗 Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleVisibility(experience)}
                  className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                  title={experience.isVisible ? 'Hide' : 'Show'}
                >
                  {experience.isVisible ? (
                    <Eye className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(experience)}
                  className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                >
                  <Edit className="w-4 h-4 text-[hsl(var(--deep-electric-blue))]" />
                </button>
                <button
                  onClick={() => handleDelete(experience._id, experience.company)}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Roles Timeline */}
            <div className="space-y-4 ml-20 border-l-2 border-[hsl(var(--deep-electric-blue)/0.3)] pl-6">
              {experience.roles.map((role, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[29px] top-2 w-4 h-4 rounded-full border-2 ${
                      role.isCurrentRole
                        ? 'bg-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(var(--neon-cyan))]'
                        : 'bg-[hsl(var(--deep-electric-blue))] border-[hsl(var(--deep-electric-blue))]'
                    }`}
                  />

                  {/* Role Card */}
                  <div className="p-4 rounded-lg bg-[hsl(var(--void-black)/0.5)] border border-[hsl(var(--deep-electric-blue)/0.3)]">
                    {/* Role Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-orbitron text-lg font-bold text-foreground mb-1">
                          {role.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded text-[hsl(var(--deep-electric-blue))] font-orbitron text-xs">
                            {role.employmentType}
                          </span>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(role.startDate)} - {role.isCurrentRole ? 'Present' : formatDate(role.endDate || '')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {role.isCurrentRole && (
                        <span className="px-3 py-1 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full text-[hsl(var(--neon-cyan))] font-orbitron text-xs uppercase">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Responsibilities */}
                    {role.responsibilities.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                          <span className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))]">
                            Responsibilities
                          </span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {role.responsibilities.map((resp, i) => (
                            <li key={i} className="text-sm text-muted-foreground before:content-['•'] before:mr-2 before:text-[hsl(var(--neon-cyan))]">
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {role.achievements.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-[hsl(var(--neon-magenta))]" />
                          <span className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-magenta))]">
                            Achievements
                          </span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {role.achievements.map((ach, i) => (
                            <li key={i} className="text-sm text-muted-foreground before:content-['★'] before:mr-2 before:text-[hsl(var(--neon-magenta))]">
                              {ach}
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

        {/* Empty State */}
        {experiences.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              No Work Experience Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first work experience to get started
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
            >
              Add Experience
            </button>
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
                {editingExperience ? 'Edit Experience' : 'Add Work Experience'}
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
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      minLength={2}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="Acme Corporation"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  {/* Company Logo */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Company Logo URL *
                    </label>
                    <input
                      type="url"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.companyLogo && (
                      <div className="mt-2">
                        <img
                          src={formData.companyLogo}
                          alt="Logo preview"
                          className="w-16 h-16 object-contain bg-white/5 p-2 rounded border border-[hsl(var(--deep-electric-blue)/0.3)]"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company || 'Company')}&background=random&size=64`;
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Company Website */}
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

                  {/* Industry */}
                  <div className="md:col-span-2">
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="Technology, Finance, Healthcare, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Roles & Positions ({formData.roles.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addRole}
                    className="px-3 py-1.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-sm font-orbitron"
                  >
                    + Add Role
                  </button>
                </div>

                {formData.roles.map((role, roleIndex) => (
                  <div
                    key={roleIndex}
                    className="p-4 rounded-lg bg-[hsl(var(--void-black)/0.5)] border border-[hsl(var(--deep-electric-blue)/0.3)] space-y-4"
                  >
                    {/* Role Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                      <span className="font-orbitron text-sm text-[hsl(var(--neon-cyan))]">
                        Role #{roleIndex + 1}
                      </span>
                      {formData.roles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRole(roleIndex)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Job Title */}
                      <div className="md:col-span-2">
                        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) => updateRole(roleIndex, 'title', e.target.value)}
                          required
                          minLength={2}
                          className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                          placeholder="Senior Software Engineer"
                        />
                      </div>

                      {/* Employment Type */}
                      <div>
                        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                          Employment Type *
                        </label>
                        <select
                          value={role.employmentType}
                          onChange={(e) => updateRole(roleIndex, 'employmentType', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                        >
                          {employmentTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={role.startDate}
                          onChange={(e) => updateRole(roleIndex, 'startDate', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={role.endDate || ''}
                          onChange={(e) => updateRole(roleIndex, 'endDate', e.target.value)}
                          disabled={role.isCurrentRole}
                          className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all disabled:opacity-50"
                        />
                      </div>

                      {/* Is Current Role */}
                      <div className="flex items-center gap-3 p-3 bg-[hsl(var(--neon-cyan)/0.05)] rounded-lg border border-[hsl(var(--neon-cyan)/0.3)]">
                        <input
                          type="checkbox"
                          id={`currentRole-${roleIndex}`}
                          checked={role.isCurrentRole}
                          onChange={(e) => updateRole(roleIndex, 'isCurrentRole', e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-cyan))] bg-transparent checked:bg-[hsl(var(--neon-cyan))] cursor-pointer"
                        />
                        <label htmlFor={`currentRole-${roleIndex}`} className="flex-1 cursor-pointer text-sm">
                          <p className="font-orbitron text-foreground">Current Role</p>
                          <p className="text-xs text-muted-foreground">I currently work here</p>
                        </label>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-orbitron text-sm uppercase tracking-wider text-foreground">
                          Responsibilities
                        </label>
                        <button
                          type="button"
                          onClick={() => addResponsibility(roleIndex)}
                          className="text-xs text-[hsl(var(--neon-cyan))] hover:underline"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {role.responsibilities.map((resp, respIndex) => (
                          <div key={respIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={resp}
                              onChange={(e) => updateResponsibility(roleIndex, respIndex, e.target.value)}
                              className="flex-1 px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground text-sm transition-all"
                              placeholder="Led development of..."
                            />
                            {role.responsibilities.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeResponsibility(roleIndex, respIndex)}
                                className="p-2 text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-orbitron text-sm uppercase tracking-wider text-foreground">
                          Achievements
                        </label>
                        <button
                          type="button"
                          onClick={() => addAchievement(roleIndex)}
                          className="text-xs text-[hsl(var(--neon-magenta))] hover:underline"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {role.achievements.map((ach, achIndex) => (
                          <div key={achIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={ach}
                              onChange={(e) => updateAchievement(roleIndex, achIndex, e.target.value)}
                              className="flex-1 px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground text-sm transition-all"
                              placeholder="Increased performance by 40%..."
                            />
                            {role.achievements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAchievement(roleIndex, achIndex)}
                                className="p-2 text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))]">Settings</h3>

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
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center gap-3 p-4 bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)]">
                    <input
                      type="checkbox"
                      id="isVisible"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-cyan))] bg-transparent checked:bg-[hsl(var(--neon-cyan))] cursor-pointer"
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
                >
                  {editingExperience ? 'Update Experience' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;