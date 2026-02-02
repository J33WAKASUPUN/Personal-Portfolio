import { Project } from './ProjectModal';
import TechLogo from './TechLogo';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-80 cursor-pointer holographic-card border border-[hsl(var(--deep-electric-blue)/0.3)] hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500 group"
    >
      {/* Thumbnail Image */}
      <div className="relative w-full h-44 overflow-hidden">
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
        
        {/* Glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.1)] to-[hsl(var(--neon-magenta)/0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-orbitron text-lg font-bold text-foreground mb-3 group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
          {project.title}
        </h3>
        
        {/* Tech Stack with Logos */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-[hsl(var(--deep-electric-blue)/0.2)] border border-[hsl(var(--deep-electric-blue)/0.3)] rounded-full"
            >
              <TechLogo name={tag} size={14} />
              <span className="font-orbitron uppercase tracking-wider text-foreground/80">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
