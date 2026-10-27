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
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10 select-none font-['VT323',monospace]">
      {/* Title Banner matching Canva "CÙNG CHƠI CỜ NÀO" in VT323 */}
      <div className="text-center mb-6 w-full max-w-2xl">
        {!isAllPicked && teamToPick ? (
          <div className="p-4 pixel-box">
            <span className="text-lg sm:text-xl text-yellow-300 tracking-wider block uppercase drop-shadow-[1px_1px_0px_#000]">
              STAGE 1: CHỌN RƯƠNG SỨ MỆNH
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white pixel-text-shadow flex items-center justify-center gap-3 flex-wrap mt-1">
              MỜI
              <span
                className={`px-3 py-1 bg-gradient-to-r ${teamToPick.color} text-white border-2 border-black shadow-[2px_2px_0px_#000] text-2xl sm:text-4xl`}
              >
                {teamToPick.name}
              </span>
              CHỌN RƯƠNG!
            </h2>
            <p className="text-xl sm:text-2xl text-yellow-200 mt-2">
              Bấm chọn 1 rương bí mật. Rương sẽ được khóa kín cho đến cuối trò chơi!
            </p>
          </div>
        ) : (
          <div className="p-4 pixel-box bg-[#15803d]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-yellow-300 text-sm mb-2 border border-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> TẤT CẢ ĐÃ CHỌN XONG!
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white pixel-text-shadow mb-3">
              READY FOR CHALLENGE!
            </h2>
            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playCorrect();
                  onFinishPicking();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xl pixel-btn-blue font-black cursor-pointer"
              >
                BẮT ĐẦU 20 CÂU HỎI
                <ArrowRight className="w-5 h-5" />
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

      {/* Teams Status Panel */}
      <div className="w-full max-w-4xl mt-6 p-4 pixel-box">
        <span className="text-base sm:text-lg uppercase text-yellow-300 block mb-2 text-center sm:text-left drop-shadow-[1px_1px_0px_#000]">
          DANH SÁCH RƯƠNG ĐÃ CHỌN:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`p-2 border-2 border-black text-center transition-all ${
                team.initialBriefcaseId
                  ? 'bg-[#1e0505] shadow-[2px_2px_0px_#000]'
                  : 'bg-[#5e1210] opacity-60'
              }`}
            >
              <span className="text-lg font-bold text-white truncate block">
                {team.name}
              </span>
              <span className="text-base text-yellow-300 block">
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
