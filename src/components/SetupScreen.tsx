import React, { useState } from 'react';
import { Users, Play, Settings2 } from 'lucide-react';
import { Team } from '../types';

interface SetupScreenProps {
  onStartGame: (teams: Team[]) => void;
  onOpenQuestionEditor: () => void;
}

const TEAM_COLOR_PRESETS = [
  { color: 'from-red-600 to-rose-700', defaultName: 'Tổ 1 (Đỏ)' },
  { color: 'from-blue-600 to-sky-700', defaultName: 'Tổ 2 (Xanh Dương)' },
  { color: 'from-amber-500 to-yellow-600', defaultName: 'Tổ 3 (Vàng)' },
  { color: 'from-emerald-600 to-green-700', defaultName: 'Tổ 4 (Xanh Lá)' },
  { color: 'from-purple-600 to-violet-700', defaultName: 'Tổ 5 (Tím)' },
];

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStartGame,
  onOpenQuestionEditor,
}) => {
  const [teamCount, setTeamCount] = useState<number>(5);
  const [teamNames, setTeamNames] = useState<string[]>([
    'Tổ 1',
    'Tổ 2',
    'Tổ 3',
    'Tổ 4',
    'Tổ 5',
  ]);

  const handleTeamNameChange = (index: number, val: string) => {
    const updated = [...teamNames];
    updated[index] = val;
    setTeamNames(updated);
  };

  const handleStart = () => {
    const teams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: i + 1,
      name: teamNames[i]?.trim() || `Đội ${i + 1}`,
      color: TEAM_COLOR_PRESETS[i].color,
      score: 0,
      initialBriefcaseId: null,
      hasSoldBriefcase: false,
      dealOfferPoints: 0,
    }));
    onStartGame(teams);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center relative z-10 select-none">
      {/* Title matching Canva 8-bit text: "CÙNG CHƠI CỜ NÀO" */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl filter drop-shadow-[2px_2px_0px_#000]">💎</span>
          <span className="text-2xl filter drop-shadow-[2px_2px_0px_#000]">💎</span>
          <span className="text-2xl filter drop-shadow-[2px_2px_0px_#000]">💎</span>
        </div>
        <h1 className="font-['Press_Start_2P',monospace] text-2xl sm:text-4xl font-black text-white pixel-text-shadow leading-tight">
          CÙNG CHƠI CỜ NÀO
        </h1>
        <p className="font-['VT323',monospace] text-lg sm:text-xl text-yellow-300 mt-2">
          GAME SHOW LỚP HỌC &bull; 8 RƯƠNG SỨ MỆNH &bull; 20 CÂU HỎI THỬ THÁCH
        </p>
      </div>

      {/* Main Setup Box */}
      <div className="w-full pixel-box p-5 sm:p-6">
        {/* Step 1: Select Team Count */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-['Press_Start_2P',monospace] text-[10px] sm:text-xs text-yellow-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-yellow-300" /> 1. CHỌN SỐ LƯỢNG ĐỘI:
            </label>
            <span className="font-['Press_Start_2P',monospace] text-xs text-white">{teamCount} ĐỘI</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setTeamCount(count)}
                className={`py-2 font-['Press_Start_2P',monospace] text-[10px] sm:text-xs cursor-pointer transition-transform ${
                  teamCount === count
                    ? 'pixel-tile-gold font-bold scale-105'
                    : 'pixel-btn-blue'
                }`}
              >
                {count} ĐỘI
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Team Names Input */}
        <div className="mb-5">
          <label className="block font-['Press_Start_2P',monospace] text-[10px] sm:text-xs text-yellow-300 mb-2">
            2. ĐẶT TÊN CÁC ĐỘI / TỔ:
          </label>
          <div className="space-y-2">
            {Array.from({ length: teamCount }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 p-2 bg-black border-2 border-white/60 shadow-[2px_2px_0px_#000]"
              >
                <div
                  className={`w-7 h-7 bg-gradient-to-br ${TEAM_COLOR_PRESETS[index].color} flex items-center justify-center font-['Press_Start_2P',monospace] text-white text-[10px] border border-white`}
                >
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={teamNames[index] || ''}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Tên Đội ${index + 1}...`}
                  className="flex-1 bg-transparent border-none text-base text-yellow-200 font-bold focus:outline-none font-['VT323',monospace]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-black">
          <button
            type="button"
            onClick={onOpenQuestionEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 pixel-btn-blue font-['Press_Start_2P',monospace] text-[9px] cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            CHỈNH SỬA 20 CÂU HỎI
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 pixel-tile-gold font-['Press_Start_2P',monospace] text-xs font-black cursor-pointer animate-pulse"
          >
            <Play className="w-4 h-4 fill-black" />
            START GAME (CHỌN RƯƠNG)
          </button>
        </div>
      </div>
    </div>
  );
};
