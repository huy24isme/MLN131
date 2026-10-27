import React, { useState } from 'react';
import { Briefcase, Team } from '../types';
import { BriefcaseCard } from './BriefcaseCard';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface PickBriefcasesScreenProps {
  teams: Team[];
  briefcases: Briefcase[];
  onPickBriefcase: (teamId: number, briefcaseId: number) => void;
  onFinishPicking: () => void;
}

export const PickBriefcasesScreen: React.FC<PickBriefcasesScreenProps> = ({
  teams,
  briefcases,
  onPickBriefcase,
  onFinishPicking,
}) => {
  // Find which team needs to pick next
  const teamToPick = teams.find((t) => t.initialBriefcaseId === null);
  const isAllPicked = !teamToPick;

  const handleSelect = (briefcaseId: number) => {
    if (!teamToPick) return;
    sound.playCashDeal();
    onPickBriefcase(teamToPick.id, briefcaseId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Turn Banner */}
      <div className="text-center mb-8 w-full max-w-3xl">
        {!isAllPicked && teamToPick ? (
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-2xl backdrop-blur-md animate-gold-glow">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
              Vòng 1: Chọn Chiếc Cặp May Mắn
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center justify-center gap-3">
              Mời
              <span
                className={`px-4 py-1 rounded-2xl bg-gradient-to-r ${teamToPick.color} text-white shadow-lg`}
              >
                {teamToPick.name}
              </span>
              chọn 1 chiếc cặp!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Hãy chọn 1 số bất kỳ. Chiếc cặp này sẽ được niêm phong và chỉ mở vào cuối trò chơi!
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500/60 shadow-2xl backdrop-blur-md text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hoàn tất chọn cặp
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              TẤT CẢ CÁC ĐỘI ĐÃ CÓ CẶP BÍ MẬT!
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
              {8 - teams.length} chiếc cặp còn lại sẽ được đưa vào kho niêm phong. Giờ là lúc tranh tài kiến thức qua 20 câu hỏi!
            </p>
            <div className="mt-5">
              <button
                onClick={() => {
                  sound.playCorrect();
                  onFinishPicking();
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
              >
                BẮT ĐẦU VÒNG 20 CÂU HỎI
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8 Briefcases Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {briefcases.map((briefcase) => {
          const isChosen = briefcase.chosenByTeamId !== null;
          const isSelectable = !isAllPicked && !isChosen;

          return (
            <BriefcaseCard
              key={briefcase.id}
              briefcase={briefcase}
              teams={teams}
              isSelectable={isSelectable}
              onSelect={() => handleSelect(briefcase.id)}
            />
          );
        })}
      </div>

      {/* Bottom Summary of Teams & Their Selected Briefcase */}
      <div className="w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 text-center sm:text-left">
          Danh sách cặp đã chọn:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                team.initialBriefcaseId
                  ? 'bg-slate-800/80 border-amber-500/40'
                  : 'bg-slate-900/50 border-slate-800 border-dashed opacity-60'
              }`}
            >
              <span className="text-xs font-bold text-slate-300 truncate w-full">
                {team.name}
              </span>
              <span className="text-base sm:text-lg font-black text-amber-400 mt-1">
                {team.initialBriefcaseId
                  ? `Cặp #${team.initialBriefcaseId}`
                  : 'Chưa chọn'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
