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
    <header className="sticky top-0 z-40 px-4 py-3 border-b-4 border-yellow-400 bg-[#12131a] shadow-xl select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Retro stats with high contrast on dark background */}
        <div className="flex items-center gap-3">
          <div className="text-left font-['VT323',monospace] leading-tight tracking-wider">
            <div className="text-xs sm:text-sm text-yellow-400 font-bold uppercase drop-shadow-[1px_1px_0px_#000]">
              👾 DÒNG CHẢY SỬ VIỆT
            </div>
            <div className="text-lg sm:text-xl text-white font-bold drop-shadow-[1px_1px_0px_#000]">
              ĐIỂM CAO: 9999
            </div>
          </div>
        </div>

        {/* Center: Canva style 8-bit Buttons on dark navbar */}
        <nav aria-label="Điều hướng vòng thi" className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Rule button */}
          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Xem luật chơi"
            className="px-2.5 py-1 text-xs font-bold pixel-btn-blue cursor-pointer"
          >
            ?
          </button>

          {/* RƯƠNG SỨ MỆNH */}
          <button
            type="button"
            onClick={() => onNavigatePhase?.('PICK_BRIEFCASES')}
            className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer transition-transform ${
              isChestPhase
                ? 'pixel-tile-gold scale-105'
                : 'pixel-btn-blue'
            }`}
          >
            RƯƠNG SỨ MỆNH
          </button>

          {/* THỬ THÁCH */}
          <button
            type="button"
            onClick={() => onNavigatePhase?.('QUIZ_BOARD')}
            className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer transition-transform ${
              isQuizPhase
                ? 'pixel-tile-gold scale-105'
                : 'pixel-btn-blue'
            }`}
          >
            20 CÂU HỎI
          </button>

          {/* ĐẤU GIÁ */}
          <button
            type="button"
            onClick={() => onNavigatePhase?.('DEAL_OR_NO_DEAL')}
            className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer transition-transform ${
              isDealPhase
                ? 'pixel-tile-gold scale-105'
                : 'pixel-btn-blue'
            }`}
          >
            ĐẤU GIÁ
          </button>
        </nav>

        {/* Right: Golden Diamonds 💎 + Utility Controls */}
        <div className="flex items-center gap-3">
          {/* 3 Golden Diamonds */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
            <span className="text-xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
            <span className="text-xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-1.5 pixel-btn-blue cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-yellow-300" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullScreen}
              aria-label="Toàn màn hình"
              title="Toàn màn hình"
              className="p-1.5 pixel-btn-blue cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onResetGame}
              aria-label="Làm mới trận đấu"
              title="Làm mới trận đấu"
              className="p-1.5 pixel-btn-red cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
