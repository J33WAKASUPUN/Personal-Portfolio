import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Award, ExternalLink, Calendar, Building2, Image as ImageIcon, Search, CheckCircle2 } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  certificateImageUrl: string;
  issueDate: string;
  credentialUrl: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const CertificationsManagement = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    certificateImageUrl: '',
    issueDate: '',
    credentialUrl: '',
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    filterCertifications();
  }, [certifications, searchQuery]);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Certification[]>('/certifications/all');
      setCertifications(data);
    } catch (error: any) {
      toast.error('Failed to fetch certifications: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCertifications = () => {
    let filtered = [...certifications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((cert) =>
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by order, then issue date (newest first)
    filtered.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    });

    setFilteredCertifications(filtered);
  };

  const handleCreate = () => {
    setEditingCertification(null);
    setFormData({
      name: '',
      issuer: '',
      certificateImageUrl: '',
      issueDate: '',
      credentialUrl: '',
      order: 0,
      isVisible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({
      name: certification.name,
      issuer: certification.issuer,
      certificateImageUrl: certification.certificateImageUrl,
      issueDate: certification.issueDate.split('T')[0],
      credentialUrl: certification.credentialUrl,
      order: certification.order,
      isVisible: certification.isVisible,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      issueDate: new Date(formData.issueDate).toISOString(),
    };

    try {
      if (editingCertification) {
        await api.patch(`/certifications/${editingCertification._id}`, submitData);
        toast.success('Certification updated successfully');
      } else {
        await api.post('/certifications', submitData);
        toast.success('Certification created successfully');
      }

      setShowModal(false);
      fetchCertifications();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/certifications/${id}`);
      toast.success('Certification deleted successfully');
      fetchCertifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete certification');
    }
  };

  const toggleVisibility = async (certification: Certification) => {
    try {
      await api.patch(`/certifications/${certification._id}`, { isVisible: !certification.isVisible });
      toast.success(`${certification.name} is now ${!certification.isVisible ? 'visible' : 'hidden'}`);
      fetchCertifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading certifications...</p>
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
            Certifications Management
          </h1>
          <p className="text-muted-foreground">
            Manage your professional certifications • {certifications.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certifications by name or issuer..."
            className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
          />
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCertifications.map((certification) => (
          <div
            key={certification._id}
            className={`group rounded-lg border transition-all overflow-hidden ${
              certification.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Certificate Image */}
            <div className="relative h-48 overflow-hidden bg-[hsl(var(--deep-electric-blue)/0.1)]">
              <img
                src={certification.certificateImageUrl}
                alt={certification.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(certification.name)}&background=random&size=400`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Verified Badge */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-orbitron text-green-400">Verified</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title & Issuer */}
              <div>
                <h3 className="font-orbitron text-lg font-bold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                  {certification.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  <span className="font-orbitron">{certification.issuer}</span>
                </div>
              </div>

              {/* Issue Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-[hsl(var(--neon-magenta))]" />
                <span>Issued {formatDate(certification.issueDate)}</span>
              </div>

              {/* Credential Link */}
              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[hsl(var(--neon-cyan))] hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Credential</span>
                </a>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[hsl(var(--deep-electric-blue)/0.2)]">
                <button
                  onClick={() => toggleVisibility(certification)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))] rounded-lg hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all text-sm"
                  title={certification.isVisible ? 'Hide' : 'Show'}
                >
                  {certification.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(certification)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(certification._id, certification.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredCertifications.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <Award className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              {searchQuery ? 'No Certifications Found' : 'No Certifications Yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Add your first professional certification to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
              >
                Add Certification
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue))] rounded-lg p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[hsl(var(--void-black))] pb-4 border-b border-[hsl(var(--deep-electric-blue)/0.3)] z-10">
              <h2 className="font-orbitron text-2xl font-bold text-neon-gradient">
                {editingCertification ? 'Edit Certification' : 'Add Certification'}
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
                  <Award className="w-5 h-5" />
                  Certification Details
                </h3>

                {/* Certification Name */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={3}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>

                {/* Issuer */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    required
                    minLength={2}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="Amazon Web Services (AWS)"
                  />
                </div>

                {/* Issue Date */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                  />
                </div>

                {/* Certificate Image URL */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Certificate Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.certificateImageUrl}
                    onChange={(e) => setFormData({ ...formData, certificateImageUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://example.com/certificate.jpg"
                  />
                  {formData.certificateImageUrl && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <div className="relative rounded-lg overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.3)]">
                        <img
                          src={formData.certificateImageUrl}
                          alt="Certificate preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Certificate')}&background=random&size=400`;
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Credential URL */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Credential Verification URL *
                  </label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://www.credly.com/badges/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to verify the authenticity of this credential
                  </p>
                </div>
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
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
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
                  {editingCertification ? 'Update Certification' : 'Create Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsManagement;