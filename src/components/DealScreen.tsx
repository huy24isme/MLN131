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
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center relative z-10 select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <span className="font-['VT323',monospace] text-lg text-yellow-300 block mb-1 uppercase drop-shadow-[1px_1px_0px_#000] tracking-wide">
          STAGE 3: TRADE & NEGOTIATION
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-['VT323',monospace] pixel-text-shadow tracking-wider">
          ĐẤU GIÁ RƯƠNG
        </h2>
        <p className="font-['VT323',monospace] text-xl text-yellow-200 mt-1 max-w-lg mx-auto">
          Đội điểm thấp nhất đàm phán trước. BTC ra giá mua rương (tối đa 8đ). Chọn: BÁN hay GIỮ RƯƠNG?
        </p>
      </div>

      {!isAllDealsDone && currentTeam ? (
        <div className="w-full pixel-box p-5 sm:p-6">
          {/* Active Team Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black">
            <div>
              <span className="font-['VT323',monospace] text-lg text-yellow-300 uppercase block tracking-wide">
                ĐANG ĐÀM PHÁN ({currentIndex + 1}/{sortedTeamIds.length}):
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xl sm:text-2xl font-['VT323',monospace] font-bold px-3 py-1 text-white bg-gradient-to-r ${currentTeam.color} border-2 border-black shadow-[2px_2px_0px_#000]`}
                >
                  {currentTeam.name}
                </span>
                <span className="font-['VT323',monospace] text-lg text-yellow-300 px-2.5 py-1 bg-black border border-white font-bold">
                  RƯƠNG #{currentTeam.initialBriefcaseId}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-['VT323',monospace] text-lg text-yellow-200 block">
                ĐIỂM HIỆN TẠI:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-yellow-300 font-['VT323',monospace]">
                {currentTeam.score} ĐIỂM
              </div>
            </div>
          </div>

          {/* Offer Setter (BTC Controls) */}
          <div className="py-4 border-b-2 border-black">
            <div className="flex items-center justify-between mb-2">
              <label className="font-['VT323',monospace] text-xl text-white flex items-center gap-1.5 tracking-wide">
                <DollarSign className="w-5 h-5 text-yellow-300" /> BTC RA GIÁ MUA RƯƠNG:
              </label>
              <span className="font-['VT323',monospace] text-3xl font-black text-yellow-300 pixel-text-shadow">
                +{offerPoints} ĐIỂM
              </span>
            </div>

            {/* Quick Offer Selector 1 to 8 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setOfferPoints(pts)}
                  className={`py-1.5 font-['VT323',monospace] text-xl font-bold cursor-pointer ${
                    offerPoints === pts
                      ? 'pixel-tile-gold font-black scale-105'
                      : 'pixel-btn-blue'
                  }`}
                >
                  +{pts}
                </button>
              ))}
            </div>
          </div>

          {/* 10s Timer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 flex items-center justify-center font-['VT323',monospace] text-2xl font-black border-2 border-black shadow-[2px_2px_0px_#000] ${
                  decisionTimeLeft <= 3
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-yellow-300 text-black'
                }`}
              >
                {decisionTimeLeft}
              </div>
              <div>
                <span className="font-['VT323',monospace] text-base text-yellow-300 uppercase block tracking-wide">
                  10 GIÂY QUYẾT ĐỊNH
                </span>
                <span className="font-['VT323',monospace] text-lg text-yellow-200">
                  {isTimerRunning ? 'Đang đếm...' : 'Sẵn sàng chốt'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={() => {
                    if (decisionTimeLeft === 0) setDecisionTimeLeft(10);
                    setIsTimerRunning(true);
                  }}
                  className="px-4 py-2 font-['VT323',monospace] text-lg pixel-btn-green cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white inline mr-1" /> BẮT ĐẦU 10S
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(false)}
                  className="px-4 py-2 font-['VT323',monospace] text-lg pixel-tile-gold cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-black inline mr-1" /> TẠM DỪNG
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setDecisionTimeLeft(10);
                }}
                aria-label="Đặt lại thời gian"
                className="p-2 pixel-btn-blue cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SELL */}
            <button
              type="button"
              onClick={() => handleDecision(true)}
              className="p-4 pixel-btn-green cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <span className="font-['VT323',monospace] text-base text-yellow-200 tracking-wide">
                LỰA CHỌN AN TOÀN
              </span>
              <span className="font-['VT323',monospace] text-2xl sm:text-3xl font-black mt-1">
                BÁN RƯƠNG (+{offerPoints}Đ)
              </span>
              <span className="font-['VT323',monospace] text-lg text-yellow-100 mt-1">
                Nhận điểm ngay từ BTC, khóa rương
              </span>
            </button>

            {/* KEEP */}
            <button
              type="button"
              onClick={() => handleDecision(false)}
              className="p-4 pixel-btn-blue cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <span className="font-['VT323',monospace] text-base text-yellow-200 tracking-wide">
                CHẤP NHẬN MẠO HIỂM
              </span>
              <span className="font-['VT323',monospace] text-2xl sm:text-3xl font-black mt-1">
                GIỮ RƯƠNG ĐỂ MỞ
              </span>
              <span className="font-['VT323',monospace] text-lg text-yellow-100 mt-1">
                Chờ đợi x2, +10 hoặc đổi điểm lật kèo
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* All Deals Finished */
        <div className="w-full pixel-box p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-black border-2 border-yellow-300 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-yellow-300" />
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-yellow-300 font-['VT323',monospace] pixel-text-shadow tracking-wide">
            HOÀN TẤT ĐẤU GIÁ!
          </h3>
          <p className="font-['VT323',monospace] text-xl text-yellow-200 mt-2 max-w-md mx-auto">
            Tất cả các đội đã chốt phương án. Giờ là lúc giải phong ấn các Rương Sứ Mệnh!
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                sound.playSuspense();
                onFinishDeals();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 font-['VT323',monospace] text-xl sm:text-2xl pixel-tile-gold font-black cursor-pointer"
            >
              VÀO VÒNG MỞ RƯƠNG
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Recap Status Grid */}
      <div className="w-full mt-4 p-3.5 pixel-box">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {teams.map((team) => {
            const hasDecided =
              team.hasSoldBriefcase ||
              sortedTeamIds.indexOf(team.id) < currentIndex;
            return (
              <div
                key={team.id}
                className={`p-2 border-2 border-black flex items-center justify-between text-xs ${
                  hasDecided
                    ? team.hasSoldBriefcase
                      ? 'bg-[#15803d] text-white shadow-[2px_2px_0px_#000]'
                      : 'bg-[#1d4ed8] text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-[#5e1210] text-stone-400'
                }`}
              >
                <span className="font-['VT323',monospace] text-lg">{team.name}</span>
                <span className="font-['VT323',monospace] text-base font-bold">
                  {hasDecided
                    ? team.hasSoldBriefcase
                      ? `BÁN (+${team.dealOfferPoints})`
                      : 'GIỮ'
                    : 'CHỜ'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
