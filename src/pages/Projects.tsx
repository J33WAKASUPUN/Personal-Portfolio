import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Starfield from '@/components/Starfield';
import Footer from '@/components/Footer';
import ProjectModal, { Project } from '@/components/ProjectModal';
import TechLogo from '@/components/TechLogo';
import GlitchButton from '@/components/GlitchButton';

const allProjects: Project[] = [
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
  {
    id: 7,
    title: 'DevOps Pipeline',
    description: 'Automated CI/CD pipeline with multi-cloud deployment support.',
    fullDescription: 'A comprehensive DevOps automation platform that streamlines the entire software delivery lifecycle. Features include automated testing, containerized deployments, infrastructure as code, and monitoring dashboards.',
    tags: ['Terraform', 'Docker', 'AWS', 'GitHub'],
    allTags: ['Terraform', 'Docker', 'AWS', 'GitHub Actions', 'Kubernetes', 'Ansible', 'Prometheus', 'Grafana'],
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))]',
  },
  {
    id: 8,
    title: 'FinTrack Pro',
    description: 'Personal finance management with AI-powered insights.',
    fullDescription: 'A smart personal finance application that helps users track expenses, set budgets, and achieve financial goals. Features AI-powered spending analysis, investment tracking, and personalized recommendations.',
    tags: ['React', 'Python', 'PostgreSQL', 'Stripe'],
    allTags: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Stripe', 'Docker', 'AWS'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    planetColor: 'from-[hsl(var(--neon-magenta))] to-[hsl(var(--deep-electric-blue))]',
  },
];

const Projects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield />
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-orbitron text-sm uppercase tracking-wider">Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-16">
            <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm uppercase tracking-[0.3em] mb-4">
              {'// All Missions'}
            </p>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-neon-gradient mb-4">
              Project Archive
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete catalog of my digital expeditions. Each project represents countless hours of 
              problem-solving, learning, and creative engineering.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] mx-auto mt-6" />
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="cursor-pointer holographic-card border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-48 overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${project.planetColor} opacity-30`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-orbitron text-xl font-bold text-foreground mb-2 group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full"
                      >
                        <TechLogo name={tag} size={12} />
                        <span className="font-orbitron uppercase tracking-wider text-foreground/80">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Projects;
