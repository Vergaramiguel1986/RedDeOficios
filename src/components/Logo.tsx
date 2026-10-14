import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-12 md:h-14',
    lg: 'h-20 md:h-24',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <video
        src="/Red-de-Oficios-sin-corazon.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={`${heightClasses} w-auto object-contain rounded-lg transition-transform duration-200 hover:scale-105`}
      />
    </div>
  );
};
