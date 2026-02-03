import { ChevronDown, Github, Linkedin, Mail, Brain, Cloud, Cpu, Sparkles } from 'lucide-react';
import TypewriterText from './TypewriterText';
import GlitchButton from './GlitchButton';
import heroSpaceBg from '@/assets/hero-space-bg.png';

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Cinematic Space Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroSpaceBg} 
          alt="Deep Space Background" 
          className="w-full h-full object-cover object-[75%_center] opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        {/* Floating Spaceship Element */}
        <div className="absolute top-20 right-10 w-32 h-32 md:w-48 md:h-48 opacity-80 animate-float pointer-events-none hidden lg:block">
           {/* Add spaceship logic here if needed */}
        </div>
      </div>

      {/* Content Container */}
      <div className="container max-w-7xl mx-auto px-6 relative z-10 py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[80vh]">
          
          {/* 1. TEXT CONTENT (Left Side) */}
          <div className="flex flex-col justify-center text-center lg:text-left w-full lg:w-1/2 order-2 lg:order-1">
            <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm md:text-base uppercase tracking-[0.3em] mb-4 animate-fade-in">
              {'// Initializing connection...'}
            </p>
            
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Hello, I'm</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] filter drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                Jeewaka Supun
              </span>
            </h1>

            <div className="h-10 md:h-12 mb-6 animate-fade-in flex justify-center lg:justify-start items-center" style={{ animationDelay: '0.2s' }}>
              <span className="font-orbitron text-xl md:text-2xl text-muted-foreground mr-2">{'>'}</span>
              <TypewriterText
                texts={roles}
                className="font-orbitron text-xl md:text-2xl text-[hsl(var(--neon-magenta))]"
              />
            </div>
            
            <div className="glass-card p-6 mb-8 animate-fade-in border-l-4 border-l-[hsl(var(--neon-cyan))]" style={{ animationDelay: '0.3s' }}>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                {aboutText}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

            <div className="flex gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full border border-white/10 text-gray-400 hover:text-[hsl(var(--neon-cyan))] hover:border-[hsl(var(--neon-cyan))] hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)] transition-all duration-300 bg-black/50 backdrop-blur-md"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. PROFILE IMAGE (Right Side) */}
          <div className="relative flex-shrink-0 order-1 lg:order-2 animate-scale-in flex justify-center lg:justify-end w-full lg:w-1/2">
            
            {/* Increased Container Size to fit larger rings */}
            <div className="relative w-[340px] h-[340px] md:w-[540px] md:h-[540px] flex items-center justify-center">
              
              {/* Ring 1: Outer Dashed (Cyan) - Brighter & Glowing */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[hsl(var(--neon-cyan)/0.9)] shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)] animate-[spin_60s_linear_infinite]" />
              
              {/* Ring 2: Middle Reverse (Purple) - NEW RING */}
              <div className="absolute inset-10 rounded-full border border-dashed border-[hsl(var(--neon-magenta)/0.9)] opacity-80 animate-[spin_45s_linear_infinite_reverse]" />

              {/* Ring 3: Inner Solid (Blue) - Brighter */}
              <div className="absolute inset-24 rounded-full border-2 border-[hsl(var(--deep-electric-blue)/0.9)] shadow-[0_0_15px_hsl(var(--deep-electric-blue)/0.4)]" />

              {/* Ring 4: Pulsing Core (Magenta) - NEW RING */}
              <div className="absolute inset-32 rounded-full border border-[hsl(var(--neon-magenta)/0.4)] animate-pulse" />

              {/* Orbiting Icons */}
              {/* Adjusted positions (inset) to match the larger container */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-[hsl(var(--neon-purple)/0.8)] p-3 rounded-xl backdrop-blur-md z-20 hover:scale-110 transition-transform shadow-[0_0_15px_hsl(var(--neon-purple)/0.4)]">
                <Sparkles size={24} className="text-[hsl(var(--neon-purple))]" />
              </div>
              
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-black/80 border border-[hsl(var(--deep-electric-blue)/0.8)] p-3 rounded-xl backdrop-blur-md z-20 hover:scale-110 transition-transform shadow-[0_0_15px_hsl(var(--deep-electric-blue)/0.4)]">
                <Cloud size={24} className="text-[hsl(var(--deep-electric-blue))]" />
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black/80 border border-[hsl(var(--neon-cyan)/0.8)] p-3 rounded-xl backdrop-blur-md z-20 hover:scale-110 transition-transform shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]">
                <Cpu size={24} className="text-[hsl(var(--neon-cyan))]" />
              </div>

              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-[hsl(var(--neon-magenta)/0.8)] p-3 rounded-xl backdrop-blur-md z-20 hover:scale-110 transition-transform shadow-[0_0_15px_hsl(var(--neon-magenta)/0.4)]">
                <Brain size={24} className="text-[hsl(var(--neon-magenta))]" />
              </div>

              {/* Profile Picture Circle - SIGNIFICANTLY BIGGER */}
              {/* Increased from w-60 (15rem) to w-80 (20rem) */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1.5 bg-gradient-to-br from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] shadow-[0_0_60px_hsl(var(--deep-electric-blue)/0.6)] z-10">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-[5px] border-black relative">
                   {/* Profile Image PlaceHolder */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                    <span className="font-orbitron text-6xl md:text-8xl text-white font-bold">JS</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-muted-foreground hover:text-[hsl(var(--neon-cyan))]" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;