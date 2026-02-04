import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, GraduationCap, MapPin, Calendar, Award, BookOpen, TrendingUp } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface Education {
  _id: string;
  degree: string;
  degreeType: string;
  institution: string;
  institutionLogo: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  classAchieved?: string;
  gpa?: string;
  description: string;
  highlights: string[];
  courses: string[];
  institutionWebsite?: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const degreeTypes = [
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Associate Degree",
  "Diploma",
  "Higher National Diploma",
  "Certificate",
  "Bootcamp",
  "Other",
];

const classTypes = [
  "First Class",
  "Second Class Upper",
  "Second Class Lower",
  "Third Class",
  "Pass",
  "Distinction",
  "Merit",
  "Expected",
  "In Progress",
];

const EducationManagement = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const [formData, setFormData] = useState({
    degree: '',
    degreeType: "Bachelor's Degree",
    institution: '',
    institutionLogo: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    classAchieved: '',
    gpa: '',
    description: '',
    highlights: [''],
    courses: [''],
    institutionWebsite: '',
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Education[]>('/education/all');
      setEducations(data);
    } catch (error: any) {
      toast.error('Failed to fetch educations: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEducation(null);
    setFormData({
      degree: '',
      degreeType: "Bachelor's Degree",
      institution: '',
      institutionLogo: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      classAchieved: '',
      gpa: '',
      description: '',
      highlights: [''],
      courses: [''],
      institutionWebsite: '',
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData({
      degree: education.degree,
      degreeType: education.degreeType,
      institution: education.institution,
      institutionLogo: education.institutionLogo,
      location: education.location,
      startDate: education.startDate.split('T')[0],
      endDate: education.endDate ? education.endDate.split('T')[0] : '',
      isCurrentlyStudying: education.isCurrentlyStudying,
      classAchieved: education.classAchieved || '',
      gpa: education.gpa || '',
      description: education.description,
      highlights: education.highlights.length > 0 ? education.highlights : [''],
      courses: education.courses.length > 0 ? education.courses : [''],
      institutionWebsite: education.institutionWebsite || '',
      order: education.order,
      isVisible: education.isVisible,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty arrays
    const cleanedHighlights = formData.highlights.filter((h) => h.trim() !== '');
    const cleanedCourses = formData.courses.filter((c) => c.trim() !== '');

    const submitData = {
      ...formData,
      highlights: cleanedHighlights,
      courses: cleanedCourses,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    try {
      if (editingEducation) {
        await api.patch(`/education/${editingEducation._id}`, submitData);
        toast.success('Education updated successfully');
      } else {
        await api.post('/education', submitData);
        toast.success('Education created successfully');
      }

      setShowModal(false);
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!confirm(`Are you sure you want to delete "${degree}"?`)) {
      return;
    }

    try {
      await api.delete(`/education/${id}`);
      toast.success('Education deleted successfully');
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete education');
    }
  };

  const toggleVisibility = async (education: Education) => {
    try {
      await api.patch(`/education/${education._id}`, { isVisible: !education.isVisible });
      toast.success(`${education.degree} is now ${!education.isVisible ? 'visible' : 'hidden'}`);
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  // Highlights management
  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  // Courses management
  const addCourse = () => {
    setFormData({ ...formData, courses: [...formData.courses, ''] });
  };

  const removeCourse = (index: number) => {
    const newCourses = formData.courses.filter((_, i) => i !== index);
    setFormData({ ...formData, courses: newCourses });
  };

  const updateCourse = (index: number, value: string) => {
    const newCourses = [...formData.courses];
    newCourses[index] = value;
    setFormData({ ...formData, courses: newCourses });
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
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading education records...</p>
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
            Education Management
          </h1>
          <p className="text-muted-foreground">
            Manage your academic background • {educations.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>

      {/* Education Timeline */}
      <div className="space-y-6">
        {educations.map((education) => (
          <div
            key={education._id}
            className={`glass-card p-6 border transition-all ${
              education.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Institution Logo */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[hsl(var(--deep-electric-blue)/0.3)] flex-shrink-0 bg-white/5">
                  <img
                    src={education.institutionLogo}
                    alt={education.institution}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(education.institution)}&background=random&size=64`;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-orbitron text-xl font-bold text-foreground mb-1">
                    {education.degree}
                  </h3>
                  <p className="text-[hsl(var(--neon-cyan))] font-orbitron text-sm mb-2">
                    {education.institution}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {education.degreeType}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {education.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(education.startDate)} - {education.isCurrentlyStudying ? 'Present' : formatDate(education.endDate || '')}
                    </span>
                    {education.classAchieved && (
                      <span className="flex items-center gap-1 text-[hsl(var(--neon-magenta))]">
                        <TrendingUp className="w-4 h-4" />
                        {education.classAchieved}
                      </span>
                    )}
                    {education.gpa && (
                      <span className="flex items-center gap-1 text-[hsl(var(--neon-cyan))]">
                        GPA: {education.gpa}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleVisibility(education)}
                  className="p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                  title={education.isVisible ? 'Hide' : 'Show'}
                >
                  {education.isVisible ? (
                    <Eye className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(education)}
                  className="p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--deep-electric-blue))] text-[hsl(var(--deep-electric-blue))] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(education._id, education.degree)}
                  className="p-2 rounded-lg border border-red-500/30 hover:border-red-500 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {education.description}
            </p>

            {/* Highlights & Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Highlights */}
              {education.highlights.length > 0 && (
                <div className="p-4 rounded-lg bg-[hsl(var(--void-black)/0.5)] border border-[hsl(var(--deep-electric-blue)/0.3)]">
                  <h4 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Highlights
                  </h4>
                  <ul className="space-y-1">
                    {education.highlights.map((highlight, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-[hsl(var(--neon-cyan))]">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Courses */}
              {education.courses.length > 0 && (
                <div className="p-4 rounded-lg bg-[hsl(var(--void-black)/0.5)] border border-[hsl(var(--deep-electric-blue)/0.3)]">
                  <h4 className="font-orbitron text-xs uppercase tracking-wider text-[hsl(var(--neon-magenta))] mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Key Courses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {education.courses.map((course, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded bg-[hsl(var(--neon-magenta)/0.1)] text-[hsl(var(--neon-magenta))] border border-[hsl(var(--neon-magenta)/0.3)]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {educations.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              No Education Records Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first education entry to get started
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
            >
              Add Education
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
                {editingEducation ? 'Edit Education' : 'Add Education'}
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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Degree Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Degree Name */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Degree Name *
                    </label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                      minLength={3}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="Computer Science"
                    />
                  </div>

                  {/* Degree Type */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Degree Type *
                    </label>
                    <select
                      value={formData.degreeType}
                      onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                    >
                      {degreeTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Institution */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      required
                      minLength={2}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="University of Technology"
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
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="New York, USA"
                    />
                  </div>

                  {/* Institution Logo URL */}
                  <div className="md:col-span-2">
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Institution Logo URL *
                    </label>
                    <input
                      type="url"
                      value={formData.institutionLogo}
                      onChange={(e) => setFormData({ ...formData, institutionLogo: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  {/* Institution Website */}
                  <div className="md:col-span-2">
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Institution Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.institutionWebsite}
                      onChange={(e) => setFormData({ ...formData, institutionWebsite: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="https://university.edu"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Duration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.isCurrentlyStudying}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Currently Studying */}
                  <div className="flex items-center gap-3 p-3 bg-[hsl(var(--neon-cyan)/0.05)] rounded-lg border border-[hsl(var(--neon-cyan)/0.3)]">
                    <input
                      type="checkbox"
                      id="isCurrentlyStudying"
                      checked={formData.isCurrentlyStudying}
                      onChange={(e) => setFormData({ ...formData, isCurrentlyStudying: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-cyan))] bg-transparent checked:bg-[hsl(var(--neon-cyan))] cursor-pointer"
                    />
                    <label htmlFor="isCurrentlyStudying" className="cursor-pointer text-sm text-foreground">
                      Currently Studying
                    </label>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))] flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Academic Performance (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Class Achieved */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Class / Grade
                    </label>
                    <select
                      value={formData.classAchieved}
                      onChange={(e) => setFormData({ ...formData, classAchieved: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                    >
                      <option value="">Select class...</option>
                      {classTypes.map((classType) => (
                        <option key={classType} value={classType}>
                          {classType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* GPA */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      GPA / Grade Point
                    </label>
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="3.8 / 4.0"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  minLength={10}
                  rows={4}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground resize-none transition-all"
                  placeholder="Describe your educational experience, major focus areas, etc..."
                />
              </div>

              {/* Highlights */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="flex items-center justify-between">
                  <label className="font-orbitron text-sm uppercase tracking-wider text-foreground">
                    Key Highlights
                  </label>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-1.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-xs font-orbitron"
                  >
                    + Add Highlight
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground text-sm transition-all"
                        placeholder="Dean's List, Honor Roll, etc."
                      />
                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Courses */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="flex items-center justify-between">
                  <label className="font-orbitron text-sm uppercase tracking-wider text-foreground">
                    Key Courses
                  </label>
                  <button
                    type="button"
                    onClick={addCourse}
                    className="px-3 py-1.5 bg-[hsl(var(--neon-magenta)/0.1)] border border-[hsl(var(--neon-magenta)/0.3)] text-[hsl(var(--neon-magenta))] rounded-lg hover:bg-[hsl(var(--neon-magenta)/0.2)] transition-all text-xs font-orbitron"
                  >
                    + Add Course
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.courses.map((course, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => updateCourse(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground text-sm transition-all"
                        placeholder="Data Structures, Algorithms, etc."
                      />
                      {formData.courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(index)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Order */}
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
                  {editingEducation ? 'Update Education' : 'Create Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManagement;