import React, { useState } from 'react';
import { Users, Play, Settings2, Sparkles } from 'lucide-react';
import { Team } from '../types';

interface SetupScreenProps {
  onStartGame: (teams: Team[]) => void;
  onOpenQuestionEditor: () => void;
}

const TEAM_COLOR_PRESETS = [
  { color: 'from-rose-600 to-red-700', defaultName: 'Tổ 1 (Đỏ)' },
  { color: 'from-blue-600 to-sky-700', defaultName: 'Tổ 2 (Xanh Dương)' },
  { color: 'from-amber-600 to-yellow-700', defaultName: 'Tổ 3 (Vàng)' },
  { color: 'from-emerald-600 to-teal-700', defaultName: 'Tổ 4 (Xanh Lá)' },
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
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center relative z-10">
      {/* Hero Title matching Figma */}
      <div className="text-center mb-6 select-none">
        <h2 className="font-['Cinzel',serif] text-2xl sm:text-4xl font-black text-amber-200 tracking-widest drop-shadow-md">
          DÒNG CHẢY
        </h2>
        <h1 className="font-['Cinzel',serif] text-4xl sm:text-6xl font-black text-amber-400 tracking-widest drop-shadow-lg -mt-1">
          SỬ VIỆT
        </h1>
        <p className="text-amber-200/80 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Khám phá 8 Rương Sứ Mệnh &bull; Chinh phục 20 Thử Thách &bull; Đấu giá kịch tính
        </p>
      </div>

      {/* Main Setup Card */}
      <div className="w-full bg-black/60 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Step 1: Select Team Count */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2 font-['Cinzel',serif]">
              <Users className="w-5 h-5 text-amber-400" /> 1. Chọn số lượng đội tham gia:
            </label>
            <span className="text-amber-400 font-extrabold text-lg">{teamCount} Đội</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setTeamCount(count)}
                className={`py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer font-['Cinzel',serif] ${
                  teamCount === count
                    ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-200'
                    : 'bg-black/40 text-amber-200/70 hover:bg-black/60 hover:text-white border border-amber-500/30'
                }`}
              >
                {count} Đội
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Team Names Input */}
        <div className="mb-6">
          <label className="block text-sm sm:text-base font-bold text-amber-200 mb-3 font-['Cinzel',serif]">
            2. Đặt tên các đội / tổ:
          </label>
          <div className="space-y-2.5">
            {Array.from({ length: teamCount }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 border border-amber-500/20"
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${TEAM_COLOR_PRESETS[index].color} flex items-center justify-center font-black text-white text-xs shadow`}
                >
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={teamNames[index] || ''}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Tên Đội ${index + 1}...`}
                  className="flex-1 bg-black/50 border border-amber-500/30 rounded-xl px-4 py-1.5 text-sm sm:text-base text-amber-100 font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
          <button
            type="button"
            onClick={onOpenQuestionEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 hover:bg-amber-950/60 text-amber-300 font-bold border border-amber-500/30 transition cursor-pointer text-xs sm:text-sm font-['Cinzel',serif]"
          >
            <Settings2 className="w-4 h-4" />
            Xem & Chỉnh sửa 20 câu hỏi
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-102 cursor-pointer font-['Cinzel',serif]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            BẮT ĐẦU CHỌN RƯƠNG
          </button>
        </div>
      </div>
    </div>
  );
};
