import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, User, Compass, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface IntroScreenProps {
  onStart: (playerName: string) => void;
  onViewLeaderboard: () => void;
}

export default function IntroScreen({ onStart, onViewLeaderboard }: IntroScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [showLore, setShowLore] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playUnlock();
    const finalName = playerName.trim() || "익명의 요원";
    onStart(finalName);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl relative select-none">
      
      {/* Visual cyber glow card heading */}
      <div className="text-center mb-8 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-950 border border-emerald-500/20 mb-4 shadow-lg">
          <Compass className="w-10 h-10 text-emerald-400 stroke-[1.25] animate-spin-slow" />
        </div>
        <h1 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-white leading-tight">
          수학자 X의 비밀 연구소
        </h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="h-0.5 w-6 bg-emerald-500/40 rounded"></span>
          <span className="text-xs font-mono tracking-widest text-emerald-400 font-extrabold uppercase bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            방탈출 프로젝트 (STAGE SYSTEM)
          </span>
          <span className="h-0.5 w-6 bg-emerald-500/40 rounded"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Registration Box */}
        <div className="space-y-2">
          <label htmlFor="agent-name" className="text-xs text-slate-400 font-mono tracking-wider flex items-center gap-1.5 uppercase font-bold">
            <User size={13} className="text-emerald-400" />
            분석 요원 지정 (Agent Identification)
          </label>
          <div className="relative">
            <input
              id="agent-name"
              type="text"
              value={playerName}
              onChange={(e) => {
                audio.playDigitalClick();
                setPlayerName(e.target.value.slice(0, 16));
              }}
              placeholder="요원 고유 암호명 입력 (미입력 시: 익명의 요원)"
              className="w-full h-12 pl-11 pr-4 font-sans text-sm rounded-xl bg-slate-950 border border-slate-800/80 text-white placeholder-slate-700/80 focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs select-none">ID:</span>
          </div>
        </div>

        {/* Narrative & Rules expander */}
        <div className="border border-slate-800 bg-slate-950/45 rounded-xl overflow-hidden shadow-sm">
          <button
            id="btn-toggle-lore"
            type="button"
            onClick={() => { audio.playClick(); setShowLore(!showLore); }}
            className="w-full px-4 py-3 bg-slate-950 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              미션 브리핑 및 작동 지침 확인
            </span>
            <span className="text-[10px] text-emerald-500/80 font-mono">
              {showLore ? "CLOSE ▲" : "EXPAND ▼"}
            </span>
          </button>

          {showLore && (
            <div className="p-4 border-t border-slate-900 text-xs text-slate-400 leading-relaxed space-y-3 font-sans animate-[fadeIn_0.2s_ease-out]">
              <p>
                인류 수학 최대의 수수께끼를 해결하기 직전 돌연 실종된 천재 암호학자 <span className="text-slate-200 font-medium">수학자 X</span>. 그가 평생 수집해 온 안전 기하 보고서가 지하 심부 5중 격벽 내에 고립되어 원격 포맷 주기를 대기 중입니다.
              </p>
              <p>
                총 <span className="text-emerald-400 font-bold">5개의 격리실</span>을 거치며 각 수치들을 동역학적으로 연계하여 해결 코드를 이끌어내야 격벽이 차례대로 내려옵니다.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[10.5px] leading-relaxed text-slate-500">
                <div className="text-amber-500 font-extrabold mb-1">■ 가동 제어반 점수 및 타이머 패널</div>
                - 세 가용 격실마다 <span className="text-slate-300">독립된 타이머</span>가 실시간 하락합니다.<br />
                - 기본 득점 포인트 <span className="text-slate-300">1000점</span>에서 1초당 <span className="text-slate-300">2점</span>씩 점수가 차감됩니다.<br />
                - 암호 해독 [힌트 사용] 클릭 시 지연 해부 패널티로 즉시 <span className="text-amber-500 font-bold">-150점</span>이 감소합니다.<br />
                - 오답 입력은 게이트 피드백 과부하로 즉시 <span className="text-rose-400 font-semibold">-50점</span>의 디덕션이 발생합니다.
              </div>
            </div>
          )}
        </div>

        {/* Play interface controllers */}
        <div className="flex gap-3 pt-2">
          {/* View high score */}
          <button
            id="view-records-btn"
            type="button"
            onClick={() => { audio.playClick(); onViewLeaderboard(); }}
            className="px-5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition font-sans text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Trophy size={14} className="text-slate-500" />
            기록 보관소
          </button>

          {/* Core launch */}
          <button
            id="btn-gate-activate"
            type="submit"
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans text-sm font-black tracking-wide shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
          >
            동력 기동 및 연구실 진입 ➔
          </button>
        </div>
      </form>
    </div>
  );
}
