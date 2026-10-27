import React, { useState } from 'react';
import { Team, Briefcase, BriefcaseEffectType } from '../types';
import { BriefcaseCard } from './BriefcaseCard';
import { Sparkles, Trophy, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
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
  // Modal state for swapping score
  const [swappingTeam, setSwappingTeam] = useState<Team | null>(null);
  const [revealedBriefcaseIds, setRevealedBriefcaseIds] = useState<number[]>([]);
  const [revealedLeftovers, setRevealedLeftovers] = useState<boolean>(false);

  // Unchosen briefcases
  const leftoverBriefcases = briefcases.filter((b) => b.chosenByTeamId === null);

  const handleOpenBriefcase = (team: Team) => {
    if (!team.initialBriefcaseId) return;
    const briefcase = briefcases.find((b) => b.id === team.initialBriefcaseId);
    if (!briefcase || revealedBriefcaseIds.includes(briefcase.id)) return;

    sound.playSuspense();

    // Mark revealed
    setRevealedBriefcaseIds((prev) => [...prev, briefcase.id]);

    if (team.hasSoldBriefcase) {
      // Team already sold, effect doesn't change their score
      return;
    }

    // If effect is swap, open modal
    if (briefcase.effect === 'swap') {
      setTimeout(() => {
        setSwappingTeam(team);
      }, 500);
      return;
    }

    // Trigger audio & apply effect
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

  // Check if all team briefcases have been revealed
  const isAllTeamBriefcasesOpened = teams.every((team) =>
    team.initialBriefcaseId ? revealedBriefcaseIds.includes(team.initialBriefcaseId) : true
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
          Vòng 4: Cao Trào Game Show
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
          MỞ CẶP & KÍCH HOẠT HIỆU ỨNG
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Bấm vào từng chiếc cặp để lật mở điều bí ẩn và tính điểm chung cuộc!
        </p>
      </div>

      {/* Grid of Team Briefcases */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {teams.map((team) => {
          const briefcase = briefcases.find((b) => b.id === team.initialBriefcaseId);
          if (!briefcase) return null;
          const isOpened = revealedBriefcaseIds.includes(briefcase.id);

          return (
            <div
              key={team.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-2xl backdrop-blur-md ${
                team.hasSoldBriefcase
                  ? 'bg-slate-900/80 border-slate-700'
                  : isOpened
                  ? 'bg-slate-900/90 border-amber-500/80 shadow-amber-500/20'
                  : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              {/* Team Info Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black text-white bg-gradient-to-r ${team.color} shadow`}
                  >
                    {team.name}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Cặp #{briefcase.id}
                  </span>
                </div>

                {/* Score Status */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 mb-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    {team.hasSoldBriefcase ? 'Điểm đã bán (+BTC):' : 'Điểm hiện tại:'}
                  </span>
                  <span className="text-2xl font-black text-amber-400">
                    {team.score} điểm
                  </span>
                </div>

                {/* Briefcase Display / Reveal Result */}
                {isOpened ? (
                  <div
                    className={`p-4 rounded-2xl border text-center animate-fadeIn ${
                      team.hasSoldBriefcase
                        ? 'bg-slate-800/80 border-slate-600 text-slate-300'
                        : briefcase.effect === '+10' || briefcase.effect === 'x2'
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 animate-gold-glow'
                        : briefcase.effect === 'zero' || briefcase.effect === '-10'
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                        : 'bg-indigo-950/70 border-indigo-500 text-indigo-300'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                      {team.hasSoldBriefcase
                        ? 'Bên trong chiếc cặp đã bán là:'
                        : 'Hiệu ứng kích hoạt:'}
                    </span>
                    <span className="text-2xl font-black block mt-1">
                      {briefcase.label}
                    </span>
                    <span className="text-xs block mt-1 opacity-90">
                      {briefcase.description}
                    </span>
                    {team.effectApplied && (
                      <span className="inline-block mt-2 text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-black/40 text-amber-300">
                        {team.effectApplied}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-700 text-center flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-slate-400">
                      {team.hasSoldBriefcase
                        ? 'Đội đã bán cặp cho BTC'
                        : 'Chiếc cặp đang niêm phong'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Bấm nút bên dưới để mở nắp
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5">
                {!isOpened ? (
                  <button
                    onClick={() => handleOpenBriefcase(team)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition transform hover:scale-102 cursor-pointer"
                  >
                    MỞ CẶP #{briefcase.id} NGAY
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-400 font-bold text-xs text-center border border-slate-700 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Đã hoàn tất mở cặp
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unpicked leftover briefcases reveal */}
      {isAllTeamBriefcasesOpened && (
        <div className="w-full max-w-4xl p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-8 text-center animate-fadeIn">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Kho niêm phong: {leftoverBriefcases.length} chiếc cặp không ai chọn
          </h4>
          {!revealedLeftovers ? (
            <button
              onClick={() => {
                sound.playCorrect();
                setRevealedLeftovers(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              Xem nội dung các cặp còn lại trong kho
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
              {leftoverBriefcases.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    Cặp #{b.id}
                  </span>
                  <span className="text-sm font-black text-amber-300 block mt-0.5">
                    {b.label}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {b.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Finalize Game Button */}
      {isAllTeamBriefcasesOpened && (
        <div className="text-center animate-bounce">
          <button
            onClick={() => {
              sound.playVictory();
              onFinishReveal();
            }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-lg shadow-2xl shadow-amber-500/40 transition transform hover:scale-105 cursor-pointer"
          >
            <Trophy className="w-6 h-6 fill-slate-950" />
            CÔNG BỐ KẾT QUẢ & TRAO GIẢI CHUNG CUỘC 🏆
          </button>
        </div>
      )}

      {/* SWAP MODAL */}
      {swappingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-white">
              CẶP ĐỔI ĐIỂM ĐÃ KÍCH HOẠT!
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              <span className="font-bold text-amber-300">{swappingTeam.name}</span>{' '}
              (đang có {swappingTeam.score} điểm) được quyền đổi toàn bộ điểm với 1 đội bất kỳ!
            </p>

            <div className="mt-6 space-y-3">
              {teams
                .filter((t) => t.id !== swappingTeam.id)
                .map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleConfirmSwap(target.id)}
                    className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-indigo-950/80 border border-slate-700 hover:border-indigo-400 transition flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${target.color}`}
                    >
                      {target.name}
                    </span>
                    <span className="text-base font-black text-amber-400 group-hover:scale-110 transition">
                      {target.score} điểm
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
