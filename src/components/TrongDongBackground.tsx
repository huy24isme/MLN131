import React from 'react';

export const TrongDongBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-25">
      {/* Radial Bronze Drum Graphic */}
      <svg
        className="w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] text-amber-500/20 animate-spin-very-slow select-none"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="500" cy="500" r="480" stroke="currentColor" strokeWidth="4" strokeDasharray="16 8" />
        <circle cx="500" cy="500" r="440" stroke="currentColor" strokeWidth="6" />
        <circle cx="500" cy="500" r="380" stroke="currentColor" strokeWidth="4" strokeDasharray="8 6" />
        <circle cx="500" cy="500" r="320" stroke="currentColor" strokeWidth="5" />
        <circle cx="500" cy="500" r="260" stroke="currentColor" strokeWidth="4" strokeDasharray="12 6" />
        <circle cx="500" cy="500" r="190" stroke="currentColor" strokeWidth="6" />
        <circle cx="500" cy="500" r="120" stroke="currentColor" strokeWidth="4" />

        {/* 14-pointed Star in Center (Ngôi sao 14 cánh Trống Đồng) */}
        <g stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.1">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14;
            const rad = (angle * Math.PI) / 180;
            const x1 = 500 + Math.cos(rad) * 115;
            const y1 = 500 + Math.sin(rad) * 115;
            const radLeft = ((angle - 12) * Math.PI) / 180;
            const radRight = ((angle + 12) * Math.PI) / 180;
            const x2 = 500 + Math.cos(radLeft) * 35;
            const y2 = 500 + Math.sin(radLeft) * 35;
            const x3 = 500 + Math.cos(radRight) * 35;
            const y3 = 500 + Math.sin(radRight) * 35;

            return (
              <polygon
                key={i}
                points={`${x1},${y1} ${x2},${y2} 500,500 ${x3},${y3}`}
              />
            );
          })}
        </g>

        {/* Flying Birds Ring (Vành chim Lạc bay ngược chiều kim đồng hồ) */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i * 360) / 18;
          const rad = (angle * Math.PI) / 180;
          const cx = 500 + Math.cos(rad) * 410;
          const cy = 500 + Math.sin(rad) * 410;

          return (
            <g
              key={i}
              transform={`translate(${cx}, ${cy}) rotate(${angle + 90}) scale(0.7)`}
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M-25,0 Q-10,-15 15,-5 Q0,-2 -25,0 Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M-15,-5 L-35,-20" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
