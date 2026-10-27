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

    // Auto rotate turn to next team
    setActiveTeamIndex((prev) => (prev + 1) % teams.length);
  };

  // 2 rows of 10 tiles
  const row1 = questions.slice(0, 10);
  const row2 = questions.slice(10, 20);

  const renderTile = (q: Question) => {
    const isAnswered = q.isAnswered;
    const isCorrect = q.isCorrect;
    const formattedNum = q.id < 10 ? `0${q.id}` : `${q.id}`;

    return (
      <button
        key={q.id}
        type="button"
        onClick={() => handleSelectQuestion(q)}
        disabled={isAnswered}
        aria-label={`Câu hỏi số ${formattedNum}${isAnswered ? (isCorrect ? ' - Đúng' : ' - Sai') : ''}`}
        className={`relative w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 flex items-center justify-center select-none font-['VT323',monospace] cursor-pointer ${
          isAnswered
            ? isCorrect
              ? 'bg-[#15803d] border-3 border-black text-white shadow-[2px_2px_0px_#000] opacity-90 cursor-not-allowed'
              : 'bg-[#5e1210] border-3 border-black text-stone-400 shadow-[2px_2px_0px_#000] opacity-60 cursor-not-allowed'
            : 'pixel-tile-gold font-black text-lg sm:text-2xl md:text-3xl'
        }`}
      >
        {isAnswered ? (
          <div className="flex flex-col items-center leading-none">
            {isCorrect ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-300 stroke-[3]" />
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 font-['VT323',monospace]">
                  +{q.points}
                </span>
              </>
            ) : (
              <>
                <X className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-400 stroke-[3]" />
                <span className="text-xs sm:text-sm font-bold text-rose-200 mt-0.5 font-['VT323',monospace]">0đ</span>
              </>
            )}
          </div>
        ) : (
          <span className="tabular-nums tracking-wider">
            {formattedNum}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10 select-none">
      {/* Top Banner: Current Turn & Finish Button */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Current Turn Badge */}
        <div className="flex items-center gap-2.5 pixel-box px-4 py-2">
          <span className="font-['VT323',monospace] text-xl text-yellow-300 uppercase tracking-wide">
            LƯỢT:
          </span>
          <span
            className={`px-3 py-0.5 text-lg font-['VT323',monospace] font-bold text-white bg-gradient-to-r ${activeTeam.color} border border-black shadow-[1px_1px_0px_#000]`}
          >
            {activeTeam.name}
          </span>
          <span className="font-['VT323',monospace] text-xl text-yellow-200">
            ({answeredCount}/20 CÂU ĐÃ MỞ)
          </span>
        </div>

        {/* Advance to Deals Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (
                !isAllAnswered &&
                !window.confirm(
                  `Chưa trả lời hết 20 câu (${answeredCount}/20). Bạn có muốn chuyển sang vòng ĐẤU GIÁ không?`
                )
              ) {
                return;
              }
              sound.playCashDeal();
              onFinishQuiz();
            }}
            className={`inline-flex items-center gap-2 px-5 py-2 font-['VT323',monospace] text-xl cursor-pointer ${
              isAllAnswered
                ? 'pixel-tile-gold font-black animate-bounce'
                : 'pixel-btn-blue'
            }`}
          >
            <span>VÀO ĐẤU GIÁ</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 20 Golden Pixel Tiles: 2 rows of 10 matching Canva / Retro Arcade */}
      <div className="w-full max-w-5xl my-4 sm:my-6 flex flex-col items-center gap-2 sm:gap-3">
        {/* Row 1: 01 to 10 */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          {row1.map(renderTile)}
        </div>

        {/* Row 2: 11 to 20 */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          {row2.map(renderTile)}
        </div>
      </div>

      {/* Live Scoreboard */}
      <div className="w-full max-w-4xl mt-6 p-4 pixel-box">
        <div className="flex items-center justify-between mb-3">
          <span className="font-['VT323',monospace] text-xl uppercase text-yellow-300 flex items-center gap-1.5 drop-shadow-[1px_1px_0px_#000] tracking-wide">
            <Award className="w-5 h-5" /> BẢNG ĐIỂM TRỰC TIẾP
          </span>
          <span className="font-['VT323',monospace] text-lg text-yellow-200/90">
            * Bấm vào tên đội để chuyển lượt thủ công
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {teams.map((team, idx) => {
            const isActive = activeTeam.id === team.id;
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => setActiveTeamIndex(idx)}
                className={`p-2.5 border-2 border-black text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yellow-300 text-black shadow-[3px_3px_0px_#000] scale-102 font-bold'
                    : 'bg-[#1e0505] text-white hover:bg-[#330808] shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-['VT323',monospace] font-bold px-2 py-0.5 text-white bg-gradient-to-r ${team.color} border border-black truncate max-w-[85px]`}
                  >
                    {team.name}
                  </span>
                  <span className={`text-base font-['VT323',monospace] font-bold ${isActive ? 'text-black' : 'text-yellow-300'}`}>
                    #{team.initialBriefcaseId}
                  </span>
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-['VT323',monospace] ${isActive ? 'text-black' : 'text-yellow-300'}`}>
                  {team.score} ĐIỂM
                </div>
              </button>
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
