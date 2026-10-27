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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl bg-[#360707] rounded-3xl shadow-2xl p-6 sm:p-8 text-amber-100 border-2 overflow-hidden ${
          isJackpot
            ? 'border-amber-400 shadow-amber-500/40 animate-gold-shine'
            : 'border-amber-500/50 shadow-black'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r ${activeTeam.color} shadow`}
            >
              Lượt thi: {activeTeam.name}
            </span>
            <span className="text-amber-200/80 font-['Cinzel',serif] font-bold text-sm">
              CÂU HỎI SỐ {formattedNum} / 20
            </span>
          </div>

          <div
            className={`px-3 py-1 rounded-xl font-['Cinzel',serif] font-black text-sm sm:text-base flex items-center gap-1.5 ${
              isJackpot
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-lg shadow-amber-500/40 animate-bounce'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isJackpot && <Sparkles className="w-4 h-4 fill-stone-950" />}
            <span>{question.points} ĐIỂM</span>
            {isJackpot && <span className="text-xs uppercase">(Jackpot)</span>}
          </div>
        </div>

        {/* Center: Question Text */}
        <div className="min-h-[130px] flex items-center justify-center text-center p-4 sm:p-6 rounded-2xl bg-black/40 border border-amber-500/20 mb-5">
          <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* 10s Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-amber-500/20 mb-5">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl transition shadow ${
                timeLeft <= 3
                  ? 'bg-rose-600 text-white animate-danger-glow'
                  : "bg-amber-400 text-stone-950 font-['Cinzel',serif]"
              }`}
            >
              {timeLeft}s
            </div>
            <div>
              <span className="text-xs font-bold text-amber-200/70 uppercase tracking-wider block font-['Cinzel',serif]">
                Thời Gian Suy Nghĩ
              </span>
              <span className="text-sm font-semibold text-amber-300">
                {isRunning ? 'Đang đếm...' : timeLeft === 0 ? 'Hết giờ!' : 'Sẵn sàng'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer font-['Cinzel',serif]"
              >
                <Play className="w-4 h-4 fill-white" /> Bắt đầu 10s
              </button>
            ) : (
              <button
                onClick={handlePauseTimer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm cursor-pointer font-['Cinzel',serif]"
              >
                <Pause className="w-4 h-4 fill-white" /> Tạm dừng
              </button>
            )}

            <button
              onClick={handleResetTimer}
              title="Đặt lại 10 giây"
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-500/30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Answer Toggle Section */}
        <div className="mb-5">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300/80 hover:text-amber-300 transition cursor-pointer"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án (Dành cho Quản trò / MC)'}
          </button>

          {showAnswer && (
            <div className="mt-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm font-bold animate-fadeIn">
              🎯 Đáp án: <span className="text-white ml-1">{question.answer}</span>
            </div>
          )}
        </div>

        {/* Host Judgement Buttons */}
        <div className="pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200/80 text-xs sm:text-sm font-semibold transition cursor-pointer border border-amber-500/30 font-['Cinzel',serif]"
          >
            Đóng / Bỏ qua
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow transition transform hover:scale-102 cursor-pointer font-['Cinzel',serif]"
            >
              <X className="w-4 h-4 stroke-[3]" />
              TRẢ LỜI SAI (0đ)
            </button>

            <button
              onClick={() => onAnswer(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs sm:text-sm font-black shadow-lg transition transform hover:scale-102 cursor-pointer font-['Cinzel',serif]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              TRẢ LỜI ĐÚNG (+{question.points}đ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
