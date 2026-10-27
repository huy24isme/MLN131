import React, { useState } from 'react';
import { Team, Briefcase, BriefcaseEffectType } from '../types';
import { Trophy, RefreshCw, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface RevealScreenProps {
  teams: Team[];
  briefcases: Briefcase[];
  onApplyBriefcaseEffect: (
    teamId: number,
    effect: BriefcaseEffectType,
    swapWithTeamId?: number
  ) => void;
  onFinishReveal: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  teams,
  briefcases,
  onApplyBriefcaseEffect,
  onFinishReveal,
}) => {
  const [swappingTeam, setSwappingTeam] = useState<Team | null>(null);
  const [revealedBriefcaseIds, setRevealedBriefcaseIds] = useState<number[]>([]);
  const [revealedLeftovers, setRevealedLeftovers] = useState<boolean>(false);

  const leftoverBriefcases = briefcases.filter((b) => b.chosenByTeamId === null);

  const handleOpenBriefcase = (team: Team) => {
    if (!team.initialBriefcaseId) return;
    const briefcase = briefcases.find((b) => b.id === team.initialBriefcaseId);
    if (!briefcase || revealedBriefcaseIds.includes(briefcase.id)) return;

    sound.playSuspense();
    setRevealedBriefcaseIds((prev) => [...prev, briefcase.id]);

    if (team.hasSoldBriefcase) return;

    if (briefcase.effect === 'swap') {
      setTimeout(() => {
        setSwappingTeam(team);
      }, 500);
      return;
    }

    setTimeout(() => {
      if (briefcase.effect === '+10' || briefcase.effect === 'x2') {
        sound.playJackpot();
      } else if (briefcase.effect === 'zero' || briefcase.effect === '-10') {
        sound.playWrong();
      } else {
        sound.playCorrect();
      }
      onApplyBriefcaseEffect(team.id, briefcase.effect);
    }, 400);
  };

  const handleConfirmSwap = (targetTeamId: number) => {
    if (!swappingTeam) return;
    sound.playCorrect();
    onApplyBriefcaseEffect(swappingTeam.id, 'swap', targetTeamId);
    setSwappingTeam(null);
  };

  const isAllTeamBriefcasesOpened = teams.every((team) =>
    team.initialBriefcaseId ? revealedBriefcaseIds.includes(team.initialBriefcaseId) : true
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10 select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <span className="font-['VT323',monospace] text-lg text-yellow-300 block mb-1 uppercase drop-shadow-[1px_1px_0px_#000] tracking-wide">
          STAGE 4: OPEN THE TREASURES
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-['VT323',monospace] pixel-text-shadow tracking-wider">
          MỞ RƯƠNG SỨ MỆNH
        </h2>
        <p className="font-['VT323',monospace] text-xl text-yellow-200 mt-1 max-w-lg mx-auto">
          Lần lượt mở khóa các rương để kích hoạt hiệu ứng bí ẩn và tính điểm chung cuộc!
        </p>
      </div>

      {/* Grid of Team Chests */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {teams.map((team) => {
          const briefcase = briefcases.find((b) => b.id === team.initialBriefcaseId);
          if (!briefcase) return null;
          const isOpened = revealedBriefcaseIds.includes(briefcase.id);

          return (
            <div
              key={team.id}
              className={`p-4 pixel-box flex flex-col justify-between ${
                team.hasSoldBriefcase
                  ? 'bg-[#5e1210]'
                  : isOpened
                  ? 'bg-[#15803d]'
                  : 'bg-[#991f1c]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-3 py-0.5 text-lg font-['VT323',monospace] font-bold text-white bg-gradient-to-r ${team.color} border border-black shadow-[1px_1px_0px_#000]`}
                  >
                    {team.name}
                  </span>
                  <span className="font-['VT323',monospace] text-lg text-yellow-300 font-bold">
                    RƯƠNG #{briefcase.id}
                  </span>
                </div>

                <div className="p-2.5 bg-black border-2 border-white/60 mb-3 flex items-center justify-between">
                  <span className="font-['VT323',monospace] text-base text-yellow-200">
                    {team.hasSoldBriefcase ? 'ĐIỂM ĐÃ BÁN (+BTC):' : 'ĐIỂM HIỆN TẠI:'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-['VT323',monospace]">
                    {team.score} ĐIỂM
                  </span>
                </div>

                {isOpened ? (
                  <div
                    className={`p-3 border-2 border-black text-center ${
                      team.hasSoldBriefcase
                        ? 'bg-[#1e0505] text-stone-300'
                        : briefcase.effect === '+10' || briefcase.effect === 'x2'
                        ? 'bg-yellow-300 text-black font-black'
                        : briefcase.effect === 'zero' || briefcase.effect === '-10'
                        ? 'bg-rose-700 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <span className="font-['VT323',monospace] text-base uppercase block mb-1">
                      {team.hasSoldBriefcase
                        ? 'TRONG RƯƠNG ĐÃ BÁN LÀ:'
                        : 'HIỆU ỨNG KÍCH HOẠT:'}
                    </span>
                    <span className="font-['VT323',monospace] text-2xl font-black block">
                      {briefcase.label}
                    </span>
                    <span className="font-['VT323',monospace] text-lg block mt-1">
                      {briefcase.description}
                    </span>
                    {team.effectApplied && (
                      <span className="inline-block mt-1 font-['VT323',monospace] text-sm px-2 py-0.5 bg-black text-yellow-300 border border-white font-bold">
                        {team.effectApplied}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-black/60 border-2 border-dashed border-white/50 text-center flex flex-col items-center justify-center">
                    <span className="font-['VT323',monospace] text-lg text-white font-bold">
                      {team.hasSoldBriefcase
                        ? 'ĐỘI ĐÃ BÁN CHO BTC'
                        : 'RƯƠNG ĐANG KHÓA KÍN'}
                    </span>
                    <span className="font-['VT323',monospace] text-lg text-yellow-200 mt-1">
                      Bấm nút bên dưới để mở
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                {!isOpened ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBriefcase(team)}
                    className="w-full py-2.5 font-['VT323',monospace] text-xl pixel-btn-blue font-bold cursor-pointer"
                  >
                    MỞ RƯƠNG #{briefcase.id}
                  </button>
                ) : (
                  <div className="w-full py-2 bg-black border border-white text-yellow-300 font-['VT323',monospace] text-lg text-center flex items-center justify-center gap-1.5 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> ĐÃ MỞ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unpicked Leftovers */}
      {isAllTeamBriefcasesOpened && (
        <div className="w-full max-w-4xl p-4 pixel-box mb-6 text-center">
          <h4 className="font-['VT323',monospace] text-xl text-yellow-300 uppercase mb-2 drop-shadow-[1px_1px_0px_#000] tracking-wide">
            KHO NIÊM PHONG: {leftoverBriefcases.length} RƯƠNG CÒN LẠI
          </h4>
          {!revealedLeftovers ? (
            <button
              type="button"
              onClick={() => {
                sound.playCorrect();
                setRevealedLeftovers(true);
              }}
              className="px-5 py-2 font-['VT323',monospace] text-lg pixel-btn-blue cursor-pointer"
            >
              XEM NỘI DUNG CÁC RƯƠNG TRONG KHO
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
              {leftoverBriefcases.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 bg-black border-2 border-white text-center"
                >
                  <span className="font-['VT323',monospace] text-lg text-yellow-300 block font-bold">
                    RƯƠNG #{b.id}
                  </span>
                  <span className="font-['VT323',monospace] text-xl text-white block mt-1 font-bold">
                    {b.label}
                  </span>
                  <span className="font-['VT323',monospace] text-base text-stone-300 block">
                    {b.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Advance to Final Result */}
      {isAllTeamBriefcasesOpened && (
        <div className="text-center animate-bounce">
          <button
            type="button"
            onClick={() => {
              sound.playVictory();
              onFinishReveal();
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 font-['VT323',monospace] text-2xl pixel-tile-gold font-black cursor-pointer shadow-[4px_4px_0px_#000]"
          >
            <Trophy className="w-6 h-6 fill-black" />
            XEM BẢNG VINH DANH CHUNG CUỘC 🏆
          </button>
        </div>
      )}

      {/* SWAP MODAL */}
      {swappingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg pixel-box p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-yellow-300 border-2 border-black flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-black animate-spin" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-yellow-300 font-['VT323',monospace] pixel-text-shadow tracking-wide">
              RƯƠNG ĐỔI ĐIỂM!
            </h3>
            <p className="font-['VT323',monospace] text-xl text-yellow-100 mt-2">
              <span className="font-bold text-white">{swappingTeam.name}</span> ({swappingTeam.score}đ) được quyền đổi toàn bộ điểm với 1 đội bất kỳ!
            </p>

            <div className="mt-4 space-y-2">
              {teams
                .filter((t) => t.id !== swappingTeam.id)
                .map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleConfirmSwap(target.id)}
                    className="w-full p-2.5 bg-black hover:bg-yellow-300 hover:text-black border-2 border-white flex items-center justify-between text-left cursor-pointer transition-colors group"
                  >
                    <span
                      className={`px-3 py-0.5 text-base font-['VT323',monospace] font-bold text-white bg-gradient-to-r ${target.color} border border-black`}
                    >
                      {target.name}
                    </span>
                    <span className="font-['VT323',monospace] text-2xl font-black text-yellow-300 group-hover:text-black">
                      {target.score} ĐIỂM
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
