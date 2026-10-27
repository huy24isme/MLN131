import React, { useState } from 'react';
import { Question, Team } from '../types';
import { QuestionModal } from './QuestionModal';
import { ArrowRight, Check, X, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuizBoardScreenProps {
  teams: Team[];
  questions: Question[];
  onAnswerQuestion: (questionId: number, isCorrect: boolean, teamId: number) => void;
  onFinishQuiz: () => void;
}

export const QuizBoardScreen: React.FC<QuizBoardScreenProps> = ({
  teams,
  questions,
  onAnswerQuestion,
  onFinishQuiz,
}) => {
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const activeTeam = teams[activeTeamIndex] || teams[0];
  const answeredCount = questions.filter((q) => q.isAnswered).length;
  const isAllAnswered = answeredCount === questions.length;

  const handleSelectQuestion = (question: Question) => {
    if (question.isAnswered) return;
    setSelectedQuestion(question);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!selectedQuestion) return;

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    onAnswerQuestion(selectedQuestion.id, isCorrect, activeTeam.id);
    setSelectedQuestion(null);

    // Auto cycle turn to next team
    setActiveTeamIndex((prev) => (prev + 1) % teams.length);
  };

  // Split into 2 rows of 10 to match Figma layout
  const row1 = questions.slice(0, 10);
  const row2 = questions.slice(10, 20);

  const renderTile = (q: Question) => {
    const isAnswered = q.isAnswered;
    const isCorrect = q.isCorrect;
    const formattedNum = q.id < 10 ? `0${q.id}` : `${q.id}`;

    return (
      <button
        key={q.id}
        onClick={() => handleSelectQuestion(q)}
        disabled={isAnswered}
        className={`relative w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl transition-all duration-200 select-none flex flex-col items-center justify-center ${
          isAnswered
            ? isCorrect
              ? 'bg-emerald-950/70 border-2 border-emerald-500 text-emerald-400 opacity-80 cursor-not-allowed shadow-inner'
              : 'bg-stone-900/80 border-2 border-stone-700 text-stone-500 opacity-50 cursor-not-allowed'
            : 'gold-tile text-[#5c1d0b] cursor-pointer'
        }`}
      >
        {isAnswered ? (
          <div className="flex flex-col items-center">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] text-emerald-400" />
                <span className="text-[10px] sm:text-xs font-bold text-emerald-300">
                  +{q.points}đ
                </span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] text-rose-500" />
                <span className="text-[10px] sm:text-xs font-bold text-stone-400">0đ</span>
              </>
            )}
          </div>
        ) : (
          <span className="font-['Cinzel',serif] tracking-tighter">
            {formattedNum}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10">
      {/* Top Controls: Current Turn & Finish Button */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Current Turn Badge */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
          <span className="text-xs uppercase font-['Cinzel',serif] font-bold text-amber-300">
            LƯỢT THI ĐẤU:
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r ${activeTeam.color} shadow`}
          >
            {activeTeam.name}
          </span>
          <span className="text-xs text-amber-200/70">
            ({answeredCount}/20 câu)
          </span>
        </div>

        {/* Advance to Deals Button */}
        <div>
          <button
            onClick={() => {
              if (
                !isAllAnswered &&
                !window.confirm(
                  `Chưa mở hết 20 câu (${answeredCount}/20). Bạn có muốn chuyển sang vòng ĐẤU GIÁ (Deal or No Deal) luôn không?`
                )
              ) {
                return;
              }
              sound.playCashDeal();
              onFinishQuiz();
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-['Cinzel',serif] text-xs sm:text-sm font-black transition cursor-pointer ${
              isAllAnswered
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/40 animate-bounce'
                : 'bg-black/50 hover:bg-amber-950/60 text-amber-300 border border-amber-500/40'
            }`}
          >
            <span>VÀO VÒNG ĐẤU GIÁ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 20 Golden Tiles arranged exactly in 2 rows of 10 matching Figma Screenshot 2 */}
      <div className="w-full max-w-5xl my-4 sm:my-8 flex flex-col items-center gap-3 sm:gap-5">
        {/* Row 1: 01 to 10 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {row1.map(renderTile)}
        </div>

        {/* Row 2: 11 to 20 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {row2.map(renderTile)}
        </div>
      </div>

      {/* Live Scoreboard */}
      <div className="w-full max-w-4xl mt-6 p-4 rounded-2xl bg-black/40 border border-amber-500/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-['Cinzel',serif] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> BẢNG ĐIỂM CÁC ĐỘI
          </h4>
          <span className="text-[11px] text-amber-200/50">
            * Bấm vào đội để chuyển lượt thủ công
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {teams.map((team, idx) => {
            const isActive = activeTeam.id === team.id;
            return (
              <div
                key={team.id}
                onClick={() => setActiveTeamIndex(idx)}
                className={`p-3 rounded-xl border transition cursor-pointer text-center ${
                  isActive
                    ? 'bg-amber-950/60 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-black/40 border-amber-500/10 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded text-white bg-gradient-to-r ${team.color} truncate max-w-[80px]`}
                  >
                    {team.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    Rương #{team.initialBriefcaseId}
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-400 font-['Cinzel',serif]">
                  {team.score}đ
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal
        question={selectedQuestion}
        activeTeam={activeTeam}
        isOpen={selectedQuestion !== null}
        onClose={() => setSelectedQuestion(null)}
        onAnswer={handleAnswer}
      />
    </div>
  );
};
