import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface Trail {
  x: number;
  y: number;
  id: number;
}

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: -100, y: -100 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      setCursorPos({ x, y });

      // Add trail particle
      const newTrail: Trail = {
        x,
        y,
        id: trailId++,
      };

      // Keep last 12 positions for the trail
      setTrails((prev) => [...prev, newTrail].slice(-12));

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        computedCursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup trails when mouse stops
    const cleanupInterval = setInterval(() => {
      setTrails((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(1); // Remove oldest trail to create fade effect
      });
    }, 40);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <>
      {/* Hide Default Cursor */}
      <style>{`
        body, a, button, [role="button"], input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      {/* Trail (Ghost Cursors) */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: trail.x,
            top: trail.y,
            // Fade out based on index (older = more transparent)
            opacity: (index / trails.length) * 0.4, 
            // Shrink slightly at the tail
            transform: `translate(0, 0) scale(${0.8 + (index / trails.length) * 0.2})`, 
            transition: 'opacity 0.1s',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              fill="hsl(var(--neon-cyan))"
            />
          </svg>
        </div>
      ))}

      {/* Main Cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          // Slight click animation
          transform: isPointer ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 5px hsl(var(--neon-cyan)))' }}
        >
          <defs>
            <linearGradient id="cursor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--neon-magenta))" />
            </linearGradient>
          </defs>
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="hsl(var(--void-black))"
            stroke="url(#cursor-gradient)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;