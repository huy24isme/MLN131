import React from 'react';
import { Briefcase, Team } from '../types';
import { ChestCard } from './ChestCard';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center relative z-10">
      {/* Turn Banner */}
      <div className="text-center mb-6 w-full max-w-2xl">
        {!isAllPicked && teamToPick ? (
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/40 backdrop-blur-md shadow-xl animate-gold-shine">
            <span className="text-xs uppercase tracking-widest font-['Cinzel',serif] text-amber-300 font-bold">
              RƯƠNG SỨ MỆNH
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1 flex items-center justify-center gap-2">
              Mời
              <span
                className={`px-3 py-0.5 rounded-xl bg-gradient-to-r ${teamToPick.color} text-white shadow`}
              >
                {teamToPick.name}
              </span>
              chọn 1 Rương!
            </h2>
            <p className="text-xs text-amber-200/70 mt-1">
              Rương sứ mệnh sẽ được phong ấn và chỉ mở khi kết thúc toàn bộ thử thách!
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 shadow-xl backdrop-blur-md text-center animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tất cả các đội đã chọn rương
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif]">
              SẴN SÀNG BƯỚC VÀO THỬ THÁCH!
            </h2>
            <div className="mt-3">
              <button
                onClick={() => {
                  sound.playCorrect();
                  onFinishPicking();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer font-['Cinzel',serif]"
              >
                TIẾN VÀO VÒNG THỬ THÁCH
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8 Chests Arranged Exactly like Figma: 2 rows of 4 chests */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 justify-items-center my-4">
        {briefcases.map((briefcase) => {
          const isChosen = briefcase.chosenByTeamId !== null;
          const isSelectable = !isAllPicked && !isChosen;

          return (
            <ChestCard
              key={briefcase.id}
              briefcase={briefcase}
              teams={teams}
              isSelectable={isSelectable}
              onSelect={() => handleSelect(briefcase.id)}
            />
          );
        })}
      </div>

      {/* Bottom Teams Status Bar */}
      <div className="w-full max-w-4xl mt-6 p-4 rounded-2xl bg-black/40 border border-amber-500/20 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`p-2.5 rounded-xl border text-center transition ${
                team.initialBriefcaseId
                  ? 'bg-amber-950/40 border-amber-500/40'
                  : 'bg-black/30 border-amber-500/10 opacity-60'
              }`}
            >
              <span className="text-xs font-bold text-amber-200 truncate block">
                {team.name}
              </span>
              <span className="text-sm font-black text-amber-400 font-['Cinzel',serif] block mt-0.5">
                {team.initialBriefcaseId
                  ? `Rương #${team.initialBriefcaseId}`
                  : 'Chưa chọn'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
