import React from 'react';
import { Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';
import { GamePhase } from '../types';

interface NavbarProps {
  currentPhase: GamePhase;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onOpenRules: () => void;
  onNavigatePhase?: (phase: GamePhase) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  isMuted,
  onToggleMute,
  onResetGame,
  onOpenRules,
  onNavigatePhase,
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isChestPhase = currentPhase === 'PICK_BRIEFCASES' || currentPhase === 'REVEAL_BRIEFCASES';
  const isQuizPhase = currentPhase === 'QUIZ_BOARD';
  const isDealPhase = currentPhase === 'DEAL_OR_NO_DEAL';

  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-8 border-b border-amber-500/20 bg-[#300505]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand "DÒNG CHẢY SỬ VIỆT" */}
        <div className="flex items-center gap-3">
          <div className="text-left select-none">
            <h1 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black tracking-wider text-amber-200 drop-shadow-md">
              DÒNG CHẢY
            </h1>
            <h1 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-black tracking-widest text-amber-400 -mt-1 drop-shadow-md">
              SỬ VIỆT
            </h1>
          </div>
        </div>

        {/* Center: Tabs matching Figma: (?) RƯƠNG SỨ MỆNH | THỬ THÁCH | ĐẤU GIÁ */}
        <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-['Cinzel',serif] font-black tracking-widest">
          {/* (?) Rule button */}
          <button
            onClick={onOpenRules}
            title="Xem luật chơi"
            className="w-8 h-8 rounded-full border-2 border-amber-400/80 bg-amber-500/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center font-bold text-base transition-all shadow-md cursor-pointer"
          >
            ?
          </button>

          {/* RƯƠNG SỨ MỆNH */}
          <button
            onClick={() => onNavigatePhase?.('PICK_BRIEFCASES')}
            className={`transition-all uppercase cursor-pointer ${
              isChestPhase
                ? 'text-amber-300 border-b-2 border-amber-400 pb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                : 'text-amber-200/60 hover:text-amber-300'
            }`}
          >
            RƯƠNG SỨ MỆNH
          </button>

          {/* THỬ THÁCH */}
          <button
            onClick={() => onNavigatePhase?.('QUIZ_BOARD')}
            className={`transition-all uppercase cursor-pointer ${
              isQuizPhase
                ? 'text-amber-300 border-b-2 border-amber-400 pb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                : 'text-amber-200/60 hover:text-amber-300'
            }`}
          >
            THỬ THÁCH
          </button>

          {/* ĐẤU GIÁ */}
          <button
            onClick={() => onNavigatePhase?.('DEAL_OR_NO_DEAL')}
            className={`transition-all uppercase cursor-pointer ${
              isDealPhase
                ? 'text-amber-300 border-b-2 border-amber-400 pb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                : 'text-amber-200/60 hover:text-amber-300'
            }`}
          >
            ĐẤU GIÁ
          </button>
        </div>

        {/* Right: Controls (Audio, Fullscreen, Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-xl bg-black/40 hover:bg-amber-950/60 text-amber-300 border border-amber-500/30 transition cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={toggleFullScreen}
            title="Toàn màn hình máy chiếu"
            className="p-2 rounded-xl bg-black/40 hover:bg-amber-950/60 text-amber-300 border border-amber-500/30 transition cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onResetGame}
            title="Chơi lại từ đầu"
            className="p-2 rounded-xl bg-black/40 hover:bg-rose-950/60 text-rose-400 border border-rose-500/30 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
