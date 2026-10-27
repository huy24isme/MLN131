import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-[#1e0505] border-4 border-black p-5 sm:p-6 text-white flex flex-col max-h-[90vh] shadow-[8px_8px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-['VT323',monospace] text-yellow-300 pixel-text-shadow tracking-wider">
              CHỈNH SỬA BỘ 20 CÂU HỎI
            </h2>
            <p className="font-['VT323',monospace] text-lg text-yellow-200 mt-1">
              Bạn có thể tự nhập câu hỏi, đáp án và điểm số của môn học lớp bạn
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 pixel-btn-red text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {localQuestions.map((q) => (
            <div
              key={q.id}
              className={`p-3 border-2 border-black ${
                q.points === 10
                  ? 'bg-yellow-300/20 border-yellow-300'
                  : 'bg-black/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-['VT323',monospace] text-xl font-bold text-yellow-300">
                  CÂU {q.id} {q.points === 10 && '🔥 [JACKPOT 10 ĐIỂM]'}
                </span>
                <div className="flex items-center gap-2">
                  <label className="font-['VT323',monospace] text-lg text-stone-300">Điểm:</label>
                  <select
                    value={q.points}
                    onChange={(e) => handleUpdate(q.id, 'points', Number(e.target.value))}
                    className="bg-black border border-white text-yellow-300 font-bold px-2 py-0.5 text-base focus:outline-none font-['VT323',monospace]"
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
                  <label className="block font-['VT323',monospace] text-base text-stone-300 mb-1">
                    Nội dung câu hỏi:
                  </label>
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => handleUpdate(q.id, 'question', e.target.value)}
                    className="w-full bg-black border border-stone-600 p-2 text-xs text-white focus:outline-none focus:border-yellow-300 resize-none font-['Be_Vietnam_Pro',sans-serif]"
                    placeholder="Nhập nội dung câu hỏi..."
                  />
                </div>

                {/* Answer Text */}
                <div>
                  <label className="block font-['VT323',monospace] text-base text-emerald-400 mb-1">
                    Đáp án đúng (chỉ MC nhìn thấy để đối chiếu):
                  </label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleUpdate(q.id, 'answer', e.target.value)}
                    className="w-full bg-black border border-stone-600 p-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-['Be_Vietnam_Pro',sans-serif]"
                    placeholder="Nhập đáp án đúng..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2 pixel-btn-blue font-['VT323',monospace] text-base cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            KHÔI PHỤC MẶC ĐỊNH
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 pixel-btn-red font-['VT323',monospace] text-base cursor-pointer"
            >
              HỦY
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="flex items-center gap-1.5 px-5 py-2 pixel-tile-gold font-['VT323',monospace] text-base font-black cursor-pointer"
            >
              <Save className="w-4 h-4" />
              LƯU & ÁP DỤNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
