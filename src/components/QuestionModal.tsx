import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, X, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
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

  // Reset timer whenever a new question is opened
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

  // Countdown loop
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 border-2 overflow-hidden ${
          isJackpot
            ? 'border-amber-400 shadow-amber-500/40 animate-gold-glow'
            : 'border-slate-700 shadow-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-xl font-black text-sm tracking-wide text-white bg-gradient-to-r ${activeTeam.color} shadow`}
            >
              Lượt thi: {activeTeam.name}
            </span>
            <span className="text-slate-400 font-bold text-sm">
              Câu số {question.id} / 20
            </span>
          </div>

          {/* Point Badge */}
          <div
            className={`px-4 py-1.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-1.5 ${
              isJackpot
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/40 animate-bounce'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isJackpot && <Sparkles className="w-5 h-5 fill-slate-950" />}
            <span>{question.points} ĐIỂM</span>
            {isJackpot && <span className="text-xs uppercase">(Jackpot)</span>}
          </div>
        </div>

        {/* Center: Question Text */}
        <div className="min-h-[140px] flex items-center justify-center text-center p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* 10s Timer Display */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6">
          <div className="flex items-center gap-4">
            {/* Animated Timer Circle */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl transition-all duration-300 shadow-lg ${
                timeLeft <= 3
                  ? 'bg-rose-600 text-white animate-danger-glow'
                  : timeLeft <= 6
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {timeLeft}s
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Thời gian suy nghĩ
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {isRunning
                  ? 'Đang đếm ngược...'
                  : timeLeft === 0
                  ? 'Hết giờ!'
                  : 'Sẵn sàng'}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Bắt đầu đếm (10s)
              </button>
            ) : (
              <button
                onClick={handlePauseTimer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                Tạm dừng
              </button>
            )}

            <button
              onClick={handleResetTimer}
              title="Đặt lại 10 giây"
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Answer Toggle Section (For Host) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition cursor-pointer"
            >
              {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án (Dành cho Quản trò/MC)'}
            </button>
          </div>

          {showAnswer && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-sm font-bold animate-fadeIn">
              🎯 Đáp án: <span className="text-white ml-1">{question.answer}</span>
            </div>
          )}
        </div>

        {/* Host Judgement Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition cursor-pointer"
          >
            Đóng / Bỏ qua
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-rose-600/30 transition transform hover:scale-103 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
              TRẢ LỜI SAI (0đ)
            </button>

            <button
              onClick={() => onAnswer(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm sm:text-base font-black shadow-lg shadow-emerald-500/30 transition transform hover:scale-103 cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              TRẢ LỜI ĐÚNG (+{question.points}đ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
