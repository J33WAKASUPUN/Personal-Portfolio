import { useState, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
}

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  fallback,
  width,
  height,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imgSrc = hasError && fallback ? fallback : src;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[hsl(var(--deep-electric-blue)/0.2)] animate-pulse rounded-inherit" />
      )}
      
      {/* Image */}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;