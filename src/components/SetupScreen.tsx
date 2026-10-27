import React, { useState } from 'react';
import { Users, Play, Settings2, Sparkles, ShieldAlert } from 'lucide-react';
import { Team } from '../types';

interface SetupScreenProps {
  onStartGame: (teams: Team[]) => void;
  onOpenQuestionEditor: () => void;
}

const TEAM_COLOR_PRESETS = [
  { color: 'from-rose-500 to-red-600', badge: 'bg-red-500/20 text-red-300 border-red-500/40', defaultName: 'Tổ 1 (Đỏ)' },
  { color: 'from-blue-500 to-sky-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', defaultName: 'Tổ 2 (Xanh Dương)' },
  { color: 'from-amber-500 to-yellow-600', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', defaultName: 'Tổ 3 (Vàng)' },
  { color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', defaultName: 'Tổ 4 (Xanh Lá)' },
  { color: 'from-purple-500 to-violet-600', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', defaultName: 'Tổ 5 (Tím)' },
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Title */}
      <div className="text-center mb-8 animate-float">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" /> Game Show Hoạt Động Lớp Học
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 tracking-tight drop-shadow-md">
          CHIẾC CẶP NGUYỆN VỌNG
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          20 Câu hỏi thử thách &bull; 8 Chiếc cặp bí ẩn &bull; Thương lượng nghẹt thở &bull; Lật kèo phút chót!
        </p>
      </div>

      {/* Main Setup Card */}
      <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Step 1: Select Team Count */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-base sm:text-lg font-bold text-slate-200 flex items-center gap-2">
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
                className={`py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                  teamCount === count
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-102 ring-2 ring-amber-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {count} Đội
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * Lớp học thường chia từ 2 đến 5 tổ hoặc nhóm thi đấu.
          </p>
        </div>

        {/* Step 2: Team Names Input */}
        <div className="mb-8">
          <label className="block text-base sm:text-lg font-bold text-slate-200 mb-3">
            2. Đặt tên các đội / tổ:
          </label>
          <div className="space-y-3">
            {Array.from({ length: teamCount }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${TEAM_COLOR_PRESETS[index].color} flex items-center justify-center font-black text-white text-sm shadow-md`}
                >
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={teamNames[index] || ''}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Tên Đội ${index + 1}...`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm sm:text-base text-slate-100 font-semibold focus:outline-none focus:border-amber-500/80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onOpenQuestionEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 hover:border-amber-500/50 transition cursor-pointer text-sm"
          >
            <Settings2 className="w-5 h-5" />
            Xem & Chỉnh sửa 20 câu hỏi
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-102 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            BẮT ĐẦU CHỌN CẶP
          </button>
        </div>
      </div>
    </div>
  );
};
