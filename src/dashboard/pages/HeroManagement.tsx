import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface Hero {
  _id: string;
  name: string;
  title: string;
  bio: string;
  profileImageUrl: string;
  resumeUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const HeroManagement = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImageUrl: '',
    resumeUrl: '',
    isActive: false,
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Hero[]>('/hero/all');
      setHeroes(data);
    } catch (error: any) {
      toast.error('Failed to fetch hero sections: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHero(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      profileImageUrl: '',
      resumeUrl: '',
      isActive: false,
    });
    setShowModal(true);
  };

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setFormData({
      name: hero.name,
      title: hero.title,
      bio: hero.bio,
      profileImageUrl: hero.profileImageUrl,
      resumeUrl: hero.resumeUrl,
      isActive: hero.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingHero) {
        // Update existing hero
        await api.patch(`/hero/${editingHero._id}`, formData);
        toast.success('Hero section updated successfully');
      } else {
        // Create new hero
        await api.post('/hero', formData);
        toast.success('Hero section created successfully');
      }

      setShowModal(false);
      fetchHeroes();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the hero section for "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/hero/${id}`);
      toast.success('Hero section deleted successfully');
      fetchHeroes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete hero section');
    }
  };

  const handleSetActive = async (id: string, name: string) => {
    try {
      await api.patch(`/hero/${id}/activate`, {});
      toast.success(`Hero section for "${name}" is now active`);
      fetchHeroes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate hero section');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading hero sections...</p>
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
            Hero Section Management
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio hero section content
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Hero
        </button>
      </div>

      {/* Hero Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {heroes.map((hero) => (
          <div
            key={hero._id}
            className={`relative p-6 rounded-lg border transition-all ${
              hero.isActive
                ? 'border-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.05)] shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]'
                : 'border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)]'
            }`}
          >
            {/* Active Badge */}
            {hero.isActive && (
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--neon-cyan))] text-background text-xs font-orbitron font-bold rounded-full">
                  <Eye className="w-3 h-3" />
                  ACTIVE
                </span>
              </div>
            )}

            {/* Profile Image */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[hsl(var(--neon-cyan))] flex-shrink-0">
                <img
                  src={hero.profileImageUrl}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-1 truncate">
                  {hero.name}
                </h3>
                <p className="text-sm text-[hsl(var(--neon-cyan))] font-orbitron mb-2 truncate">
                  {hero.title}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {hero.bio}
            </p>

            {/* Links */}
            <div className="flex gap-2 mb-4 text-xs">
              <a
                href={hero.profileImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--deep-electric-blue)/0.2)] text-[hsl(var(--deep-electric-blue))] hover:bg-[hsl(var(--deep-electric-blue)/0.3)] transition-colors"
              >
                <ImageIcon className="w-3 h-3" />
                Image
              </a>
              <a
                href={hero.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--neon-magenta)/0.2)] text-[hsl(var(--neon-magenta))] hover:bg-[hsl(var(--neon-magenta)/0.3)] transition-colors"
              >
                <FileText className="w-3 h-3" />
                Resume
              </a>
            </div>

            {/* Metadata */}
            <div className="text-xs text-muted-foreground mb-4">
              <p>Created: {new Date(hero.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(hero.updatedAt).toLocaleDateString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!hero.isActive && (
                <button
                  onClick={() => handleSetActive(hero._id, hero.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all font-orbitron text-sm"
                >
                  <Check className="w-4 h-4" />
                  Set Active
                </button>
              )}
              <button
                onClick={() => handleEdit(hero)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))] rounded-lg hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(hero._id, hero.name)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {heroes.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <FileText className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              No Hero Sections Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first hero section to get started
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
            >
              Create Hero Section
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-gradient">
                {editingHero ? 'Edit Hero Section' : 'Create Hero Section'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-red-500 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                  placeholder="Your full name"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Title/Role *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                  placeholder="Full-Stack Developer | Software Engineer"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground resize-none transition-all"
                  placeholder="Tell visitors about yourself..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length} / 1000 characters
                </p>
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Profile Image URL *
                </label>
                <input
                  type="url"
                  value={formData.profileImageUrl}
                  onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                  placeholder="https://example.com/profile.jpg"
                />
                {formData.profileImageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.profileImageUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[hsl(var(--neon-cyan))]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/96';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Resume URL */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Resume URL *
                </label>
                <input
                  type="url"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-3 p-4 bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)]">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-cyan))] bg-transparent checked:bg-[hsl(var(--neon-cyan))] focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] cursor-pointer"
                />
                <label htmlFor="isActive" className="flex-1 cursor-pointer">
                  <p className="font-orbitron text-sm text-foreground">Set as Active</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.isActive
                      ? 'This hero will be displayed on your portfolio (deactivates others)'
                      : 'This hero will be saved but not displayed'}
                  </p>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
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
                  {editingHero ? 'Update Hero' : 'Create Hero'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManagement;