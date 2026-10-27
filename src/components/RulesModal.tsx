import React from 'react';
import { X, Briefcase, HelpCircle, Sparkles, DollarSign, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400">
              LUẬT CHƠI CHIẾC CẶP NGUYỆN VỌNG
            </h2>
            <p className="text-sm text-slate-400">Game show trí tuệ & chiến thuật lớp học</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-amber-400" /> 1. Chọn Cặp Bí Ẩn (8 Cặp)
            </h3>
            <p className="text-slate-300 text-sm">
              Có 8 chiếc cặp bí ẩn. Đầu game mỗi đội chọn 1 chiếc cặp làm của riêng và <strong>chưa được mở</strong>. Các cặp chứa các hiệu ứng đặc biệt:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs font-semibold text-center">
              <span className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">+10 Điểm</span>
              <span className="p-1.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Nhân đôi (x2)</span>
              <span className="p-1.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Đổi điểm</span>
              <span className="p-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Chia đôi (/2)</span>
              <span className="p-1.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Trừ 5 Điểm</span>
              <span className="p-1.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">Trừ 10 Điểm</span>
              <span className="p-1.5 rounded bg-slate-600/30 text-slate-300 border border-slate-600">Về 0 Điểm</span>
              <span className="p-1.5 rounded bg-slate-700/40 text-slate-400 border border-slate-700">Không có gì (+0)</span>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> 2. Vòng 20 Câu Hỏi
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              <li>Có 20 ô số (1–20). Điểm và nội dung câu hỏi hoàn toàn ẩn giấu.</li>
              <li>Điểm rải từ <strong>1–5 điểm</strong> và có <strong>1 câu JACKPOT 10 điểm</strong> cao nhất.</li>
              <li>Mỗi câu có <strong>10 giây</strong> đếm ngược để trả lời:
                <span className="text-emerald-400 font-medium"> Đúng nhận điểm</span>,
                <span className="text-rose-400 font-medium"> Sai không có điểm</span>.
              </li>
            </ul>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-amber-400" /> 3. Mở Hoặc Bán Cặp Cho BTC
            </h3>
            <p className="text-slate-300 text-sm mb-1">
              Sau khi kết thúc 20 câu hỏi, các đội sẽ bước vào giai đoạn thương lượng:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              <li><strong>Đội điểm thấp nhất sẽ được quyết định trước</strong> (cơ hội lật kèo).</li>
              <li>BTC đưa ra mức giá mua cặp (<strong>tối đa 8 điểm</strong>).</li>
              <li>Đội có 10 giây quyết định: 
                <span className="text-amber-300 font-semibold"> BÁN</span> (lấy điểm an toàn) hoặc 
                <span className="text-sky-300 font-semibold"> GIỮ</span> (chấp nhận rủi ro để mở ở vòng sau).
              </li>
            </ul>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" /> 4. Mở Cặp & Tổng Kết Chung Cuộc
            </h3>
            <p className="text-slate-300 text-sm">
              Mở những chiếc cặp chưa bán để áp dụng hiệu ứng bí ẩn. Đội có tổng điểm cao nhất sau tất cả các vòng sẽ giành chiến thắng chung cuộc 🏆!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Đã hiểu luật chơi
          </button>
        </div>
      </div>
    </div>
  );
};
