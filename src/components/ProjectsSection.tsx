import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import ProjectModal, { Project } from './ProjectModal';
import GlitchButton from './GlitchButton';

const projects: Project[] = [
  {
    id: 1,
    title: 'Nebula Dashboard',
    description: 'Real-time analytics platform with interactive data visualization and AI-powered insights.',
    fullDescription: 'A comprehensive real-time analytics dashboard built for enterprise clients. Features include interactive D3.js visualizations, AI-powered trend predictions, customizable widgets, and real-time data streaming. The platform processes millions of data points daily and provides actionable insights through an intuitive interface.',
    tags: ['React', 'TypeScript', 'D3.js', 'Node.js'],
    allTags: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))]',
  },
  {
    id: 2,
    title: 'Quantum Commerce',
    description: 'Next-gen e-commerce platform with seamless checkout and inventory management.',
    fullDescription: 'A full-featured e-commerce solution with advanced inventory management, AI-powered product recommendations, and a seamless multi-step checkout process. Integrated with Stripe for payments and features real-time stock updates, abandoned cart recovery, and comprehensive analytics.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
    allTags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind', 'Prisma', 'Vercel', 'Redis'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-magenta))] to-[hsl(var(--deep-electric-blue))]',
  },
  {
    id: 3,
    title: 'Stellar Chat',
    description: 'Real-time messaging app with end-to-end encryption and multimedia support.',
    fullDescription: 'A secure messaging application featuring end-to-end encryption, real-time message delivery, file sharing, voice messages, and group chat functionality. Built with WebSocket technology for instant communication and includes features like message reactions, read receipts, and typing indicators.',
    tags: ['React Native', 'Socket.io', 'MongoDB', 'AWS'],
    allTags: ['React Native', 'TypeScript', 'Socket.io', 'MongoDB', 'AWS', 'Node.js', 'Express', 'Redis'],
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]',
  },
  {
    id: 4,
    title: 'Cosmic API',
    description: 'Scalable RESTful API gateway with rate limiting and comprehensive documentation.',
    fullDescription: 'A high-performance API gateway designed to handle millions of requests per day. Features include intelligent rate limiting, request caching, automatic documentation generation, health monitoring, and multi-environment deployment. Built with scalability and developer experience in mind.',
    tags: ['Go', 'Docker', 'Redis', 'Kubernetes'],
    allTags: ['Go', 'Docker', 'Redis', 'Kubernetes', 'PostgreSQL', 'Nginx', 'Prometheus', 'Grafana'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-cyan))]',
  },
  {
    id: 5,
    title: 'Neural Network Studio',
    description: 'Visual tool for designing and training machine learning models.',
    fullDescription: 'An intuitive visual interface for designing, training, and deploying machine learning models. Features drag-and-drop neural network design, real-time training visualization, model export to various formats, and integration with popular ML frameworks.',
    tags: ['Python', 'React', 'TensorFlow', 'Docker'],
    allTags: ['Python', 'React', 'TypeScript', 'TensorFlow', 'Docker', 'FastAPI', 'PostgreSQL', 'AWS'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-cyan))]',
  },
  {
    id: 6,
    title: 'CloudSync Storage',
    description: 'Distributed file storage system with real-time synchronization.',
    fullDescription: 'Enterprise-grade distributed file storage with automatic synchronization across devices. Features include version history, conflict resolution, sharing permissions, and real-time collaboration. Built for reliability and performance at scale.',
    tags: ['Go', 'AWS', 'PostgreSQL', 'React'],
    allTags: ['Go', 'AWS S3', 'PostgreSQL', 'React', 'TypeScript', 'gRPC', 'Docker', 'Terraform'],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))]',
  },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    }

    return () => observer.disconnect();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Duplicate projects for infinite scroll effect
  const duplicatedProjects = [...projects, ...projects];

  return (
    <section
      ref={sectionRef}
      id="projects"
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
            {'// Portfolio.render()'}
          </p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-neon-gradient mb-4">
            Planetary Systems
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the constellation of projects I've navigated through. Each one represents a unique journey 
            in solving complex challenges.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
        </div>

        {/* Marquee Container */}
        <div className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Projects */}
          <div className="flex gap-6 marquee">
            {duplicatedProjects.map((project, index) => (
              <ProjectCard
                key={`${project.id}-${index}`}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <GlitchButton
            variant="primary"
            onClick={() => navigate('/projects')}
          >
            Explore All Missions
          </GlitchButton>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ProjectsSection;
