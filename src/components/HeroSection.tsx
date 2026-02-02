import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import TypewriterText from './TypewriterText';
import GlitchButton from './GlitchButton';
import heroSpaceBg from '@/assets/hero-space-bg.jpg';

const HeroSection = () => {
  const roles = [
    'Full-Stack Developer',
    'Software Engineer',
    'UI/UX Enthusiast',
    'Problem Solver',
  ];

  const aboutText = `Passionate software engineer with expertise in building scalable web applications and intuitive user experiences. I specialize in modern JavaScript frameworks, cloud architecture, and creating elegant solutions to complex problems. Ready to launch your next mission into the digital frontier.`;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Cinematic Space Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroSpaceBg} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        {/* Deep blue overlay */}
        <div className="absolute inset-0 bg-[hsl(var(--deep-electric-blue)/0.15)]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          {/* Left side - Profile Image */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1 opacity-0 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[hsl(var(--deep-electric-blue)/0.3)] via-[hsl(var(--neon-cyan)/0.2)] to-[hsl(var(--neon-magenta)/0.2)] blur-2xl animate-pulse" />
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[hsl(var(--neon-magenta)/0.3)] via-[hsl(var(--deep-electric-blue)/0.4)] to-[hsl(var(--neon-cyan)/0.3)] blur-xl" />
              
              {/* Rotating ring */}
              <div className="absolute -inset-3 rounded-full border-2 border-[hsl(var(--deep-electric-blue)/0.5)] animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute -inset-1 rounded-full border border-[hsl(var(--neon-cyan)/0.3)]" />
              
              {/* Profile container */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-1 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] glow-ring pulse-glow">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {/* Placeholder for profile image */}
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--deep-electric-blue)/0.3)] via-background to-[hsl(var(--neon-magenta)/0.2)] flex items-center justify-center">
                    <span className="font-orbitron text-7xl md:text-9xl text-neon-gradient">JS</span>
                  </div>
                </div>
              </div>

              {/* Orbiting elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[520px] md:h-[520px]">
                <div className="absolute w-4 h-4 bg-[hsl(var(--neon-cyan))] rounded-full blur-[2px] animate-orbit" />
                <div className="absolute w-3 h-3 bg-[hsl(var(--deep-electric-blue))] rounded-full blur-[2px] animate-orbit" style={{ animationDelay: '-2s' }} />
                <div className="absolute w-3 h-3 bg-[hsl(var(--neon-magenta))] rounded-full blur-[2px] animate-orbit-reverse" />
              </div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left">
            <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm md:text-base uppercase tracking-[0.3em] mb-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
              {'// Initializing connection...'}
            </p>
            <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <span className="text-foreground">Hello, I'm</span>
              <br />
              <span className="text-neon-gradient">Jeewaka Supun</span>
            </h1>
            <div className="h-12 md:h-14 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <span className="font-orbitron text-xl md:text-2xl text-muted-foreground">
                {'> '}
              </span>
              <TypewriterText
                texts={roles}
                className="font-orbitron text-xl md:text-2xl text-[hsl(var(--neon-magenta))]"
              />
            </div>
            
            {/* About Bio */}
            <div className="glass-card p-6 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {aboutText}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <GlitchButton
                variant="primary"
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
              </GlitchButton>
              <GlitchButton
                variant="outline"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
              </GlitchButton>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 justify-center lg:justify-start opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full border border-[hsl(var(--deep-electric-blue)/0.5)] text-foreground/70 hover:text-[hsl(var(--neon-cyan))] hover:border-[hsl(var(--neon-cyan))] hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)] transition-all duration-300 glitch-effect"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors"
          >
            <span className="font-orbitron text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="animate-bounce" size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
