import React from 'react';
interface LogoProps {
  size?: number;
  className?: string;
  iconClassName?: string;
}
export function Logo({
  size = 48,
  className = '',
  iconClassName = ''
}: LogoProps) {
  return (
    <div
      className={`rounded-2xl flex items-center justify-center shadow-lg overflow-hidden ${className}`}
      style={{
        width: size + 16,
        height: size + 16
      }}>
      
      <img
        src="/fintra.png"
        alt="Fintra Logo"
        className={`w-full h-full object-cover ${iconClassName}`} />
      
    </div>);

}