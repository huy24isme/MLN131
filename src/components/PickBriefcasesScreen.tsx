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
  const teamToPick = teams.find((t) => t.initialBriefcaseId === null);
  const isAllPicked = !teamToPick;

  const handleSelect = (briefcaseId: number) => {
    if (!teamToPick) return;
    sound.playCashDeal();
    onPickBriefcase(teamToPick.id, briefcaseId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10 select-none">
      {/* Title Banner matching Canva "CÙNG CHƠI CỜ NÀO" */}
      <div className="text-center mb-6 w-full max-w-2xl">
        {!isAllPicked && teamToPick ? (
          <div className="p-4 pixel-box">
            <span className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 tracking-wider block mb-2 uppercase drop-shadow-[1px_1px_0px_#000]">
              STAGE 1: CHỌN RƯƠNG SỨ MỆNH
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white font-['Press_Start_2P',monospace] pixel-text-shadow flex items-center justify-center gap-2 flex-wrap">
              MỜI
              <span
                className={`px-3 py-1 bg-gradient-to-r ${teamToPick.color} text-white border-2 border-black shadow-[2px_2px_0px_#000] text-sm sm:text-lg`}
              >
                {teamToPick.name}
              </span>
              CHỌN RƯƠNG!
            </h2>
            <p className="font-['VT323',monospace] text-base sm:text-lg text-yellow-200 mt-2">
              Bấm chọn 1 rương bí mật. Rương sẽ được khóa kín cho đến cuối trò chơi!
            </p>
          </div>
        ) : (
          <div className="p-4 pixel-box bg-[#15803d]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-yellow-300 font-['Press_Start_2P',monospace] text-[10px] mb-2 border border-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TẤT CẢ ĐÃ CHỌN XONG!
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-['Press_Start_2P',monospace] pixel-text-shadow mb-3">
              READY FOR CHALLENGE!
            </h2>
            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playCorrect();
                  onFinishPicking();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 font-['Press_Start_2P',monospace] text-xs sm:text-sm pixel-btn-blue font-black cursor-pointer"
              >
                BẮT ĐẦU 20 CÂU HỎI
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8 Chests Grid: 2 rows of 4 chests */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center my-3">
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

      {/* Teams Status Panel (8-Bit Arcade Scoreboard) */}
      <div className="w-full max-w-4xl mt-6 p-4 pixel-box">
        <span className="font-['Press_Start_2P',monospace] text-[10px] uppercase text-yellow-300 block mb-3 text-center sm:text-left drop-shadow-[1px_1px_0px_#000]">
          DANH SÁCH RƯƠNG ĐÃ CHỌN:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`p-2.5 border-2 border-black text-center transition-all ${
                team.initialBriefcaseId
                  ? 'bg-[#1e0505] shadow-[2px_2px_0px_#000]'
                  : 'bg-[#5e1210] opacity-60'
              }`}
            >
              <span className="font-['VT323',monospace] text-base font-bold text-white truncate block">
                {team.name}
              </span>
              <span className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 block mt-1">
                {team.initialBriefcaseId
                  ? `RƯƠNG ${team.initialBriefcaseId}`
                  : 'CHỜ...'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
