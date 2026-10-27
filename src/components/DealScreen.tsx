import React, { useState, useEffect } from 'react';
import { Team, Briefcase } from '../types';
import { DollarSign, ShieldCheck, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface DealScreenProps {
  teams: Team[];
  briefcases: Briefcase[];
  onTeamDealDecision: (teamId: number, sold: boolean, offerPoints: number) => void;
  onFinishDeals: () => void;
}

export const DealScreen: React.FC<DealScreenProps> = ({
  teams,
  briefcases,
  onTeamDealDecision,
  onFinishDeals,
}) => {
  // Sort teams ascending by score (lowest score decides first)
  const [sortedTeamIds] = useState<number[]>(() => {
    return [...teams].sort((a, b) => a.score - b.score).map((t) => t.id);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [offerPoints, setOfferPoints] = useState<number>(5);
  const [decisionTimeLeft, setDecisionTimeLeft] = useState<number>(10);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const currentTeamId = sortedTeamIds[currentIndex];
  const currentTeam = teams.find((t) => t.id === currentTeamId);
  const isAllDealsDone = currentIndex >= sortedTeamIds.length;

  useEffect(() => {
    if (currentTeam) {
      setDecisionTimeLeft(10);
      setIsTimerRunning(false);
      setOfferPoints(Math.min(8, Math.max(2, Math.round(currentTeam.score / 2) || 4)));
    }
  }, [currentIndex, currentTeam]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && decisionTimeLeft > 0) {
      interval = setInterval(() => {
        setDecisionTimeLeft((prev) => {
          if (prev <= 1) {
            sound.playTimesUp();
            setIsTimerRunning(false);
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
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, decisionTimeLeft]);

  const handleDecision = (sold: boolean) => {
    if (!currentTeam) return;

    if (sold) {
      sound.playCashDeal();
    } else {
      sound.playSuspense();
    }

    onTeamDealDecision(currentTeam.id, sold, sold ? offerPoints : 0);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center relative z-10">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest font-['Cinzel',serif] text-amber-300 font-bold">
          GIAI ĐOẠN ĐẤU GIÁ
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-amber-400 font-['Cinzel',serif] mt-1 drop-shadow-md">
          MUA BÁN RƯƠNG SỨ MỆNH
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1 max-w-xl mx-auto">
          Đội điểm thấp nhất đàm phán trước. BTC ra giá mua rương (tối đa 8đ). Có 10 giây để chọn: BÁN hay GIỮ RƯƠNG?
        </p>
      </div>

      {!isAllDealsDone && currentTeam ? (
        <div className="w-full bg-black/60 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Active Team Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
            <div>
              <span className="text-xs uppercase font-['Cinzel',serif] text-amber-300/80 font-bold block">
                Đang thương lượng ({currentIndex + 1}/{sortedTeamIds.length}):
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-lg sm:text-2xl font-black px-4 py-1.5 rounded-xl text-white bg-gradient-to-r ${currentTeam.color} shadow`}
                >
                  {currentTeam.name}
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-300 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                  Rương #{currentTeam.initialBriefcaseId}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-bold text-amber-200/60 block">
                Điểm thử thách hiện tại:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-['Cinzel',serif]">
                {currentTeam.score}đ
              </div>
            </div>
          </div>

          {/* Offer Setter (BTC Controls) */}
          <div className="py-6 border-b border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm sm:text-base font-extrabold text-amber-200 flex items-center gap-2 font-['Cinzel',serif]">
                <DollarSign className="w-5 h-5 text-amber-400" /> BTC Ra Giá Mua Rương (Tối đa 8 điểm):
              </label>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-['Cinzel',serif]">
                +{offerPoints} ĐIỂM
              </span>
            </div>

            {/* Quick Offer Selector 1 to 8 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((pts) => (
                <button
                  key={pts}
                  onClick={() => setOfferPoints(pts)}
                  className={`py-2 rounded-xl text-sm font-black transition cursor-pointer font-['Cinzel',serif] ${
                    offerPoints === pts
                      ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-200'
                      : 'bg-black/50 hover:bg-amber-950/60 text-amber-200 border border-amber-500/30'
                  }`}
                >
                  +{pts}đ
                </button>
              ))}
            </div>
          </div>

          {/* 10s Timer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-amber-500/20">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl transition shadow ${
                  decisionTimeLeft <= 3
                    ? 'bg-rose-600 text-white animate-danger-glow'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {decisionTimeLeft}s
              </div>
              <div>
                <span className="text-xs font-bold text-amber-200/80 uppercase tracking-wider block">
                  10 Giây Suy Nghĩ & Quyết Định
                </span>
                <span className="text-sm font-semibold text-amber-300">
                  {isTimerRunning ? 'Đang đếm...' : 'Sẵn sàng chốt'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <button
                  onClick={() => {
                    if (decisionTimeLeft === 0) setDecisionTimeLeft(10);
                    setIsTimerRunning(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Bắt đầu 10s
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-white" /> Tạm dừng
                </button>
              )}
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setDecisionTimeLeft(10);
                }}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 cursor-pointer border border-amber-500/30"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SELL */}
            <button
              onClick={() => handleDecision(true)}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl transition transform hover:scale-102 cursor-pointer flex flex-col items-center justify-center text-center border border-emerald-400/40"
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
                Lựa chọn an toàn
              </span>
              <span className="text-xl sm:text-2xl font-black mt-1 font-['Cinzel',serif]">
                BÁN RƯƠNG (+{offerPoints}Đ)
              </span>
              <span className="text-xs text-emerald-100/80 mt-1">
                Nhận điểm ngay từ BTC, khóa rương
              </span>
            </button>

            {/* KEEP */}
            <button
              onClick={() => handleDecision(false)}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white shadow-xl transition transform hover:scale-102 cursor-pointer flex flex-col items-center justify-center text-center border border-amber-400/40"
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-200">
                Chấp nhận mạo hiểm
              </span>
              <span className="text-xl sm:text-2xl font-black mt-1 font-['Cinzel',serif]">
                GIỮ RƯƠNG ĐỂ MỞ
              </span>
              <span className="text-xs text-amber-100/80 mt-1">
                Chờ đợi x2, +10 điểm hoặc hoán đổi điểm lật ngược tình thế
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* All Deals Finished Screen */
        <div className="w-full bg-black/60 border-2 border-amber-500/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-300 font-['Cinzel',serif]">
            HOÀN TẤT GIAI ĐOẠN ĐẤU GIÁ!
          </h3>
          <p className="text-amber-200/80 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Tất cả các đội đã chốt phương án. Giờ là lúc hồi hộp nhất: Khám phá bí mật trong từng Rương Sứ Mệnh!
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                sound.playSuspense();
                onFinishDeals();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer font-['Cinzel',serif]"
            >
              TIẾN VÀO VÒNG MỞ RƯƠNG
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Recap Status */}
      <div className="w-full mt-6 p-4 rounded-2xl bg-black/40 border border-amber-500/20 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {teams.map((team) => {
            const hasDecided =
              team.hasSoldBriefcase ||
              sortedTeamIds.indexOf(team.id) < currentIndex;
            return (
              <div
                key={team.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  hasDecided
                    ? team.hasSoldBriefcase
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-black/30 border-amber-500/10 text-stone-500'
                }`}
              >
                <span>{team.name}</span>
                <span>
                  {hasDecided
                    ? team.hasSoldBriefcase
                      ? `ĐÃ BÁN (+${team.dealOfferPoints}đ)`
                      : 'GIỮ RƯƠNG'
                    : 'Chưa đàm phán'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
