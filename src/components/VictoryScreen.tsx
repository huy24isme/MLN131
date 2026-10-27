import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Medal, RotateCcw, Sparkles, Award } from 'lucide-react';
import { Team, Briefcase } from '../types';
import { sound } from '../utils/audio';

interface VictoryScreenProps {
  teams: Team[];
  briefcases: Briefcase[];
  onPlayAgain: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  teams,
  briefcases,
  onPlayAgain,
}) => {
  // Sort teams descending by final score
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);
  const champion = rankedTeams[0];

  useEffect(() => {
    sound.playVictory();

    // Confetti cannon blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Champion Podium Hero */}
      <div className="w-full text-center mb-10 animate-float">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-extrabold mb-4 shadow-lg shadow-amber-500/10">
          <Sparkles className="w-5 h-5 text-amber-400" />
          KẾT QUẢ CHUNG CUỘC
        </div>

        {/* Big Trophy */}
        <div className="relative inline-block my-2">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl shadow-amber-500/50 flex items-center justify-center animate-gold-glow">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-slate-950 fill-slate-950" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 tracking-tight mt-3">
          CHÚC MỪNG NHÀ VÔ ĐỊCH!
        </h1>

        {champion && (
          <div className="mt-4 flex flex-col items-center justify-center">
            <span
              className={`px-8 py-3 rounded-2xl text-2xl sm:text-3xl font-black text-white bg-gradient-to-r ${champion.color} shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition`}
            >
              {champion.name}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 mt-3 drop-shadow">
              {champion.score} ĐIỂM 🏆
            </span>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8">
        <h3 className="text-base sm:text-lg font-black text-slate-200 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> BẢNG XẾP HẠNG TẤT CẢ CÁC ĐỘI
        </h3>

        <div className="space-y-3">
          {rankedTeams.map((team, rank) => {
            const briefcase = briefcases.find(
              (b) => b.id === team.initialBriefcaseId
            );

            return (
              <div
                key={team.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition ${
                  rank === 0
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10'
                    : rank === 1
                    ? 'bg-slate-800/80 border-slate-600'
                    : rank === 2
                    ? 'bg-slate-850/60 border-amber-900/40'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                {/* Left: Rank & Team */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-black text-base border border-slate-700">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                  </div>
                  <div>
                    <span
                      className={`text-sm sm:text-base font-black px-3 py-1 rounded-xl text-white bg-gradient-to-r ${team.color}`}
                    >
                      {team.name}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      {briefcase
                        ? `Cặp #${briefcase.id} (${briefcase.label})`
                        : 'Không có cặp'}
                      {team.hasSoldBriefcase && ' • Đã bán cho BTC'}
                    </span>
                  </div>
                </div>

                {/* Right: Final Score */}
                <div className="text-right">
                  <span className="text-xs uppercase text-slate-400 font-bold block">
                    Tổng điểm
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {team.score} điểm
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          CHƠI VÁN MỚI
        </button>
      </div>
    </div>
  );
};
