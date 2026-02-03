import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, RefreshCw, X, BookOpen, Calendar, Clock, ExternalLink, Search, Filter, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  categories: string[];
  tags: string[];
  author?: string;
  readTime?: string;
  claps?: number;
  source: string;
  order: number;
  isVisible: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
  const [mediumUsername, setMediumUsername] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    link: '',
    pubDate: new Date().toISOString().split('T')[0],
    thumbnail: '',
    categories: [] as string[],
    tags: [] as string[],
    author: '',
    readTime: '',
    source: 'Manual',
    order: 0,
    isVisible: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchQuery, selectedCategory, filterFeatured]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Blog[]>('/blogs/all');
      setBlogs(data);
    } catch (error: any) {
      toast.error('Failed to fetch blogs: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get<string[]>('/blogs/categories');
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((blog) =>
        blog.categories.includes(selectedCategory)
      );
    }

    // Featured filter
    if (filterFeatured === 'featured') {
      filtered = filtered.filter((b) => b.isFeatured);
    } else if (filterFeatured === 'regular') {
      filtered = filtered.filter((b) => !b.isFeatured);
    }

    // Sort by featured, order, then publish date
    filtered.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

    setFilteredBlogs(filtered);
  };

  const handleSyncMedium = async () => {
    if (!mediumUsername.trim()) {
      toast.error('Please enter your Medium username');
      return;
    }

    try {
      setIsSyncing(true);
      const result = await api.post<{
        synced: number;
        updated: number;
        failed: number;
        errors: string[];
      }>(`/blogs/sync/${mediumUsername}`, {});

      toast.success(
        `Synced: ${result.synced} new, ${result.updated} updated, ${result.failed} failed`
      );
      
      if (result.errors.length > 0) {
        console.error('Sync errors:', result.errors);
      }

      fetchBlogs();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync Medium blogs');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      link: '',
      pubDate: new Date().toISOString().split('T')[0],
      thumbnail: '',
      categories: [],
      tags: [],
      author: '',
      readTime: '',
      source: 'Manual',
      order: 0,
      isVisible: true,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      link: blog.link,
      pubDate: blog.pubDate.split('T')[0],
      thumbnail: blog.thumbnail || '',
      categories: blog.categories,
      tags: blog.tags,
      author: blog.author || '',
      readTime: blog.readTime || '',
      source: blog.source,
      order: blog.order,
      isVisible: blog.isVisible,
      isFeatured: blog.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      pubDate: new Date(formData.pubDate).toISOString(),
    };

    try {
      if (editingBlog) {
        await api.patch(`/blogs/${editingBlog._id}`, submitData);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', submitData);
        toast.success('Blog created successfully');
      }

      setShowModal(false);
      fetchBlogs();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  const toggleVisibility = async (blog: Blog) => {
    try {
      await api.patch(`/blogs/${blog._id}`, { isVisible: !blog.isVisible });
      toast.success(`${blog.title} is now ${!blog.isVisible ? 'visible' : 'hidden'}`);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  const toggleFeatured = async (blog: Blog) => {
    try {
      await api.patch(`/blogs/${blog._id}/toggle-featured`, {});
      toast.success(`${blog.title} is now ${!blog.isFeatured ? 'featured' : 'not featured'}`);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle featured status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading blogs...</p>
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
            Blogs Management
          </h1>
          <p className="text-muted-foreground">
            Sync and manage your blog posts • {blogs.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Blog
        </button>
      </div>

      {/* Medium Sync Section */}
      <div className="glass-card p-6 border border-[hsl(var(--deep-electric-blue)/0.3)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">
              Sync from Medium
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically import your latest blog posts from Medium RSS feed
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={mediumUsername}
                onChange={(e) => setMediumUsername(e.target.value)}
                placeholder="Your Medium username"
                className="flex-1 px-4 py-2 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                disabled={isSyncing}
              />
              <button
                onClick={handleSyncMedium}
                disabled={isSyncing}
                className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>
        </div>
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
              placeholder="Search blogs..."
              className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
            />
          </div>

          {/* Featured Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
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

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full font-orbitron text-xs uppercase tracking-wider transition-all ${
              selectedCategory === 'All'
                ? 'bg-[hsl(var(--neon-cyan))] text-background shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]'
                : 'bg-[hsl(var(--deep-electric-blue)/0.2)] text-foreground border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
            }`}
          >
            All ({blogs.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-orbitron text-xs uppercase tracking-wider transition-all ${
                selectedCategory === category
                  ? 'bg-[hsl(var(--neon-cyan))] text-background shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]'
                  : 'bg-[hsl(var(--deep-electric-blue)/0.2)] text-foreground border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)]'
              }`}
            >
              {category} ({blogs.filter((b) => b.categories.includes(category)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className={`group relative rounded-lg border transition-all ${
              blog.isVisible
                ? 'border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] hover:border-[hsl(var(--neon-cyan)/0.5)] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]'
                : 'border-red-500/30 bg-red-500/5 opacity-50'
            }`}
          >
            {/* Featured Badge */}
            {blog.isFeatured && (
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
                src={blog.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random&size=400`}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random&size=400`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Source Badge */}
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.8)] backdrop-blur-sm border border-[hsl(var(--neon-cyan)/0.3)] rounded text-[hsl(var(--neon-cyan))] text-xs font-orbitron">
                  {blog.source}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <h3 className="font-orbitron text-lg font-bold text-foreground line-clamp-2 min-h-[3.5rem]">
                {blog.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
                {blog.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(blog.pubDate)}</span>
                </div>
                {blog.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{blog.readTime}</span>
                  </div>
                )}
                {blog.claps && blog.claps > 0 && (
                  <div className="flex items-center gap-1">
                    <span>👏</span>
                    <span>{blog.claps}</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {blog.categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded text-[10px] font-orbitron text-foreground/80"
                  >
                    {category}
                  </span>
                ))}
                {blog.categories.length > 3 && (
                  <span className="px-2 py-1 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded text-[10px] font-orbitron text-[hsl(var(--neon-cyan))]">
                    +{blog.categories.length - 3}
                  </span>
                )}
              </div>

              {/* Links & Author */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  {blog.author && (
                    <p className="text-muted-foreground">by {blog.author}</p>
                  )}
                </div>
                {blog.link && (
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[hsl(var(--neon-cyan))] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Read</span>
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-[hsl(var(--deep-electric-blue)/0.2)]">
                <button
                  onClick={() => toggleVisibility(blog)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))] rounded-lg hover:bg-[hsl(var(--deep-electric-blue)/0.2)] transition-all text-sm"
                  title={blog.isVisible ? 'Hide' : 'Show'}
                >
                  {blog.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleFeatured(blog)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    blog.isFeatured
                      ? 'bg-[hsl(var(--neon-magenta)/0.2)] border border-[hsl(var(--neon-magenta)/0.3)] text-[hsl(var(--neon-magenta))]'
                      : 'bg-[hsl(var(--deep-electric-blue)/0.1)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--deep-electric-blue))]'
                  } hover:opacity-80`}
                  title={blog.isFeatured ? 'Unfeature' : 'Feature'}
                >
                  <Star className={`w-4 h-4 ${blog.isFeatured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] rounded-lg hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id, blog.title)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[hsl(var(--deep-electric-blue)/0.3)] rounded-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--deep-electric-blue)/0.1)] flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[hsl(var(--deep-electric-blue))]" />
            </div>
            <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
              {searchQuery || selectedCategory !== 'All' || filterFeatured !== 'all' ? 'No Blogs Found' : 'No Blogs Yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'All' || filterFeatured !== 'all'
                ? 'Try adjusting your filters'
                : 'Sync from Medium or create your first blog post'}
            </p>
            {!searchQuery && selectedCategory === 'All' && filterFeatured === 'all' && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-[hsl(var(--neon-cyan))] text-background font-orbitron font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
                >
                  Create Blog
                </button>
              </div>
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
                {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
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
                  <Sparkles className="w-5 h-5" />
                  Basic Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    minLength={3}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="My Awesome Blog Post"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    minLength={10}
                    rows={3}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground resize-none transition-all"
                    placeholder="Brief description for cards"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Full Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={8}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground resize-none transition-all font-mono text-sm"
                    placeholder="Full blog content (supports markdown)"
                  />
                </div>

                {/* Grid: Link + Pub Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Link */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Article Link *
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                      placeholder="https://medium.com/@username/post"
                    />
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Publish Date *
                    </label>
                    <input
                      type="date"
                      value={formData.pubDate}
                      onChange={(e) => setFormData({ ...formData, pubDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    />
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title || 'Blog')}&background=random&size=400`;
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Information */}
              <div className="space-y-4 pt-6 border-t border-[hsl(var(--deep-electric-blue)/0.3)]">
                <h3 className="font-orbitron text-lg font-bold text-[hsl(var(--neon-cyan))]">Meta Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Author */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="5 min read"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                      placeholder="Medium, Dev.to, etc."
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.categories.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categories: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                    placeholder="JavaScript, React, Web Development"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-orbitron text-sm uppercase tracking-wider text-foreground mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
                    placeholder="programming, tutorial, frontend"
                  />
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
                      className="w-full px-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none text-foreground transition-all"
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
                      className="w-5 h-5 rounded border-2 border-[hsl(var(--neon-magenta))] bg-transparent checked:bg-[hsl(var(--neon-magenta))] cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                      <p className="font-orbitron text-sm text-foreground flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured Post
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formData.isFeatured ? 'Will be highlighted' : 'Regular post'}
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
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsManagement;