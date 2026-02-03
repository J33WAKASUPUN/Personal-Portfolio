import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, GripVertical, Link as LinkIcon, Palette, ExternalLink } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  customName?: string;
  iconUrl: string;
  brandColor: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const availablePlatforms = [
  'LinkedIn',
  'GitHub',
  'Twitter',
  'Gmail',
  'Medium',
  'Upwork',
  'Facebook',
  'Instagram',
  'YouTube',
  'Behance',
  'Dribbble',
  'Stack Overflow',
  'Custom',
];

const SocialLinksManagement = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  
  const [formData, setFormData] = useState({
    platform: 'LinkedIn',
    url: '',
    customName: '',
    iconUrl: '',
    brandColor: '',
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<SocialLink[]>('/social-links/all');
      setSocialLinks(data);
    } catch (error: any) {
      toast.error('Failed to fetch social links: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLink(null);
    setFormData({
      platform: 'LinkedIn',
      url: '',
      customName: '',
      iconUrl: '',
      brandColor: '',
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      customName: link.customName || '',
      iconUrl: link.iconUrl,
      brandColor: link.brandColor,
      order: link.order,
      isVisible: link.isVisible,
    });
    setShowModal(true);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const submitData = { ...formData };

  try {
    if (editingLink) {
      await api.patch(`/social-links/${editingLink._id}`, submitData);
      toast.success('Social link updated successfully');
    } else {
      await api.post('/social-links', submitData);
      if (formData.iconUrl || formData.brandColor) {
        toast.success('Social link created with custom icon/color!');
      } else {
        toast.success('Social link created! Icon auto-fetched.');
      }
    }

    setShowModal(false);
    fetchSocialLinks();
  } catch (error: any) {
    toast.error(error.message || 'Operation failed');
  }
};

  const handleDelete = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to delete "${platform}"?`)) {
      return;
    }

    try {
      await api.delete(`/social-links/${id}`);
      toast.success('Social link deleted successfully');
      fetchSocialLinks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete social link');
    }
  };

  const toggleVisibility = async (link: SocialLink) => {
    try {
      await api.patch(`/social-links/${link._id}`, { isVisible: !link.isVisible });
      toast.success(`${link.platform} is now ${!link.isVisible ? 'visible' : 'hidden'}`);
      fetchSocialLinks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(socialLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    setSocialLinks(items);

    try {
      // Send new order to backend
      const orderedIds = items.map((item) => item._id);
      await api.post('/social-links/reorder', { orderedIds });
      toast.success('Social links reordered successfully');
    } catch (error: any) {
      toast.error('Failed to reorder social links');
      // Revert on error
      fetchSocialLinks();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading social links...</p>
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
            Social Links Management
          </h1>
          <p className="text-muted-foreground">
            Manage your social media presence • {socialLinks.length} links
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Social Link
        </button>
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 border border-[hsl(var(--neon-cyan)/0.3)] bg-[hsl(var(--neon-cyan)/0.05)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--neon-cyan)/0.2)] flex items-center justify-center flex-shrink-0">
            <LinkIcon className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
          </div>
          <div className="flex-1">
            <h3 className="font-orbitron text-sm font-bold text-foreground mb-1">
              Auto-Fetch Icons & Colors
            </h3>
            <p className="text-xs text-muted-foreground">
              Icons and brand colors are automatically fetched from Simple Icons API. Just select a platform and enter your URL! 
              <span className="text-[hsl(var(--neon-cyan))] ml-1">Drag & drop to reorder.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Social Links List - Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {socialLinks.map((link, index) => (
                <Draggable key={link._id} draggableId={link._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`glass-card p-4 border transition-all ${
                        snapshot.isDragging
                          ? 'border-[hsl(var(--neon-cyan))] shadow-[0_0_25px_hsl(var(--neon-cyan)/0.3)] scale-105'
                          : link.isVisible
                          ? 'border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
                          : 'border-red-500/30 bg-red-500/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing p-2 hover:bg-[hsl(var(--deep-electric-blue)/0.2)] rounded transition-colors"
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>

                        {/* Icon with Brand Color */}
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center border-2 flex-shrink-0 transition-transform hover:scale-110"
                          style={{
                            backgroundColor: `${link.brandColor}15`,
                            borderColor: `${link.brandColor}40`,
                          }}
                        >
                          <img
                            src={link.iconUrl}
                            alt={link.platform}
                            className="w-8 h-8 object-contain"
                            style={{ filter: `drop-shadow(0 0 8px ${link.brandColor}40)` }}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(link.platform)}&background=random&size=64`;
                            }}
                          />
                        </div>

                        {/* Platform Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-orbitron text-lg font-bold text-foreground">
                              {link.customName || link.platform}
                            </h3>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: link.brandColor }}
                              title={`Brand Color: ${link.brandColor}`}
                            />
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors truncate block group"
                          >
                            <span className="truncate">{link.url}</span>
                            <ExternalLink className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        {/* Order Badge */}
                        <div className="text-xs font-orbitron text-muted-foreground px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] rounded">
                          #{index + 1}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleVisibility(link)}
                            className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                            title={link.isVisible ? 'Hide' : 'Show'}
                          >
                            {link.isVisible ? (
                              <Eye className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(link)}
                            className="p-2 rounded-lg bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan))] transition-colors"
                          >
                            <Edit className="w-4 h-4 text-[hsl(var(--deep-electric-blue))]" />
                          </button>
                          <button
                            onClick={() => handleDelete(link._id, link.platform)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {socialLinks.length === 0 && (
        <div className="p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
            <LinkIcon className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
            No Social Links Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Add your first social media link to connect with your audience
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
          >
            Add Social Link
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-gradient">
                {editingLink ? 'Edit Social Link' : 'Add Social Link'}
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
  {/* Platform Selection */}
  <div>
    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
      Platform *
    </label>
    <select
      value={formData.platform}
      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
      required
      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
    >
      {availablePlatforms.map((platform) => (
        <option key={platform} value={platform}>
          {platform}
        </option>
      ))}
    </select>
    <p className="text-xs text-muted-foreground mt-1">
      <Palette className="w-3 h-3 inline mr-1" />
      {formData.platform === 'Custom' 
        ? 'Custom platform - manual icon & color required' 
        : 'Icon & color will be auto-fetched (you can override below)'}
    </p>
  </div>

  {/* Custom Name (only for Custom platform) */}
  {formData.platform === 'Custom' && (
    <div>
      <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
        Custom Platform Name *
      </label>
      <input
        type="text"
        value={formData.customName}
        onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
        required
        minLength={2}
        className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
        placeholder="My Custom Platform"
      />
    </div>
  )}

  {/* URL */}
  <div>
    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
      Profile URL *
    </label>
    <input
      type="url"
      value={formData.url}
      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
      required
      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
      placeholder="https://linkedin.com/in/yourname"
    />
  </div>

  {/* Manual Override Section - Available for ALL platforms */}
  <div className="pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
    <div className="flex items-center gap-2 mb-4">
      <h3 className="font-orbitron text-sm font-bold text-[hsl(var(--neon-cyan))]">
        {formData.platform === 'Custom' ? 'Icon & Brand Color' : 'Manual Override (Optional)'}
      </h3>
      {formData.platform !== 'Custom' && (
        <span className="text-xs text-muted-foreground">
          Leave empty to use auto-fetched assets
        </span>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Custom Icon URL */}
      <div>
        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
          Icon URL {formData.platform === 'Custom' && '*'}
        </label>
        <input
          type="url"
          value={formData.iconUrl}
          onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
          required={formData.platform === 'Custom'}
          className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
          placeholder={formData.platform === 'Custom' 
            ? 'https://example.com/icon.svg' 
            : 'Override auto-fetched icon (optional)'}
        />
        {formData.iconUrl && (
          <div className="mt-2 p-3 bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)]">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <div className="flex items-center gap-3">
              <img
                src={formData.iconUrl}
                alt="Icon preview"
                className="w-12 h-12 object-contain bg-white/5 p-2 rounded"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.platform)}&background=random&size=64`;
                }}
              />
              <div className="flex-1">
                <p className="text-xs font-orbitron text-foreground">Icon loaded successfully</p>
                <p className="text-xs text-muted-foreground">This will override the auto-fetched icon</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Brand Color */}
      <div>
        <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
          Brand Color {formData.platform === 'Custom' && '*'}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={formData.brandColor || '#6B7280'}
            onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
            className="w-16 h-12 rounded border border-[hsl(var(--deep-electric-blue)/0.5)] cursor-pointer"
          />
          <input
            type="text"
            value={formData.brandColor}
            onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
            required={formData.platform === 'Custom'}
            className="flex-1 px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground font-mono text-sm transition-all"
            placeholder={formData.platform === 'Custom' ? '#6B7280' : 'Override auto-fetched color'}
          />
        </div>
        {formData.brandColor && (
          <div className="mt-2 p-2 rounded" style={{ backgroundColor: `${formData.brandColor}20`, borderColor: `${formData.brandColor}40`, borderWidth: '1px' }}>
            <p className="text-xs text-foreground">
              Color: <span className="font-mono font-bold">{formData.brandColor}</span>
            </p>
          </div>
        )}
      </div>
    </div>

    {formData.platform !== 'Custom' && !formData.iconUrl && !formData.brandColor && (
      <div className="mt-3 p-3 bg-[hsl(var(--neon-cyan)/0.05)] border border-[hsl(var(--neon-cyan)/0.2)] rounded-lg">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Palette className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
          Icon and brand color will be automatically fetched from Simple Icons API
        </p>
      </div>
    )}
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

  {/* Action Buttons */}
  <div className="flex gap-3 pt-4 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
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
      {editingLink ? 'Update Link' : 'Create Link'}
    </button>
  </div>
</form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksManagement;