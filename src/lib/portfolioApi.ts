const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class PortfolioApiService {
  private async fetch<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
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
    return this.fetch('/social-links/visible');
  }

  // Analytics
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
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('portfolio_session_id', sessionId);
    }
    
    return sessionId;
  }
}

export const portfolioApi = new PortfolioApiService();