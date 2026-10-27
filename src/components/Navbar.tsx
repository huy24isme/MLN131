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
    <header className="sticky top-0 z-40 px-4 py-2.5 border-b-4 border-yellow-400 bg-[#12131a] shadow-xl select-none font-['VT323',monospace]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Stats with VT323 font */}
        <div className="flex items-center gap-3">
          <div className="text-left leading-none tracking-wider">
            <div className="text-lg text-yellow-400 font-bold uppercase drop-shadow-[1px_1px_0px_#000]">
              👾 RETRO PIXEL GAME
            </div>
            <div className="text-2xl text-white font-bold drop-shadow-[1px_1px_0px_#000]">
              ĐIỂM CAO: 9999
            </div>
          </div>
        </div>

        {/* Center: Canva style 8-bit Buttons in VT323 */}
        <nav aria-label="Điều hướng vòng thi" className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Xem luật chơi"
            className="px-3 py-1 text-lg font-bold pixel-btn-blue cursor-pointer"
          >
            ? LUẬT
          </button>

          <button
            type="button"
            onClick={() => onNavigatePhase?.('PICK_BRIEFCASES')}
            className={`px-3 py-1 text-lg font-bold uppercase cursor-pointer transition-transform ${
              isChestPhase
                ? 'pixel-tile-gold scale-105'
                : 'pixel-btn-blue'
            }`}
          >
            RƯƠNG SỨ MỆNH
          </button>

          <button
            type="button"
            onClick={() => onNavigatePhase?.('QUIZ_BOARD')}
            className={`px-3 py-1 text-lg font-bold uppercase cursor-pointer transition-transform ${
              isQuizPhase
                ? 'pixel-tile-gold scale-105'
                : 'pixel-btn-blue'
            }`}
          >
            20 CÂU HỎI
          </button>

          <button
            type="button"
            onClick={() => onNavigatePhase?.('DEAL_OR_NO_DEAL')}
            className={`px-3 py-1 text-lg font-bold uppercase cursor-pointer transition-transform ${
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
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-2xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
            <span className="text-2xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
            <span className="text-2xl filter drop-shadow-[1px_1px_0px_#000]">💎</span>
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
