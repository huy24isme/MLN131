import React, { useState, useEffect } from 'react';
import { GamePhase, Team, Briefcase, Question, BriefcaseEffectType } from './types';
import { INITIAL_QUESTIONS } from './data/defaultQuestions';
import { generateShuffledBriefcases } from './data/defaultBriefcases';
import { Navbar } from './components/Navbar';
import { RulesModal } from './components/RulesModal';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { SetupScreen } from './components/SetupScreen';
import { PickBriefcasesScreen } from './components/PickBriefcasesScreen';
import { QuizBoardScreen } from './components/QuizBoardScreen';
import { DealScreen } from './components/DealScreen';
import { RevealScreen } from './components/RevealScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { sound } from './utils/audio';

const STORAGE_KEY_QUESTIONS = 'chieccap_questions_v1';

export const App: React.FC = () => {
  // Game Phase
  const [phase, setPhase] = useState<GamePhase>('SETUP');

  // Teams & Briefcases
  const [teams, setTeams] = useState<Team[]>([]);
  const [briefcases, setBriefcases] = useState<Briefcase[]>(() => generateShuffledBriefcases());

  // Questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_QUESTIONS;
  });

  // UI Modals & Settings
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Toggle Mute
  const handleToggleMute = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Start Game from Setup
  const handleStartGame = (initializedTeams: Team[]) => {
    setTeams(initializedTeams);
    setBriefcases(generateShuffledBriefcases());
    setPhase('PICK_BRIEFCASES');
  };

  // Pick Briefcase
  const handlePickBriefcase = (teamId: number, briefcaseId: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, initialBriefcaseId: briefcaseId } : t))
    );
    setBriefcases((prev) =>
      prev.map((b) => (b.id === briefcaseId ? { ...b, chosenByTeamId: teamId } : b))
    );
  };

  // Move from Picking to Quiz
  const handleFinishPicking = () => {
    setPhase('QUIZ_BOARD');
  };

  // Answering a Question
  const handleAnswerQuestion = (
    questionId: number,
    isCorrect: boolean,
    teamId: number
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    // Update questions status
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isAnswered: true,
              isCorrect,
              answeredByTeamId: teamId,
            }
          : q
      )
    );

    // Update team score if correct
    if (isCorrect) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId ? { ...t, score: t.score + question.points } : t
        )
      );
    }
  };

  // Finish Quiz and Go to Deals
  const handleFinishQuiz = () => {
    setPhase('DEAL_OR_NO_DEAL');
  };

  // Deal Decision for a team
  const handleTeamDealDecision = (
    teamId: number,
    sold: boolean,
    offerPoints: number
  ) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            hasSoldBriefcase: sold,
            dealOfferPoints: offerPoints,
            score: sold ? t.score + offerPoints : t.score,
          };
        }
        return t;
      })
    );

    // Mark briefcase as sold
    const team = teams.find((t) => t.id === teamId);
    if (team?.initialBriefcaseId) {
      setBriefcases((prev) =>
        prev.map((b) =>
          b.id === team.initialBriefcaseId ? { ...b, isSold: sold } : b
        )
      );
    }
  };

  // Move from Deals to Reveal
  const handleFinishDeals = () => {
    setPhase('REVEAL_BRIEFCASES');
  };

  // Apply Briefcase Effect
  const handleApplyBriefcaseEffect = (
    teamId: number,
    effect: BriefcaseEffectType,
    swapWithTeamId?: number
  ) => {
    setTeams((prev) => {
      const currentTeam = prev.find((t) => t.id === teamId);
      if (!currentTeam || currentTeam.hasSoldBriefcase) return prev;

      let newScore = currentTeam.score;
      let effectNote = '';

      if (effect === '+10') {
        newScore = currentTeam.score + 10;
        effectNote = '+10 điểm vào quỹ';
      } else if (effect === 'x2') {
        newScore = currentTeam.score * 2;
        effectNote = 'Nhân đôi số điểm';
      } else if (effect === '/2') {
        newScore = Math.ceil(currentTeam.score / 2);
        effectNote = 'Bị chia đôi điểm';
      } else if (effect === '-5') {
        newScore = Math.max(0, currentTeam.score - 5);
        effectNote = 'Bị trừ 5 điểm';
      } else if (effect === '-10') {
        newScore = Math.max(0, currentTeam.score - 10);
        effectNote = 'Bị trừ 10 điểm';
      } else if (effect === 'zero') {
        newScore = 0;
        effectNote = 'Mất toàn bộ điểm (về 0)';
      } else if (effect === 'none') {
        effectNote = 'Bảo toàn số điểm (+0)';
      }

      if (effect === 'swap' && swapWithTeamId) {
        const targetTeam = prev.find((t) => t.id === swapWithTeamId);
        if (targetTeam) {
          const teamCurrentScore = currentTeam.score;
          const targetCurrentScore = targetTeam.score;

          return prev.map((t) => {
            if (t.id === teamId) {
              return {
                ...t,
                score: targetCurrentScore,
                effectApplied: `Đã đổi điểm với ${targetTeam.name}!`,
              };
            }
            if (t.id === swapWithTeamId) {
              return {
                ...t,
                score: teamCurrentScore,
                effectApplied: `Bị ${currentTeam.name} đổi điểm!`,
              };
            }
            return t;
          });
        }
      }

      return prev.map((t) =>
        t.id === teamId ? { ...t, score: newScore, effectApplied: effectNote } : t
      );
    });
  };

  // Move from Reveal to Victory
  const handleFinishReveal = () => {
    setPhase('VICTORY');
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('Bạn có chắc muốn làm mới toàn bộ trận đấu và chơi lại từ đầu không?')) {
      setPhase('SETUP');
      setTeams([]);
      setBriefcases(generateShuffledBriefcases());
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          isAnswered: false,
          answeredByTeamId: null,
          isCorrect: null,
        }))
      );
    }
  };

  // Save customized questions
  const handleSaveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        currentPhase={phase}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetGame={handleResetGame}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Main Game Screen depending on phase */}
      <main className="flex-1 flex flex-col justify-center">
        {phase === 'SETUP' && (
          <SetupScreen
            onStartGame={handleStartGame}
            onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
          />
        )}

        {phase === 'PICK_BRIEFCASES' && (
          <PickBriefcasesScreen
            teams={teams}
            briefcases={briefcases}
            onPickBriefcase={handlePickBriefcase}
            onFinishPicking={handleFinishPicking}
          />
        )}

        {phase === 'QUIZ_BOARD' && (
          <QuizBoardScreen
            teams={teams}
            questions={questions}
            onAnswerQuestion={handleAnswerQuestion}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {phase === 'DEAL_OR_NO_DEAL' && (
          <DealScreen
            teams={teams}
            briefcases={briefcases}
            onTeamDealDecision={handleTeamDealDecision}
            onFinishDeals={handleFinishDeals}
          />
        )}

        {phase === 'REVEAL_BRIEFCASES' && (
          <RevealScreen
            teams={teams}
            briefcases={briefcases}
            onApplyBriefcaseEffect={handleApplyBriefcaseEffect}
            onFinishReveal={handleFinishReveal}
          />
        )}

        {phase === 'VICTORY' && (
          <VictoryScreen
            teams={teams}
            briefcases={briefcases}
            onPlayAgain={() => {
              setPhase('SETUP');
              setTeams([]);
              setBriefcases(generateShuffledBriefcases());
              setQuestions((prev) =>
                prev.map((q) => ({
                  ...q,
                  isAnswered: false,
                  answeredByTeamId: null,
                  isCorrect: null,
                }))
              );
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Chiếc Cặp Nguyện Vọng &bull; Game Show Lớp Học &bull; Sẵn sàng cho GitHub & Vercel
      </footer>

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <QuestionEditorModal
        isOpen={isQuestionEditorOpen}
        questions={questions}
        onClose={() => setIsQuestionEditorOpen(false)}
        onSave={handleSaveQuestions}
      />
    </div>
  );
};

export default App;
