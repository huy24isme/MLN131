import React from 'react';
import { X, HelpCircle, Sparkles, DollarSign, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#1e0505] border-4 border-black p-6 text-white max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_#000]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-1.5 pixel-btn-red font-bold text-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-300 border-2 border-black flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-yellow-300 font-['Press_Start_2P',monospace] pixel-text-shadow">
              LUẬT CHƠI RETRO QUIZ
            </h2>
            <p className="font-['VT323',monospace] text-base text-yellow-200">CHIẾC CẶP / RƯƠNG SỨ MỆNH LỚP HỌC</p>
          </div>
        </div>

        <div className="space-y-3 font-['Be_Vietnam_Pro',sans-serif] text-xs sm:text-sm">
          <div className="p-3 bg-black border-2 border-white/60">
            <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 flex items-center gap-2 mb-1">
              1. RƯƠNG SỨ MỆNH (8 RƯƠNG)
            </h3>
            <p className="text-stone-200 text-xs">
              Mỗi đội chọn 1 rương từ đầu và chưa được mở. Trong 8 rương chứa các hiệu ứng đặc biệt:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2 font-['Press_Start_2P',monospace] text-[8px] text-center">
              <span className="p-1 bg-[#15803d] text-white border border-white">+10 Điểm</span>
              <span className="p-1 bg-[#1d4ed8] text-white border border-white">Nhân đôi (x2)</span>
              <span className="p-1 bg-[#7c3aed] text-white border border-white">Đổi điểm</span>
              <span className="p-1 bg-[#ca8a04] text-black font-bold border border-white">Chia đôi (/2)</span>
              <span className="p-1 bg-[#dc2626] text-white border border-white">Trừ 5 Điểm</span>
              <span className="p-1 bg-[#991b1b] text-white border border-white">Trừ 10 Điểm</span>
              <span className="p-1 bg-[#18181b] text-white border border-white">Về 0 Điểm</span>
              <span className="p-1 bg-[#3f3f46] text-stone-300 border border-white">+0 Điểm</span>
            </div>
          </div>

          <div className="p-3 bg-black border-2 border-white/60">
            <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> 2. THỬ THÁCH (20 CÂU HỎI)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-200 text-xs">
              <li>20 ô số vàng kim (01 đến 20). Điểm và nội dung hoàn toàn ẩn giấu.</li>
              <li>Điểm rải từ 1 đến 5 điểm và duy nhất 1 câu <strong>JACKPOT 10 điểm</strong>.</li>
              <li>Mỗi câu có 10 giây suy nghĩ: Đúng nhận điểm, Sai không có điểm.</li>
            </ul>
          </div>

          <div className="p-3 bg-black border-2 border-white/60">
            <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-yellow-300" /> 3. ĐẤU GIÁ (MUA BÁN RƯƠNG)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-200 text-xs">
              <li>Đội điểm thấp nhất đàm phán trước.</li>
              <li>BTC đưa ra mức giá mua lại rương (tối đa 8 điểm).</li>
              <li>Đội có 10 giây chọn: <strong>BÁN</strong> (nhận điểm an toàn) hoặc <strong>GIỮ</strong> (chờ mở).</li>
            </ul>
          </div>

          <div className="p-3 bg-black border-2 border-white/60">
            <h3 className="font-['Press_Start_2P',monospace] text-[10px] text-yellow-300 flex items-center gap-2 mb-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-300" /> 4. MỞ RƯƠNG & XẾP HẠNG
            </h3>
            <p className="text-stone-200 text-xs">
              Mở những rương còn lại để áp dụng hiệu ứng và tìm ra đội vô địch chung cuộc 🏆!
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 pixel-tile-gold font-['Press_Start_2P',monospace] text-[9px] font-black cursor-pointer"
          >
            ĐÃ HIỂU LUẬT CHƠI
          </button>
        </div>
      </div>
    </div>
  );
};
