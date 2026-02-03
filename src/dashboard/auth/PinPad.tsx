import { useState, useEffect } from 'react';
import { Delete, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinPadProps {
  length?: number;
  onComplete: (pin: string) => void;
  onBack?: () => void; // To go back to email screen
  disabled?: boolean;
  showError?: boolean;
}

const PinPad = ({
  length = 9,
  onComplete,
  onBack,
  disabled = false,
  showError = false,
}: PinPadProps) => {
  const [pin, setPin] = useState('');

  // Auto-reset on error
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setPin(''), 500);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleNumClick = (num: string) => {
    if (disabled || pin.length >= length) return;
    
    const newPin = pin + num;
    setPin(newPin);

    // Auto-submit if length reached? 
    // Usually better to wait for "Enter" or auto-submit. 
    // Let's auto-submit for speed if that's preferred, 
    // but a manual enter button is safer for long PINs.
    if (newPin.length === length) {
       onComplete(newPin);
    }
  };

  const handleDelete = () => {
    if (disabled) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    setPin('');
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      
      {/* 1. The Digital Display Screen */}
      <div className={cn(
        "relative h-20 bg-[hsl(var(--void-black))] border-2 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300",
        showError 
          ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-shake" 
          : "border-[hsl(var(--deep-electric-blue)/0.5)] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
      )}>
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,243,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        <div className="flex gap-3 z-10">
          {Array.from({ length }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                i < pin.length
                  ? "bg-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(var(--neon-cyan))]"
                  : "bg-[hsl(var(--deep-electric-blue)/0.3)]"
              )}
            />
          ))}
        </div>
        
        {/* Text Status */}
        <div className="absolute bottom-2 right-3 text-[10px] font-orbitron text-[hsl(var(--deep-electric-blue))] opacity-70">
          SECURE_INPUT_V2
        </div>
      </div>

      {/* 2. The Sci-Fi Numpad Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num.toString())}
            disabled={disabled}
            className="h-16 rounded-lg bg-[rgba(10,10,20,0.6)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-2xl font-orbitron font-bold text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.1)] hover:border-[hsl(var(--neon-cyan))] hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}

        {/* Bottom Row: Clear, 0, Delete */}
        <button
          onClick={handleClear}
          disabled={disabled || pin.length === 0}
          className="h-16 rounded-lg bg-[rgba(20,0,0,0.3)] border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500 active:scale-95 transition-all disabled:opacity-30"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={() => handleNumClick('0')}
          disabled={disabled}
          className="h-16 rounded-lg bg-[rgba(10,10,20,0.6)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-2xl font-orbitron font-bold text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.1)] hover:border-[hsl(var(--neon-cyan))] active:scale-95 transition-all disabled:opacity-50"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          disabled={disabled || pin.length === 0}
          className="h-16 rounded-lg bg-[rgba(10,10,20,0.6)] border border-[hsl(var(--deep-electric-blue)/0.3)] text-[hsl(var(--neon-magenta))] flex items-center justify-center hover:bg-[hsl(var(--neon-magenta)/0.1)] hover:border-[hsl(var(--neon-magenta))] active:scale-95 transition-all disabled:opacity-30"
        >
          <Delete size={24} />
        </button>
      </div>

      {/* Back Button */}
      {onBack && (
         <button 
           onClick={onBack}
           className="w-full text-xs text-muted-foreground hover:text-[hsl(var(--neon-cyan))] font-orbitron uppercase tracking-widest transition-colors py-2"
         >
           Cancel / Return to Login
         </button>
      )}
    </div>
  );
};

export default PinPad;