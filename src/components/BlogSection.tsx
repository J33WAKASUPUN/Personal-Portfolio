import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, BookOpen, Tag } from 'lucide-react';
import { portfolioApi } from '@/lib/portfolioApi';
import GlitchButton from './GlitchButton';

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
}

const BlogSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getFeaturedBlogs();
      console.log('✅ Featured blogs loaded:', data.length, 'records');
      setBlogs(data);
    } catch (error) {
      console.error('❌ Failed to fetch blogs:', error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Create duplicated array for seamless infinite scroll
  const marqueeBlogs = [...blogs, ...blogs];

  if (isLoading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-orbitron text-[hsl(var(--neon-cyan))]">Loading blogs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="blogs"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--deep-electric-blue)/0.1)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-cyan)/0.05)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
            {'// Blogs.featured()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Latest Articles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on software development, technology, and innovation.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Blogs Infinite Scroll Marquee */}
        <div className="w-full overflow-hidden">
          {/* Gradient Overlays for smooth fade out at edges */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

            {/* Moving Track */}
            <div 
              className="flex gap-8 animate-marquee hover:pause"
              style={{ width: 'max-content' }}
            >
              {marqueeBlogs.map((blog, index) => (
                <div
                  key={`${blog._id}-${index}`}
                  className="flex-shrink-0 w-[400px]"
                >
                  {/* CRT Monitor Card */}
                  <div className="glass-card scan-lines border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group h-full flex flex-col">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--deep-electric-blue)/0.3)]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <div className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 font-orbitron text-[9px] text-muted-foreground uppercase tracking-wider truncate">
                          article.md
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-[hsl(var(--neon-cyan)/0.2)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full">
                        <BookOpen className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                        <span className="text-[9px] font-orbitron text-[hsl(var(--neon-cyan))] uppercase">{blog.source}</span>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random&size=400`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random&size=400`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      
                      {/* Featured Badge */}
                      {blog.isFeatured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[hsl(var(--neon-cyan)/0.9)] backdrop-blur-sm rounded-full">
                          <span className="text-[10px] font-orbitron text-background font-bold uppercase">Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta Info - Date Only (removed read time) */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(blog.pubDate)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-orbitron text-lg font-bold text-foreground mb-3 group-hover:text-[hsl(var(--neon-cyan))] transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        {blog.description}
                      </p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.categories.slice(0, 3).map((category) => (
                          <div
                            key={category}
                            className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors"
                          >
                            <Tag className="w-2.5 h-2.5 text-[hsl(var(--neon-cyan))]" />
                            <span className="text-[10px] font-orbitron text-foreground/80 uppercase">
                              {category}
                            </span>
                          </div>
                        ))}
                        {blog.categories.length > 3 && (
                          <div className="px-2 py-1 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full">
                            <span className="text-[10px] font-orbitron text-[hsl(var(--neon-cyan))]">
                              +{blog.categories.length - 3}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Author & Claps */}
                      <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                        {blog.author && (
                          <span className="font-orbitron">by {blog.author}</span>
                        )}
                      </div>

                      {/* Read on Medium Button */}
                      <a
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron text-xs font-bold uppercase rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Read on {blog.source}
                      </a>
                    </div>

                    {/* Status Bar */}
                    <div className="px-4 py-2 border-t border-[hsl(var(--deep-electric-blue)/0.3)] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                        <span className="text-[9px] text-muted-foreground font-mono">Click to read article</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        {/* <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <GlitchButton
            variant="primary"
            onClick={() => navigate('/blogs')}
          >
            Read All Articles
          </GlitchButton>
        </div> */}

        {/* Bottom Decorative Element */}
         <div className={`mt-16 flex justify-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[hsl(var(--neon-cyan))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-cyan))]" />
            <div className="w-32 h-px bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" />
            <div className="w-3 h-3 rotate-45 border border-[hsl(var(--neon-magenta))]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[hsl(var(--neon-magenta))]" />
          </div>
        </div>
      </div>

      {/* Styles for Infinite Marquee Animation - SLOWED DOWN TO 80s */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: scroll-left 80s linear infinite; /* Increased from 40s to 80s */
        }
        
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;