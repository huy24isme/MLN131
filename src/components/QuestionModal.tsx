import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Question, Team } from '../types';
import { sound } from '../utils/audio';

interface QuestionModalProps {
  question: Question | null;
  activeTeam: Team;
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  activeTeam,
  isOpen,
  onClose,
  onAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && question) {
      setTimeLeft(10);
      setIsRunning(false);
      setShowAnswer(false);
      if (question.points === 10) {
        sound.playJackpot();
      }
    }
  }, [isOpen, question]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sound.playTimesUp();
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4) {
            sound.playWarning();
          } else {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  if (!isOpen || !question) return null;

  const handleStartTimer = () => {
    if (timeLeft === 0) setTimeLeft(10);
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(10);
  };

  const isJackpot = question.points === 10;
  const formattedNum = question.id < 10 ? `0${question.id}` : `${question.id}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#1e0505] border-4 border-black p-5 sm:p-6 text-white shadow-[8px_8px_0px_#000]"
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-[10px] font-['Press_Start_2P',monospace] text-white bg-gradient-to-r ${activeTeam.color} border border-black shadow-[1px_1px_0px_#000]`}
            >
              LƯỢT: {activeTeam.name}
            </span>
            <span className="font-['Press_Start_2P',monospace] text-xs text-yellow-300">
              CÂU {formattedNum} / 20
            </span>
          </div>

          <div
            className={`px-3 py-1 font-['Press_Start_2P',monospace] text-xs flex items-center gap-1.5 border-2 border-black ${
              isJackpot
                ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_#000] animate-bounce'
                : 'bg-blue-600 text-white shadow-[2px_2px_0px_#000]'
            }`}
          >
            {isJackpot && <Sparkles className="w-3.5 h-3.5 fill-black" />}
            <span>+{question.points} ĐIỂM</span>
            {isJackpot && <span className="text-[9px] uppercase">(JACKPOT)</span>}
          </div>
        </div>

        {/* Center: Question Text (Retro RPG dialogue box) */}
        <div className="min-h-[120px] flex items-center justify-center text-center p-4 bg-black border-2 border-white/60 mb-4 shadow-inner">
          <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
            {question.question}
          </h3>
        </div>

        {/* 10s Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#330808] border-2 border-black mb-4 shadow-[2px_2px_0px_#000]">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 flex items-center justify-center font-['Press_Start_2P',monospace] text-lg border-2 border-black shadow-[2px_2px_0px_#000] ${
                timeLeft <= 3
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-yellow-300 text-black'
              }`}
            >
              {timeLeft}
            </div>
            <div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-yellow-300 uppercase block">
                THỜI GIAN TRẢ LỜI
              </span>
              <span className="font-['VT323',monospace] text-base text-yellow-200">
                {isRunning ? 'Đang đếm ngược...' : timeLeft === 0 ? 'Hết giờ!' : 'Sẵn sàng'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="flex items-center gap-1.5 px-3 py-2 font-['Press_Start_2P',monospace] text-[10px] pixel-btn-green cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" /> BẮT ĐẦU (10S)
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="flex items-center gap-1.5 px-3 py-2 font-['Press_Start_2P',monospace] text-[10px] pixel-tile-gold cursor-pointer"
              >
                <Pause className="w-3 h-3 fill-black" /> TẠM DỪNG
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTimer}
              aria-label="Đặt lại thời gian"
              title="Đặt lại thời gian"
              className="p-2 pixel-btn-blue cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Answer Toggle Section */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center gap-1.5 font-['VT323',monospace] text-base text-yellow-300 hover:text-white transition-colors cursor-pointer"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? 'ẨN ĐÁP ÁN' : 'XEM ĐÁP ÁN (DÀNH CHO QUẢN TRÒ / MC)'}
          </button>

          {showAnswer && (
            <div className="mt-2 p-2.5 bg-black border-2 border-emerald-400 text-emerald-300 font-['VT323',monospace] text-lg animate-fadeIn">
              🎯 ĐÁP ÁN: <span className="text-white font-bold ml-1">{question.answer}</span>
            </div>
          )}
        </div>

        {/* Host Judgement Buttons */}
        <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 font-['Press_Start_2P',monospace] text-[9px] pixel-btn-blue cursor-pointer"
          >
            ĐÓNG
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAnswer(false)}
              className="flex items-center gap-1.5 px-4 py-2 font-['Press_Start_2P',monospace] text-[10px] pixel-btn-red font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              TRẢ LỜI SAI (0đ)
            </button>

            <button
              type="button"
              onClick={() => onAnswer(true)}
              className="flex items-center gap-1.5 px-5 py-2 font-['Press_Start_2P',monospace] text-[10px] pixel-btn-green font-bold cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              TRẢ LỜI ĐÚNG (+{question.points}đ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
