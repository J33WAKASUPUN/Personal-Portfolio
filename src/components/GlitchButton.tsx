import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlitchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const GlitchButton = ({
  children,
  variant = 'primary',
  className,
  ...props
}: GlitchButtonProps) => {
  const baseStyles =
    'relative px-8 py-4 font-orbitron font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 overflow-hidden glitch-effect';

  const variants = {
    primary:
      'bg-gradient-to-r from-neon-cyan to-neon-magenta text-background hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.6),0_0_60px_hsl(var(--neon-magenta)/0.4)]',
    secondary:
      'bg-muted text-foreground border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)]',
    outline:
      'bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]',
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default GlitchButton;
