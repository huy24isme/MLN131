import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award } from 'lucide-react';
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
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);
  const champion = rankedTeams[0];

  useEffect(() => {
    sound.playVictory();

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
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center relative z-10">
      {/* Champion Podium */}
      <div className="w-full text-center mb-8">
        <div className="relative inline-block my-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl flex items-center justify-center animate-gold-shine">
            <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-stone-950 fill-stone-950" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-amber-200 font-['Cinzel',serif] tracking-widest mt-2">
          VINH DANH NHÀ VÔ ĐỊCH
        </h2>
        <h1 className="text-3xl sm:text-5xl font-black text-amber-400 font-['Cinzel',serif] tracking-wider mt-1 drop-shadow-md">
          DÒNG CHẢY SỬ VIỆT 🏆
        </h1>

        {champion && (
          <div className="mt-4 flex flex-col items-center justify-center">
            <span
              className={`px-8 py-2.5 rounded-2xl text-2xl sm:text-3xl font-black text-white bg-gradient-to-r ${champion.color} shadow-2xl transform hover:scale-105 transition`}
            >
              {champion.name}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-300 font-['Cinzel',serif] mt-2 drop-shadow">
              {champion.score} ĐIỂM
            </span>
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="w-full bg-black/60 border border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md mb-8">
        <h3 className="text-base sm:text-lg font-black text-amber-200 font-['Cinzel',serif] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> BẢNG TỔNG KẾT THỨ HẠNG
        </h3>

        <div className="space-y-3">
          {rankedTeams.map((team, rank) => {
            const briefcase = briefcases.find(
              (b) => b.id === team.initialBriefcaseId
            );

            return (
              <div
                key={team.id}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition ${
                  rank === 0
                    ? 'bg-amber-950/60 border-amber-400 shadow-lg'
                    : rank === 1
                    ? 'bg-black/50 border-amber-500/50'
                    : 'bg-black/30 border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/80 flex items-center justify-center font-black text-base border border-amber-500/30">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                  </div>
                  <div>
                    <span
                      className={`text-sm sm:text-base font-black px-3 py-0.5 rounded-lg text-white bg-gradient-to-r ${team.color}`}
                    >
                      {team.name}
                    </span>
                    <span className="text-xs text-amber-200/60 block mt-0.5">
                      {briefcase
                        ? `Rương #${briefcase.id} (${briefcase.label})`
                        : 'Không có rương'}
                      {team.hasSoldBriefcase && ' • Đã bán cho BTC'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Cinzel',serif]">
                    {team.score}đ
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart */}
      <div>
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-xl transition transform hover:scale-105 cursor-pointer font-['Cinzel',serif]"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          CHƠI VÁN MỚI
        </button>
      </div>
    </div>
  );
};
