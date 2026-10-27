import React from 'react';

export const TrongDongBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-5"
      aria-hidden="true"
    >
      {/* Subtle Retro Arcade Scanlines / Grid */}
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
