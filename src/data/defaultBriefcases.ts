import { Briefcase, BriefcaseEffectType } from '../types';

export const INITIAL_BRIEFCASE_EFFECTS: {
  effect: BriefcaseEffectType;
  label: string;
  description: string;
}[] = [
  { effect: '+10', label: '+10 Điểm', description: 'Cộng thêm 10 điểm vào quỹ điểm hiện tại!' },
  { effect: 'x2', label: 'Nhân Đôi (x2)', description: 'Số điểm hiện tại của đội được nhân gấp đôi!' },
  { effect: 'swap', label: 'Đổi Điểm', description: 'Được quyền chọn hoán đổi điểm với bất kỳ đội nào!' },
  { effect: '/2', label: 'Chia Đôi (/2)', description: 'Số điểm hiện tại của đội bị chia 2 (làm tròn lên)!' },
  { effect: '-5', label: '-5 Điểm', description: 'Bị trừ đi 5 điểm!' },
  { effect: '-10', label: '-10 Điểm', description: 'Bị trừ đi 10 điểm!' },
  { effect: 'zero', label: 'Mất Trắng (Về 0)', description: 'Mất toàn bộ điểm số, về mức 0 điểm!' },
  { effect: 'none', label: 'Không Có Gì (+0)', description: 'Bảo toàn số điểm hiện tại, không có gì thay đổi!' },
];

export function generateShuffledBriefcases(): Briefcase[] {
  // Shuffle the 8 effects randomly into briefcases 1..8
  const shuffledEffects = [...INITIAL_BRIEFCASE_EFFECTS].sort(() => Math.random() - 0.5);

  return shuffledEffects.map((item, index) => ({
    id: index + 1,
    effect: item.effect,
    label: item.label,
    description: item.description,
    chosenByTeamId: null,
    isOpened: false,
    isSold: false,
  }));
}
