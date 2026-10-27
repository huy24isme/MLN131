import React from 'react';
import { Volume2, VolumeX, Maximize2, RotateCcw, HelpCircle, Briefcase } from 'lucide-react';
import { GamePhase } from '../types';

interface NavbarProps {
  currentPhase: GamePhase;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onOpenRules: () => void;
}

const PHASE_TITLES: Record<GamePhase, string> = {
  SETUP: 'Khởi Tạo Trận Đấu',
  PICK_BRIEFCASES: 'Vòng 1: Chọn Chiếc Cặp Bí Ẩn',
  QUIZ_BOARD: 'Vòng 2: Trả Lời 20 Câu Hỏi',
  DEAL_OR_NO_DEAL: 'Vòng 3: Thương Lượng & Mua Bán Cặp',
  REVEAL_BRIEFCASES: 'Vòng 4: Mở Cặp & Kích Hoạt Hiệu Ứng',
  VICTORY: 'Chung Cuộc: Vinh Danh Nhà Vô Địch 🏆',
};

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  isMuted,
  onToggleMute,
  onResetGame,
  onOpenRules,
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 sm:px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Briefcase className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              CHIẾC CẶP NGUYỆN VỌNG
              <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Lớp Học
              </span>
            </h1>
            <p className="text-xs text-amber-400 font-medium">
              {PHASE_TITLES[currentPhase]}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenRules}
            title="Luật chơi"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Luật chơi</span>
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </button>

          <button
            onClick={toggleFullScreen}
            title="Toàn màn hình máy chiếu"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          </button>

          <button
            onClick={onResetGame}
            title="Chơi lại từ đầu"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/60 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
