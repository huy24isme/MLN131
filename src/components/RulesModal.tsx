import React from 'react';
import { X, HelpCircle, Sparkles, DollarSign, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#360707] border-2 border-amber-400 rounded-2xl shadow-2xl p-6 text-amber-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 text-amber-300 hover:text-white hover:bg-black/60 transition cursor-pointer border border-amber-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-['Cinzel',serif]">
              LUẬT CHƠI DÒNG CHẢY SỬ VIỆT
            </h2>
            <p className="text-xs text-amber-200/70 font-['Cinzel',serif]">Trí Tuệ & Chiến Thuật Lớp Học</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1 font-['Cinzel',serif]">
              1. RƯƠNG SỨ MỆNH (8 RƯƠNG)
            </h3>
            <p className="text-amber-100/90 text-xs">
              Mỗi đội chọn 1 rương ngay từ đầu, cuối game mới được mở. Trong 8 rương chứa các hiệu ứng đặc biệt:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs font-semibold text-center font-['Cinzel',serif]">
              <span className="p-1.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">+10 Điểm</span>
              <span className="p-1.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40">Nhân đôi (x2)</span>
              <span className="p-1.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40">Đổi điểm</span>
              <span className="p-1.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">Chia đôi (/2)</span>
              <span className="p-1.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40">Trừ 5 Điểm</span>
              <span className="p-1.5 rounded bg-red-950/60 text-red-400 border border-red-500/40">Trừ 10 Điểm</span>
              <span className="p-1.5 rounded bg-stone-900 text-stone-300 border border-stone-700">Về 0 Điểm</span>
              <span className="p-1.5 rounded bg-stone-900 text-stone-400 border border-stone-800">Không có gì (+0)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1 font-['Cinzel',serif]">
              <Sparkles className="w-4 h-4 text-amber-400" /> 2. THỬ THÁCH (20 CÂU HỎI)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-amber-100/90 text-xs">
              <li>Có 20 ô số vàng kim (01–20). Điểm và nội dung hoàn toàn ẩn giấu.</li>
              <li>Điểm rải từ 1–5 điểm và 1 câu <strong>JACKPOT 10 điểm</strong>.</li>
              <li>Mỗi câu có 10 giây suy nghĩ: Đúng nhận điểm, Sai không có điểm.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1 font-['Cinzel',serif]">
              <DollarSign className="w-4 h-4 text-amber-400" /> 3. ĐẤU GIÁ (MUA BÁN RƯƠNG)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-amber-100/90 text-xs">
              <li>Đội điểm thấp nhất quyết định trước.</li>
              <li>BTC đưa ra mức giá mua lại rương (tối đa 8 điểm).</li>
              <li>Đội có 10 giây chọn: <strong>BÁN</strong> (lấy điểm an toàn) hoặc <strong>GIỮ</strong> (chờ mở).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-1 font-['Cinzel',serif]">
              <Trophy className="w-4 h-4 text-amber-400" /> 4. MỞ RƯƠNG & XẾP HẠNG
            </h3>
            <p className="text-amber-100/90 text-xs">
              Mở các rương chưa bán để áp dụng hiệu ứng và tìm ra đội chiến thắng chung cuộc 🏆!
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-xs font-['Cinzel',serif] cursor-pointer"
          >
            ĐÃ HIỂU LUẬT CHƠI
          </button>
        </div>
      </div>
    </div>
  );
};
