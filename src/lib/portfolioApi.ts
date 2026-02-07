const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ✅ In-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

class PortfolioApiService {
  private async fetch<T>(endpoint: string, useCache = true): Promise<T> {
    const cacheKey = endpoint;
    
    // ✅ Check cache first
    if (useCache) {
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data as T;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // ✅ Store in cache
      if (useCache) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      
      // ✅ Return stale cache on error
      const staleCache = apiCache.get(cacheKey);
      if (staleCache) {
        console.warn(`Using stale cache for ${endpoint}`);
        return staleCache.data as T;
      }
      
      throw error;
    }
  }

  // ✅ Clear cache (useful for dashboard updates)
  clearCache(endpoint?: string) {
    if (endpoint) {
      apiCache.delete(endpoint);
    } else {
      apiCache.clear();
    }
  }

  // ✅ Prefetch multiple endpoints at once
  async prefetchAll() {
    const endpoints = [
      '/hero',
      '/projects/featured',
      '/tech-stack/visible',
      '/experience/visible',
      '/education/visible',
      '/certifications/visible',
      '/blogs/featured',
      '/social-links',
    ];

    await Promise.allSettled(
      endpoints.map(endpoint => this.fetch(endpoint))
    );
  }

  // Hero Section
  async getActiveHero() {
    return this.fetch('/hero');
  }

  // Projects
  async getVisibleProjects() {
    return this.fetch('/projects/visible');
  }

  async getFeaturedProjects() {
    return this.fetch('/projects/featured');
  }

  async getProjectById(id: string) {
    return this.fetch(`/projects/${id}`);
  }

  // Tech Stack
  async getVisibleTechStack() {
    return this.fetch('/tech-stack/visible');
  }

  async getTechStackByCategory(category: string) {
    return this.fetch(`/tech-stack/category/${category}`);
  }

  // Experience
  async getVisibleExperience() {
    return this.fetch('/experience/visible');
  }

  // Education
  async getVisibleEducation() {
    return this.fetch('/education/visible');
  }

  async getEducationById(id: string) {
    return this.fetch(`/education/${id}`);
  }

  // Blogs
  async getVisibleBlogs() {
    return this.fetch('/blogs/visible');
  }

  async getFeaturedBlogs() {
    return this.fetch('/blogs/featured');
  }

  async getBlogById(id: string) {
    return this.fetch(`/blogs/${id}`);
  }

  async getBlogsByCategory(category: string) {
    return this.fetch(`/blogs/category/${category}`);
  }

  // Certifications
  async getVisibleCertifications() {
    return this.fetch('/certifications/visible');
  }

  // Social Links
  async getVisibleSocialLinks() {
    return this.fetch('/social-links');
  }

  // Analytics (no cache)
  async recordPageView(page: string) {
    try {
      const sessionId = this.getOrCreateSessionId();
      
      await fetch(`${API_BASE_URL}/analytics/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          page,
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to record page view:', error);
    }
  }

  async recordProjectView(projectId: string, projectName: string) {
    try {
      const sessionId = this.getOrCreateSessionId();
      
      await fetch(`${API_BASE_URL}/analytics/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'project_view',
          resourceId: projectId,
          resourceName: projectName,
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to record project view:', error);
    }
  }

  async recordBlogView(blogId: string, blogTitle: string) {
    try {
      const sessionId = this.getOrCreateSessionId();
      
      await fetch(`${API_BASE_URL}/analytics/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'blog_view',
          resourceId: blogId,
          resourceName: blogTitle,
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to record blog view:', error);
    }
  }

  // Session Management
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('portfolio_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString().substr(2, 9)}`;
      sessionStorage.setItem('portfolio_session_id', sessionId);
    }
    
    return sessionId;
  }
}

export const portfolioApi = new PortfolioApiService();