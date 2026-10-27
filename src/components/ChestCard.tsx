import React from 'react';
import { Briefcase, Team } from '../types';
import { Check } from 'lucide-react';

interface ChestCardProps {
  briefcase: Briefcase;
  teams: Team[];
  isSelectable?: boolean;
  onSelect?: () => void;
  showContent?: boolean;
}

export const ChestCard: React.FC<ChestCardProps> = ({
  briefcase,
  teams,
  isSelectable = false,
  onSelect,
  showContent = false,
}) => {
  const assignedTeam = briefcase.chosenByTeamId
    ? teams.find((t) => t.id === briefcase.chosenByTeamId)
    : null;

  return (
    <div
      onClick={isSelectable ? onSelect : undefined}
      className={`relative group flex flex-col items-center select-none transition-all duration-300 ${
        isSelectable
          ? 'cursor-pointer transform hover:-translate-y-2 hover:scale-105'
          : ''
      }`}
    >
      {/* Wooden Chest Graphic matching Figma Image 1 */}
      <div className="relative w-36 sm:w-44 h-28 sm:h-32 flex flex-col items-center justify-end">
        <svg
          viewBox="0 0 160 120"
          className={`w-full h-full drop-shadow-2xl transition-all duration-300 ${
            assignedTeam ? 'filter drop-shadow-[0_0_12px_rgba(234,179,8,0.7)]' : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow underneath */}
          <ellipse cx="80" cy="115" rx="65" ry="5" fill="black" fillOpacity="0.4" />

          {/* Chest Body (Gỗ nâu vân gỗ) */}
          <rect x="20" y="46" width="120" height="66" rx="4" fill="#8B4513" stroke="#5C2E0B" strokeWidth="2" />
          
          {/* Wood Planks Lines */}
          <line x1="20" y1="68" x2="140" y2="68" stroke="#5C2E0B" strokeWidth="2.5" />
          <line x1="20" y1="90" x2="140" y2="90" stroke="#5C2E0B" strokeWidth="2.5" />

          {/* Left & Right Gold Trim Bands */}
          <rect x="30" y="46" width="14" height="66" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          <rect x="116" y="46" width="14" height="66" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />

          {/* Chest Lid (Nắp rương cong vòm) */}
          <path
            d="M16 46 C16 18, 144 18, 144 46 Z"
            fill="#A0522D"
            stroke="#5C2E0B"
            strokeWidth="2.5"
          />

          {/* Lid Gold Trim Bands */}
          <path
            d="M30 46 C30 25, 44 25, 44 46 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          <path
            d="M116 46 C116 25, 130 25, 130 46 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* Center Golden Lock Plate / Shield (Mặt ổ khóa màu vàng) */}
          <path
            d="M70 38 L90 38 L90 58 L80 66 L70 58 Z"
            fill="#F59E0B"
            stroke="#92400E"
            strokeWidth="2"
          />
          {/* Keyhole */}
          <circle cx="80" cy="48" r="3" fill="#451A03" />
          <polygon points="78,48 82,48 81,56 79,56" fill="#451A03" />

          {/* Corner Studs / Rivets (Đinh tán vàng) */}
          <circle cx="37" cy="54" r="2" fill="#FEF3C7" />
          <circle cx="37" cy="80" r="2" fill="#FEF3C7" />
          <circle cx="37" cy="102" r="2" fill="#FEF3C7" />
          <circle cx="123" cy="54" r="2" fill="#FEF3C7" />
          <circle cx="123" cy="80" r="2" fill="#FEF3C7" />
          <circle cx="123" cy="102" r="2" fill="#FEF3C7" />
        </svg>

        {/* Revealed Effect Overlay (if opened) */}
        {showContent && briefcase.isOpened && (
          <div className="absolute inset-x-2 bottom-3 z-10 bg-black/90 rounded-xl border border-amber-400 p-2 text-center animate-fadeIn">
            <span className="text-[10px] text-amber-400 font-bold block">
              {briefcase.label}
            </span>
          </div>
        )}
      </div>

      {/* Parchment Ribbon Banner (RƯƠNG SỐ X) matching Figma */}
      <div className="relative -mt-1 sm:-mt-2 z-10">
        <div
          className={`px-4 sm:px-5 py-1 rounded-sm border shadow-lg transition-all ${
            assignedTeam
              ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border-amber-600 text-amber-950 ring-2 ring-amber-400'
              : 'bg-[#fffae6] border-[#b45309] text-[#78350f]'
          }`}
        >
          <span className="font-['Cinzel',serif] font-black text-xs sm:text-sm tracking-wider uppercase block text-center">
            RƯƠNG SỐ {briefcase.id}
          </span>
        </div>

        {/* Team Ownership Badge */}
        {assignedTeam && (
          <div className="text-center mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${assignedTeam.color} shadow-md`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
              {assignedTeam.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
