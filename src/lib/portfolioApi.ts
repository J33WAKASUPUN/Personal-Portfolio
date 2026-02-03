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

  // Analytics - Record page view
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