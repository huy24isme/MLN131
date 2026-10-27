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
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center relative z-10 select-none">
      {/* Champion Podium */}
      <div className="w-full text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl filter drop-shadow-[2px_2px_0px_#000]">💎</span>
          <span className="text-3xl filter drop-shadow-[2px_2px_0px_#000]">🏆</span>
          <span className="text-3xl filter drop-shadow-[2px_2px_0px_#000]">💎</span>
        </div>

        <h2 className="text-xs sm:text-sm font-['Press_Start_2P',monospace] text-yellow-300 uppercase tracking-widest drop-shadow-[1px_1px_0px_#000]">
          GAME CLEAR!
        </h2>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-['Press_Start_2P',monospace] pixel-text-shadow mt-1">
          CHÚC MỪNG NHÀ VÔ ĐỊCH!
        </h1>

        {champion && (
          <div className="mt-4 flex flex-col items-center justify-center">
            <span
              className={`px-8 py-3 text-xl sm:text-2xl font-black text-white bg-gradient-to-r ${champion.color} border-4 border-black shadow-[4px_4px_0px_#000] font-['Press_Start_2P',monospace] transform hover:scale-105 transition-transform`}
            >
              {champion.name}
            </span>
            <span className="text-3xl sm:text-5xl font-black text-yellow-300 font-['VT323',monospace] mt-2 drop-shadow-[3px_3px_0px_#000]">
              {champion.score} ĐIỂM
            </span>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="w-full pixel-box p-5 sm:p-6 mb-6">
        <h3 className="text-xs sm:text-sm font-['Press_Start_2P',monospace] text-yellow-300 mb-3 flex items-center gap-2 drop-shadow-[1px_1px_0px_#000]">
          <Award className="w-4 h-4 text-yellow-300" /> BẢNG XẾP HẠNG TẤT CẢ CÁC ĐỘI
        </h3>

        <div className="space-y-2.5">
          {rankedTeams.map((team, rank) => {
            const briefcase = briefcases.find(
              (b) => b.id === team.initialBriefcaseId
            );

            return (
              <div
                key={team.id}
                className={`p-3 border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[2px_2px_0px_#000] ${
                  rank === 0
                    ? 'bg-yellow-300 text-black font-bold'
                    : rank === 1
                    ? 'bg-[#1e0505] text-white'
                    : 'bg-[#5e1210] text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-['Press_Start_2P',monospace] text-xs border border-white">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-['Press_Start_2P',monospace] px-2 py-0.5 text-white bg-gradient-to-r ${team.color} border border-black`}
                    >
                      {team.name}
                    </span>
                    <span className={`font-['VT323',monospace] text-base block mt-0.5 ${rank === 0 ? 'text-black' : 'text-yellow-200'}`}>
                      {briefcase
                        ? `Rương #${briefcase.id} (${briefcase.label})`
                        : 'Không có rương'}
                      {team.hasSoldBriefcase && ' &bull; Đã bán cho BTC'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-2xl sm:text-3xl font-black font-['VT323',monospace] ${rank === 0 ? 'text-black' : 'text-yellow-300'}`}>
                    {team.score} ĐIỂM
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
          type="button"
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-8 py-3.5 pixel-tile-gold font-['Press_Start_2P',monospace] text-xs sm:text-sm font-black cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          <RotateCcw className="w-4 h-4" />
          CHƠI VÁN MỚI
        </button>
      </div>
    </div>
  );
};
