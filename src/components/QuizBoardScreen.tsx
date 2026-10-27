import React, { useState } from 'react';
import { Question, Team } from '../types';
import { QuestionModal } from './QuestionModal';
import { ArrowRight, Check, X, Sparkles, Award } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Banner: Current Turn & Progress */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
        {/* Progress indicator */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tiến độ câu hỏi
          </span>
          <span className="text-sm font-extrabold text-amber-400">
            {answeredCount} / {questions.length} câu đã trả lời
          </span>
        </div>

        {/* Current Turn Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
            Lượt của:
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-sm font-black text-white bg-gradient-to-r ${activeTeam.color} shadow`}
          >
            {activeTeam.name}
          </span>
        </div>

        {/* Next Phase Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (
                !isAllAnswered &&
                !window.confirm(
                  `Chưa trả lời hết 20 câu hỏi (${answeredCount}/${questions.length}). Bạn có chắc muốn kết thúc sớm để vào Vòng Thương Lượng không?`
                )
              ) {
                return;
              }
              sound.playCashDeal();
              onFinishQuiz();
            }}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition cursor-pointer ${
              isAllAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
            }`}
          >
            <span>VÀO VÒNG THƯƠNG LƯỢNG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 20 Questions Matrix (5 cols x 4 rows) */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {questions.map((q) => {
          const isAnswered = q.isAnswered;
          const isCorrect = q.isCorrect;
          const answeredTeam = q.answeredByTeamId
            ? teams.find((t) => t.id === q.answeredByTeamId)
            : null;

          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q)}
              disabled={isAnswered}
              className={`relative h-20 sm:h-24 rounded-2xl font-black text-xl sm:text-2xl transition-all duration-200 select-none flex flex-col items-center justify-center border-2 ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 opacity-80 cursor-not-allowed'
                    : 'bg-rose-950/40 border-rose-600/50 text-rose-400 opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-amber-500/50 hover:border-amber-400 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 text-amber-300 cursor-pointer active:scale-95'
              }`}
            >
              {isAnswered ? (
                <div className="flex flex-col items-center">
                  {isCorrect ? (
                    <>
                      <Check className="w-6 h-6 stroke-[3] text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">
                        +{q.points}đ
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 stroke-[3] text-rose-500" />
                      <span className="text-xs font-bold text-rose-400">0đ</span>
                    </>
                  )}
                  {answeredTeam && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                      {answeredTeam.name}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {q.id}
                  </span>
                  <span className="text-[10px] sm:text-xs text-amber-400/80 font-bold tracking-wider">
                    CÂU HỎI
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Scoreboard */}
      <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" /> Bảng Điểm Trực Tiếp
          </h3>
          <span className="text-xs text-slate-400">
            * Bấm vào tên đội để chuyển lượt trả lời thủ công
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {teams.map((team, idx) => {
            const isActive = activeTeam.id === team.id;
            return (
              <div
                key={team.id}
                onClick={() => setActiveTeamIndex(idx)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${team.color} truncate max-w-[90px]`}
                  >
                    {team.name}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">
                    Cặp #{team.initialBriefcaseId}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Điểm:</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {team.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Question Modal */}
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
