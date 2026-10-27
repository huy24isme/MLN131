import React, { useState } from 'react';
import { X, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Question } from '../types';
import { INITIAL_QUESTIONS } from '../data/defaultQuestions';

interface QuestionEditorModalProps {
  isOpen: boolean;
  questions: Question[];
  onClose: () => void;
  onSave: (updated: Question[]) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  questions,
  onClose,
  onSave,
}) => {
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);

  if (!isOpen) return null;

  const handleUpdate = (id: number, field: keyof Question, value: unknown) => {
    setLocalQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục 20 câu hỏi về mặc định?')) {
      setLocalQuestions(INITIAL_QUESTIONS);
    }
  };

  const handleSaveAndClose = () => {
    onSave(localQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
              ✏️ CHỈNH SỬA BỘ 20 CÂU HỎI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Bạn có thể tự nhập câu hỏi, đáp án và điểm số của môn học lớp bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {localQuestions.map((q) => (
            <div
              key={q.id}
              className={`p-4 rounded-xl border ${
                q.points === 10
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-extrabold text-amber-400 text-base">
                  Câu {q.id} {q.points === 10 && '🔥 [JACKPOT 10 ĐIỂM]'}
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Điểm số:</label>
                  <select
                    value={q.points}
                    onChange={(e) => handleUpdate(q.id, 'points', Number(e.target.value))}
                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value={1}>1 điểm</option>
                    <option value={2}>2 điểm</option>
                    <option value={3}>3 điểm</option>
                    <option value={4}>4 điểm</option>
                    <option value={5}>5 điểm</option>
                    <option value={10}>10 điểm (Jackpot)</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nội dung câu hỏi:
                  </label>
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => handleUpdate(q.id, 'question', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500/80 resize-none"
                    placeholder="Nhập nội dung câu hỏi..."
                  />
                </div>

                {/* Answer Text */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Đáp án đúng (chỉ MC nhìn thấy để đối chiếu):
                  </label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleUpdate(q.id, 'answer', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-2 text-sm text-emerald-300 focus:outline-none focus:border-emerald-500/80"
                    placeholder="Nhập đáp án đúng..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Khôi phục mặc định
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveAndClose}
              className="flex items-center gap-2 px-6 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu & Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
