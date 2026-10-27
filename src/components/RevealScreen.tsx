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
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center relative z-10">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest font-['Cinzel',serif] text-amber-300 font-bold">
          KHOẢNH KHẮC ĐỊNH MỆNH
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-amber-400 font-['Cinzel',serif] mt-1 drop-shadow-md">
          MỞ RƯƠNG SỨ MỆNH
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1 max-w-xl mx-auto">
          Lần lượt khám phá bí mật bên trong rương của từng đội để định đoạt thứ hạng chung cuộc!
        </p>
      </div>

      {/* Grid of Team Chests */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {teams.map((team) => {
          const briefcase = briefcases.find((b) => b.id === team.initialBriefcaseId);
          if (!briefcase) return null;
          const isOpened = revealedBriefcaseIds.includes(briefcase.id);

          return (
            <div
              key={team.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-2xl backdrop-blur-md ${
                team.hasSoldBriefcase
                  ? 'bg-black/50 border-stone-700'
                  : isOpened
                  ? 'bg-black/70 border-amber-400 shadow-amber-500/20'
                  : 'bg-black/60 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black text-white bg-gradient-to-r ${team.color} shadow`}
                  >
                    {team.name}
                  </span>
                  <span className="text-xs font-['Cinzel',serif] font-bold text-amber-300">
                    RƯƠNG SỐ {briefcase.id}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 mb-4 flex items-center justify-between">
                  <span className="text-xs text-amber-200/70 font-semibold">
                    {team.hasSoldBriefcase ? 'Điểm đã bán (+BTC):' : 'Điểm hiện tại:'}
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-['Cinzel',serif]">
                    {team.score}đ
                  </span>
                </div>

                {isOpened ? (
                  <div
                    className={`p-4 rounded-2xl border text-center animate-fadeIn ${
                      team.hasSoldBriefcase
                        ? 'bg-black/50 border-stone-600 text-stone-300'
                        : briefcase.effect === '+10' || briefcase.effect === 'x2'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : briefcase.effect === 'zero' || briefcase.effect === '-10'
                        ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                        : 'bg-amber-950/80 border-amber-400 text-amber-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                      {team.hasSoldBriefcase
                        ? 'Bên trong rương đã bán là:'
                        : 'Hiệu ứng kích hoạt:'}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-['Cinzel',serif] block mt-1">
                      {briefcase.label}
                    </span>
                    <span className="text-xs block mt-1 opacity-90">
                      {briefcase.description}
                    </span>
                    {team.effectApplied && (
                      <span className="inline-block mt-2 text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-black/50 text-amber-300">
                        {team.effectApplied}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-black/40 border border-dashed border-amber-500/30 text-center flex flex-col items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-amber-200/80">
                      {team.hasSoldBriefcase
                        ? 'Đội đã bán rương cho BTC'
                        : 'Rương đang được niêm phong'}
                    </span>
                    <span className="text-[11px] text-amber-200/50 mt-1">
                      Bấm nút bên dưới để giải phong ấn
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                {!isOpened ? (
                  <button
                    onClick={() => handleOpenBriefcase(team)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg transition transform hover:scale-102 cursor-pointer font-['Cinzel',serif]"
                  >
                    MỞ RƯƠNG SỐ {briefcase.id}
                  </button>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-black/40 text-stone-400 font-bold text-xs text-center border border-stone-700 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Đã hoàn tất mở rương
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unpicked Leftovers */}
      {isAllTeamBriefcasesOpened && (
        <div className="w-full max-w-4xl p-5 rounded-3xl bg-black/40 border border-amber-500/20 mb-6 text-center animate-fadeIn">
          <h4 className="text-xs font-['Cinzel',serif] font-bold uppercase tracking-wider text-amber-300/80 mb-2">
            Kho niêm phong: {leftoverBriefcases.length} rương không ai chọn
          </h4>
          {!revealedLeftovers ? (
            <button
              onClick={() => {
                sound.playCorrect();
                setRevealedLeftovers(true);
              }}
              className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black/70 text-amber-300 font-bold text-xs border border-amber-500/30 transition cursor-pointer font-['Cinzel',serif]"
            >
              Xem nội dung các rương còn lại
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn mt-3">
              {leftoverBriefcases.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-center"
                >
                  <span className="text-[11px] text-amber-200/60 font-bold block font-['Cinzel',serif]">
                    RƯƠNG SỐ {b.id}
                  </span>
                  <span className="text-xs font-black text-amber-300 block font-['Cinzel',serif]">
                    {b.label}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
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
            onClick={() => {
              sound.playVictory();
              onFinishReveal();
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-2xl transition transform hover:scale-105 cursor-pointer font-['Cinzel',serif]"
          >
            <Trophy className="w-5 h-5 fill-slate-950" />
            CÔNG BỐ KẾT QUẢ CHUNG CUỘC 🏆
          </button>
        </div>
      )}

      {/* SWAP MODAL */}
      {swappingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#300505] border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-amber-300 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-amber-300 font-['Cinzel',serif]">
              RƯƠNG ĐỔI ĐIỂM ĐÃ MỞ!
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-2">
              <span className="font-bold text-white">{swappingTeam.name}</span> (đang có {swappingTeam.score}đ) được quyền đổi toàn bộ điểm với 1 đội bất kỳ!
            </p>

            <div className="mt-4 space-y-2">
              {teams
                .filter((t) => t.id !== swappingTeam.id)
                .map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleConfirmSwap(target.id)}
                    className="w-full p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-amber-500/30 hover:border-amber-400 transition flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${target.color}`}
                    >
                      {target.name}
                    </span>
                    <span className="text-base font-black text-amber-400 font-['Cinzel',serif] group-hover:scale-110 transition">
                      {target.score}đ
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
