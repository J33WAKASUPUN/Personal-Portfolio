import { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail, Brain, Cloud, Cpu, Sparkles } from 'lucide-react';
import TypewriterText from './TypewriterText';
import GlitchButton from './GlitchButton';
import heroSpaceBg from '@/assets/hero-space-bg.png';
import { portfolioApi } from '@/lib/portfolioApi';

interface HeroData {
  name: string;
  titles: string[];
  bio: string;
  profileImageUrl: string;
  resumeUrl: string;
  isActive: boolean;
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await portfolioApi.getActiveHero();
        setHeroData(data);
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
        // Set fallback data if API fails
        setHeroData({
          name: 'Jeewaka Supun',
          titles: [
            'Full-Stack Developer',
            'Software Engineer',
            'UI/UX Enthusiast',
            'Problem Solver',
          ],
          bio: 'Passionate software engineer with expertise in building scalable web applications and intuitive user experiences.',
          profileImageUrl: '',
          resumeUrl: '#',
          isActive: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
    
    // Record page view
    portfolioApi.recordPageView('/');
  }, []);

  if (isLoading) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroSpaceBg} 
            alt="Deep Space Background" 
            className="w-full h-full object-cover object-[75%_center] opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        {/* Loading State */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--neon-cyan))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-[hsl(var(--neon-cyan))] text-sm">
            {'// Initializing connection...'}
          </p>
        </div>
      </section>
    );
  }

  if (!heroData) {
    return null;
  }

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
                {heroData.name}
              </span>
            </h1>

            <div className="h-10 md:h-12 mb-6 animate-fade-in flex justify-center lg:justify-start items-center" style={{ animationDelay: '0.2s' }}>
              <span className="font-orbitron text-xl md:text-2xl text-muted-foreground mr-2">{'>'}</span>
              <TypewriterText
                texts={heroData.titles}
                className="font-orbitron text-xl md:text-2xl text-[hsl(var(--neon-magenta))]"
              />
            </div>
            
            {/* UPDATED: Terminal Style About Card */}
            <div className="glass-card scan-lines mb-8 animate-fade-in overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.8)] shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.3s' }}>              
              {/* Terminal Header Row */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--void-black)/0.5)] border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-3 font-orbitron text-[10px] md:text-xs text-muted-foreground tracking-wider opacity-70">
                  user_bio.txt
                </span>
              </div>

              {/* Terminal Body content */}
              <div className="p-6 bg-[hsl(var(--void-black)/0.2)]">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light font-mono">
                  <span className="text-[hsl(var(--neon-cyan))] mr-2 select-none">$</span>
                  {heroData.bio}
                  <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-[hsl(var(--neon-cyan))] align-middle" />
                </p>
              </div>
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
                as="a"
                href={heroData.resumeUrl}
                download
              >
                Download Resume
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
            
            {/* Container with rings */}
            <div className="relative w-[340px] h-[340px] md:w-[540px] md:h-[540px] flex items-center justify-center">
              
              {/* Ring 1: Outer Dashed (Cyan) */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[hsl(var(--neon-cyan)/0.9)] shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)] animate-[spin_60s_linear_infinite]" />
              
              {/* Ring 2: Middle Reverse (Purple) */}
              <div className="absolute inset-10 rounded-full border border-dashed border-[hsl(var(--neon-magenta)/0.9)] opacity-80 animate-[spin_45s_linear_infinite_reverse]" />

              {/* Ring 3: Inner Solid (Blue) */}
              <div className="absolute inset-24 rounded-full border-2 border-[hsl(var(--deep-electric-blue)/0.9)] shadow-[0_0_15px_hsl(var(--deep-electric-blue)/0.4)]" />

              {/* Ring 4: Pulsing Core (Magenta) */}
              <div className="absolute inset-32 rounded-full border border-[hsl(var(--neon-magenta)/0.4)] animate-pulse" />

              {/* Orbiting Icons */}
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

              {/* Profile Picture Circle - DYNAMIC FROM CMS */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1.5 bg-gradient-to-br from-[hsl(var(--neon-cyan))] via-[hsl(var(--deep-electric-blue))] to-[hsl(var(--neon-magenta))] shadow-[0_0_60px_hsl(var(--deep-electric-blue)/0.6)] z-10">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-[5px] border-black relative">
                  {heroData.profileImageUrl ? (
                    <img
                      src={heroData.profileImageUrl}
                      alt={heroData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                      <span className="font-orbitron text-6xl md:text-8xl text-white font-bold">
                        {heroData.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 cursor-pointer"
             onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="font-orbitron text-[10px] md:text-xs tracking-[0.3em] text-[hsl(var(--neon-cyan))] drop-shadow-[0_0_8px_hsl(var(--neon-cyan)/0.8)] font-bold">
            SCROLL
          </span>
          <ChevronDown 
            className="text-[hsl(var(--neon-cyan))] drop-shadow-[0_0_8px_hsl(var(--neon-cyan)/0.8)]" 
            size={24} 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;