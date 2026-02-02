import { ExternalLink, Github, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  allTags: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  planetColor: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[hsl(var(--void-black))] border-2 border-[hsl(var(--deep-electric-blue)/0.5)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-2xl text-neon-gradient">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        
        {/* Project Image */}
        {project.image && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.3)]">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        
        {/* Description */}
        <div className="space-y-4">
          <p className="text-foreground/90 leading-relaxed">
            {project.fullDescription}
          </p>
          
          {/* Full Tech Stack */}
          <div>
            <h4 className="font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-orbitron uppercase tracking-wider bg-[hsl(var(--deep-electric-blue)/0.2)] text-[hsl(var(--neon-cyan))] border border-[hsl(var(--neon-cyan)/0.3)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action Links */}
          <div className="flex gap-4 pt-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-orbitron text-sm uppercase tracking-wider bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300"
            >
              <ExternalLink size={18} />
              Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-orbitron text-sm uppercase tracking-wider border-2 border-[hsl(var(--neon-magenta)/0.5)] text-[hsl(var(--neon-magenta))] rounded-lg hover:bg-[hsl(var(--neon-magenta)/0.1)] hover:border-[hsl(var(--neon-magenta))] hover:shadow-[0_0_25px_hsl(var(--neon-magenta)/0.4)] transition-all duration-300"
            >
              <Github size={18} />
              Source Code
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
