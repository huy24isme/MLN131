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
    <button
      type="button"
      onClick={isSelectable ? onSelect : undefined}
      disabled={!isSelectable && !assignedTeam}
      aria-label={`Rương số ${briefcase.id}${assignedTeam ? ` của ${assignedTeam.name}` : ''}`}
      className={`relative group flex flex-col items-center select-none transition-transform duration-100 p-2 cursor-pointer font-['VT323',monospace] ${
        isSelectable
          ? 'hover:-translate-y-1 hover:scale-105 active:translate-y-1'
          : assignedTeam
          ? 'cursor-default'
          : 'opacity-70 cursor-not-allowed'
      }`}
    >
      {/* 8-Bit Pixel Art Chest SVG */}
      <div className="relative w-32 sm:w-40 h-28 sm:h-32 flex flex-col items-center justify-end">
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full image-rendering-pixelated filter drop-shadow-[3px_3px_0px_#000]"
          shapeRendering="crispEdges"
        >
          {/* Base Shadow */}
          <rect x="6" y="58" width="52" height="4" fill="#000000" fillOpacity="0.4" />

          {/* Chest Outer Black Border */}
          <rect x="8" y="20" width="48" height="38" fill="#000000" />
          <rect x="12" y="16" width="40" height="4" fill="#000000" />

          {/* Lid Top Arc */}
          <rect x="14" y="18" width="36" height="4" fill="#d97706" />

          {/* Chest Body Wood (Brown) */}
          <rect x="10" y="22" width="44" height="34" fill="#b45309" />
          
          {/* Wood Planks Details */}
          <rect x="10" y="32" width="44" height="2" fill="#78350f" />
          <rect x="10" y="44" width="44" height="2" fill="#78350f" />

          {/* Left & Right Gold Bands */}
          <rect x="14" y="20" width="6" height="36" fill="#facc15" />
          <rect x="44" y="20" width="6" height="36" fill="#facc15" />

          {/* Lid Highlight */}
          <rect x="16" y="20" width="32" height="4" fill="#f59e0b" />

          {/* Golden Center Lock (Pixel Lock Plate) */}
          <rect x="28" y="28" width="8" height="12" fill="#facc15" />
          <rect x="26" y="30" width="12" height="8" fill="#facc15" />
          {/* Keyhole */}
          <rect x="30" y="32" width="4" height="4" fill="#000000" />
          <rect x="31" y="36" width="2" height="3" fill="#000000" />

          {/* Corner Pixel Rivets */}
          <rect x="16" y="24" width="2" height="2" fill="#ffffff" />
          <rect x="46" y="24" width="2" height="2" fill="#ffffff" />
          <rect x="16" y="50" width="2" height="2" fill="#ffffff" />
          <rect x="46" y="50" width="2" height="2" fill="#ffffff" />
        </svg>

        {/* Revealed Effect Overlay */}
        {showContent && briefcase.isOpened && (
          <div className="absolute inset-0 z-10 bg-black/95 border-2 border-yellow-300 p-2 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-yellow-300 block leading-tight font-bold">
              {briefcase.label}
            </span>
          </div>
        )}
      </div>

      {/* 8-Bit Parchment Banner [ RƯƠNG 0X ] */}
      <div className="relative -mt-1 z-10">
        <div
          className={`px-3 py-0.5 text-base sm:text-lg tracking-wider uppercase border-2 border-black font-bold ${
            assignedTeam
              ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_#000]'
              : 'bg-white text-black shadow-[2px_2px_0px_#000]'
          }`}
        >
          RƯƠNG {briefcase.id < 10 ? `0${briefcase.id}` : briefcase.id}
        </div>

        {/* Team Ownership Badge */}
        {assignedTeam && (
          <div className="text-center mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs text-white bg-gradient-to-r ${assignedTeam.color} border border-black shadow-[1px_1px_0px_#000]`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
              {assignedTeam.name}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
