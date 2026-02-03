import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Search, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface TechStack {
  _id: string;
  name: string;
  category: string;
  logoUrl: string;
  officialColor?: string;
  slug: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Cloud',
  'Languages',
  'Tools',
  'Other',
];

const TechStackManagement = () => {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [filteredTechStacks, setFilteredTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    logoUrl: '',
    officialColor: '',
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchTechStacks();
  }, []);

  useEffect(() => {
    filterTechStacks();
  }, [techStacks, selectedCategory, searchQuery]);

  const fetchTechStacks = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<TechStack[]>('/tech-stack/all');
      setTechStacks(data);
    } catch (error: any) {
      toast.error('Failed to fetch tech stacks: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTechStacks = () => {
    let filtered = [...techStacks];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((tech) => tech.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((tech) =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by category, order, then name
    filtered.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });

    setFilteredTechStacks(filtered);
  };

  const handleCreate = () => {
    setEditingTech(null);
    setFormData({
      name: '',
      category: selectedCategory === 'All' ? 'Frontend' : selectedCategory,
      logoUrl: '',
      officialColor: '',
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (tech: TechStack) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      category: tech.category,
      logoUrl: tech.logoUrl,
      officialColor: tech.officialColor || '',
      order: tech.order,
      isVisible: tech.isVisible,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTech) {
        await api.patch(`/tech-stack/${editingTech._id}`, formData);
        toast.success('Tech stack updated successfully');
      } else {
        await api.post('/tech-stack', formData);
        toast.success('Tech stack created successfully! Logo auto-fetched.');
      }

      setShowModal(false);
      fetchTechStacks();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/tech-stack/${id}`);
      toast.success('Tech stack deleted successfully');
      fetchTechStacks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete tech stack');
    }
  };

  const toggleVisibility = async (tech: TechStack) => {
    try {
      await api.patch(`/tech-stack/${tech._id}`, { isVisible: !tech.isVisible });
      toast.success(`${tech.name} is now ${!tech.isVisible ? 'visible' : 'hidden'}`);
      fetchTechStacks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return techStacks.length;
    return techStacks.filter((tech) => tech.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading tech stacks...</p>
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
            Tech Stack Management
          </h1>
          <p className="text-muted-foreground">
            Manage your technology arsenal • {techStacks.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Tech
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech stacks..."
            className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-orbitron text-xs uppercase tracking-wider transition-all ${
                selectedCategory === category
                  ? 'bg-[hsl(var(--neon-cyan))] text-background shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]'
                  : 'bg-[hsl(var(--deep-electric-blue)/0.2)] text-foreground border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
              }`}
            >
              {category} ({getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTechStacks.map((tech) => (
          <div
            key={tech._id}
            className={`group relative p-4 rounded-lg border transition-all hover:scale-105 ${
              tech.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Logo */}
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-lg bg-[hsl(var(--void-black))] p-2">
              <img
                src={tech.logoUrl}
                alt={tech.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${tech.name}&background=random&size=128`;
                }}
              />
            </div>

            {/* Name */}
            <h3 className="font-orbitron text-sm font-bold text-foreground text-center mb-1 truncate">
              {tech.name}
            </h3>

            {/* Category Badge */}
            <div className="flex justify-center mb-3">
              <span className="text-[10px] px-2 py-1 rounded-full bg-[hsl(var(--deep-electric-blue)/0.2)] text-[hsl(var(--deep-electric-blue))] font-orbitron uppercase">
                {tech.category}
              </span>
            </div>

            {/* Color Indicator */}
            {tech.officialColor && (
              <div className="flex justify-center mb-3">
                <div
                  className="w-8 h-2 rounded-full"
                  style={{ backgroundColor: tech.officialColor }}
                />
              </div>
            )}

            {/* Action Buttons - Show on Hover */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => toggleVisibility(tech)}
                className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.3)] border border-[hsl(var(--deep-electric-blue)/0.5)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                title={tech.isVisible ? 'Hide' : 'Show'}
              >
                {tech.isVisible ? (
                  <Eye className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleEdit(tech)}
                className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.3)] border border-[hsl(var(--deep-electric-blue)/0.5)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-[hsl(var(--deep-electric-blue))]" />
              </button>
              <button
                onClick={() => handleDelete(tech._id, tech.name)}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredTechStacks.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              {searchQuery || selectedCategory !== 'All' ? 'No Results Found' : 'No Tech Stacks Yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your filters'
                : 'Add your first technology to get started'}
            </p>
            {!searchQuery && selectedCategory === 'All' && (
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
              >
                Add Tech Stack
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-gradient">
                {editingTech ? 'Edit Tech Stack' : 'Add Tech Stack'}
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
                  Technology Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={1}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                  placeholder="React"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Logo will be auto-fetched from Simple Icons API
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo URL (Optional) */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Custom Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                  placeholder="https://cdn.simpleicons.org/react"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to auto-fetch from Simple Icons API
                </p>
                {formData.logoUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain bg-white/5 p-2 rounded"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=128`;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Official Color (Optional) */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Official Color (Optional)
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.officialColor || '#00f3ff'}
                    onChange={(e) => setFormData({ ...formData, officialColor: e.target.value })}
                    className="w-16 h-12 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.officialColor}
                    onChange={(e) => setFormData({ ...formData, officialColor: e.target.value })}
                    placeholder="#00f3ff"
                    className="flex-1 px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all font-mono"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to auto-fetch from Simple Icons API
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
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
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first within the category
                </p>
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
                    {formData.isVisible ? 'This tech will be displayed publicly' : 'Hidden from public view'}
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
                  {editingTech ? 'Update Tech' : 'Add Tech'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackManagement;