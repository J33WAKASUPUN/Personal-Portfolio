import { useEffect, useState, useCallback } from 'react';
import Starfield from './Starfield';

interface PreLoaderProps {
  onLoadComplete: () => void;
}

const PreLoader = ({ onLoadComplete }: PreLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Establishing connection...');
  const [isExiting, setIsExiting] = useState(false);

  const loadAllData = useCallback(async () => {
    // Note: In a real app, you might check if API_URL is defined
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jeewakadev.duckdns.org';

    const endpoints = [
      { url: '/hero', label: 'Loading hero data...' },
      { url: '/projects/featured', label: 'Loading projects...' },
      { url: '/tech-stack/visible', label: 'Loading tech stack...' },
      { url: '/experience/visible', label: 'Loading experience...' },
      { url: '/education/visible', label: 'Loading education...' },
      { url: '/certifications/visible', label: 'Loading certifications...' },
      { url: '/blogs/featured', label: 'Loading blogs...' },
      { url: '/social-links', label: 'Loading social links...' },
    ];

    const totalSteps = endpoints.length + 2; // endpoints + animation steps
    let completed = 0;

    // Initial animation step
    setStatusText('Initializing systems...');
    setProgress(5);
    await new Promise((r) => setTimeout(r, 300));

    // Fetch all endpoints
    for (const endpoint of endpoints) {
      setStatusText(endpoint.label);
      try {
        await fetch(`${API_BASE_URL}${endpoint.url}`);
      } catch {
        // Silently fail - data will be refetched by components
      }
      completed++;
      setProgress(Math.round(((completed + 1) / totalSteps) * 100));
      // Small delay for visual smoothness
      await new Promise((r) => setTimeout(r, 100));
    }

    // Final step
    setStatusText('Systems online. Welcome aboard.');
    setProgress(100);
    await new Promise((r) => setTimeout(r, 600));

    // Begin exit animation
    setIsExiting(true);
    await new Promise((r) => setTimeout(r, 800));

    onLoadComplete();
  }, [onLoadComplete]);

  useEffect(() => {
    loadAllData();

    // Safety timeout - force complete after 10 seconds
    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onLoadComplete(), 800);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loadAllData, onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Starfield Background */}
      <Starfield />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6">

        {/* Logo / Brand & Reactor Animation */}
        <div className="flex flex-col items-center gap-6">
          
          {/* FUSION REACTOR LOADER */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* 1. Background Glow Blob */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[hsl(var(--neon-cyan)/0.2)] to-[hsl(var(--neon-magenta)/0.2)] blur-2xl animate-pulse" />

            {/* 2. Static Tech Ring (Thin) */}
            <div className="absolute inset-0 rounded-full border border-[hsl(var(--deep-electric-blue)/0.3)] opacity-50" />

            {/* 3. Outer Cyan Arc (Fast Spin) */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[hsl(var(--neon-cyan))] border-r-[hsl(var(--neon-cyan)/0.5)] animate-[spin_1.5s_cubic-bezier(0.5,0,0.5,1)_infinite] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.6)]" />

            {/* 4. Middle Magenta Arc (Counter-Spin) */}
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-[hsl(var(--neon-magenta))] border-l-[hsl(var(--neon-magenta)/0.5)] animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_hsl(var(--neon-magenta)/0.6)]" />

            {/* 5. Inner Dashed Data Ring (Slow Spin) */}
            <div className="absolute inset-8 rounded-full border border-dashed border-[hsl(var(--star-white)/0.3)] animate-[spin_8s_linear_infinite]" />

            {/* 6. Central Core (Glassmorphism + Pulse) */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--deep-electric-blue)/0.2)] backdrop-blur-sm border border-[hsl(var(--neon-cyan)/0.3)] flex items-center justify-center shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]">
                {/* Ping Effect */}
                <div className="absolute w-full h-full rounded-full bg-[hsl(var(--neon-cyan))] opacity-20 animate-ping" />
                {/* Solid Core Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_white,0_0_20px_hsl(var(--neon-cyan))]" />
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-neon-gradient tracking-wide mt-2">
            J33wakaDev
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-72 md:w-96 space-y-3">
          {/* Bar Container */}
          <div className="relative w-full h-1.5 bg-[hsl(var(--deep-electric-blue)/0.2)] rounded-full overflow-hidden border border-[hsl(var(--deep-electric-blue)/0.2)]">
            {/* Animated Fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-magenta)))',
                boxShadow: '0 0 15px hsl(var(--neon-cyan) / 0.5), 0 0 30px hsl(var(--neon-magenta) / 0.3)',
              }}
            />
            {/* Shimmer Effect */}
            <div
              className="absolute inset-y-0 left-0 rounded-full opacity-50"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between px-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground truncate max-w-[70%]">
              {statusText}
            </p>
            <span className="font-orbitron text-xs text-[hsl(var(--neon-cyan))] tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="font-mono text-[10px] text-muted-foreground/30 text-center leading-relaxed select-none">
          <p>{'>'} SYSTEM v2.0 // PORTFOLIO ENGINE</p>
          <p className="animate-pulse">{'>'} LOADING MODULES...</p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PreLoader;