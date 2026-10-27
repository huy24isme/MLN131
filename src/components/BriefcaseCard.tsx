import React from 'react';
import { Briefcase as BriefcaseIcon, Lock, Check } from 'lucide-react';
import { Briefcase, Team } from '../types';

interface BriefcaseCardProps {
  briefcase: Briefcase;
  teams: Team[];
  isSelectable?: boolean;
  onSelect?: () => void;
  showContent?: boolean;
}

export const BriefcaseCard: React.FC<BriefcaseCardProps> = ({
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
      className={`relative group select-none transition-all duration-300 ${
        isSelectable
          ? 'cursor-pointer transform hover:-translate-y-2 hover:scale-105'
          : ''
      }`}
    >
      {/* 3D Briefcase Body */}
      <div
        className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 shadow-xl ${
          assignedTeam
            ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-amber-500/70 shadow-amber-500/20'
            : isSelectable
            ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600 hover:border-amber-400 hover:shadow-amber-500/30'
            : 'bg-slate-900/60 border-slate-700 opacity-60'
        }`}
      >
        {/* Metallic Handle */}
        <div className="w-12 h-4 -mt-7 mb-2 border-3 border-amber-400/80 rounded-t-lg bg-slate-950/80 shadow-sm"></div>

        {/* Top Metallic Locks */}
        <div className="w-full flex justify-between px-3 mb-2">
          <div className="w-3 h-2 rounded bg-amber-400/60 shadow"></div>
          <div className="w-3 h-2 rounded bg-amber-400/60 shadow"></div>
        </div>

        {/* Briefcase Icon & Number */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center mb-2 shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
            {briefcase.id}
          </span>
        </div>

        {/* Briefcase Label / Team Ownership */}
        {assignedTeam ? (
          <div className="w-full text-center mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${assignedTeam.color} shadow-md`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
              {assignedTeam.name}
            </span>
          </div>
        ) : isSelectable ? (
          <div className="text-center mt-1">
            <span className="text-xs text-amber-400/80 font-bold group-hover:text-amber-300 transition-colors">
              BẤM ĐỂ CHỌN
            </span>
          </div>
        ) : (
          <div className="text-center mt-1">
            <span className="text-xs text-slate-500 font-medium">Bí mật</span>
          </div>
        )}

        {/* Revealed Content (During Reveal Phase) */}
        {showContent && briefcase.isOpened && (
          <div className="absolute inset-0 z-10 bg-slate-950/95 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center p-3 animate-fadeIn">
            <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-1">
              Chiếc cặp #{briefcase.id}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white text-center leading-tight">
              {briefcase.label}
            </span>
            <span className="text-[11px] text-slate-300 text-center mt-1">
              {briefcase.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
