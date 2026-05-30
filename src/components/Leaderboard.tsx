import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Clock, Medal, Trash2 } from 'lucide-react';
import { audio } from '../utils/audio';

interface LeaderboardProps {
  onBack?: () => void;
  highlightName?: string;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: '에미 뇌터 (Emmy Noether)', score: 4850, timeUsed: 312, date: '2026-05-15' },
  { id: '2', name: '알란 튜링 (Alan Turing)', score: 4580, timeUsed: 360, date: '2026-05-20' },
  { id: '3', name: '가우스 (C. F. Gauss)', score: 4320, timeUsed: 420, date: '2026-05-25' },
];

export default function Leaderboard({ onBack, highlightName }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('math_escaperoom_leaderboard');
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries(DEFAULT_LEADERBOARD);
      }
    } else {
      localStorage.setItem('math_escaperoom_leaderboard', JSON.stringify(DEFAULT_LEADERBOARD));
      setEntries(DEFAULT_LEADERBOARD);
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}분 ${s < 10 ? '0' : ''}${s}초`;
  };

  const handleClear = () => {
    if (window.confirm('기록 보관소의 레코드를 모두 영구 삭제하시겠습니까? (기본 벤치마크는 복구됩니다)')) {
      audio.playDigitalClick();
      localStorage.setItem('math_escaperoom_leaderboard', JSON.stringify(DEFAULT_LEADERBOARD));
      setEntries(DEFAULT_LEADERBOARD);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl relative select-none">
      <div className="text-center mb-8">
        <Trophy className="mx-auto text-amber-500 w-12 h-12 stroke-[1.5] animate-pulse mb-3" />
        <h2 className="text-2xl font-sans font-black text-white tracking-tight">비밀 연구소 최정예 연구원 명단</h2>
        <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">Lab Hall of Fame & Intelligence Marks</p>
      </div>

      <div className="overflow-hidden border border-slate-800/80 rounded-2xl bg-slate-950/60 mb-6 shadow-inner">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-slate-950 text-slate-500 font-semibold font-mono text-[10px] uppercase tracking-wider border-b border-slate-900">
              <th className="py-3 px-4">순위</th>
              <th className="py-3 px-4">이름 (Agent Name)</th>
              <th className="py-3 px-4">최종 복합 점수</th>
              <th className="py-3 px-4 flex items-center gap-1"><Clock size={12} /> 탈출 소요 시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {entries
              .sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)
              .map((entry, index) => {
                const isHighlight = highlightName && entry.name === highlightName;
                const rank = index + 1;
                
                return (
                  <tr 
                    key={entry.id} 
                    className={`transition-colors text-slate-300 font-medium ${
                      isHighlight 
                        ? 'bg-amber-950/20 text-amber-300 font-semibold border-y border-amber-500/20' 
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-4 px-4 font-mono font-bold">
                      {rank === 1 ? (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Medal size={14} className="fill-yellow-400/20" /> 1st
                        </span>
                      ) : rank === 2 ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Medal size={14} className="fill-slate-400/20" /> 2nd
                        </span>
                      ) : rank === 3 ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Medal size={14} className="fill-amber-600/20" /> 3rd
                        </span>
                      ) : (
                        <span className="text-slate-500 pl-1">{rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {entry.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-400 font-bold">
                      {entry.score.toLocaleString()}점
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">
                      {formatTime(entry.timeUsed)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        {onBack && (
          <button
            id="leaderboard-back-btn"
            type="button"
            onClick={() => { audio.playDigitalClick(); onBack(); }}
            className="px-5 py-2 rounded-xl bg-slate-950 font-sans text-xs font-bold text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition"
          >
            메인 입구로 귀환
          </button>
        )}

        <button
          id="btn-clear-leaderboard"
          type="button"
          onClick={handleClear}
          title="기록 소거"
          className="p-2 rounded-lg bg-slate-950 text-slate-600 hover:text-rose-400 border border-slate-900 hover:border-rose-950 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
export function saveLeaderboardRecord(name: string, score: number, timeUsed: number) {
  const raw = localStorage.getItem('math_escaperoom_leaderboard');
  let current: LeaderboardEntry[] = [];
  if (raw) {
    try {
      current = JSON.parse(raw);
    } catch {
      current = DEFAULT_LEADERBOARD;
    }
  } else {
    current = [...DEFAULT_LEADERBOARD];
  }

  // Deduplicate name if user runs multiple times
  const cleaned = current.filter(e => e.name !== name);

  const newEntry: LeaderboardEntry = {
    id: Date.now().toString(),
    name,
    score,
    timeUsed,
    date: new Date().toISOString().split('T')[0]
  };

  const updated = [...cleaned, newEntry]
    .sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)
    .slice(0, 10); // Keep top 10

  localStorage.setItem('math_escaperoom_leaderboard', JSON.stringify(updated));
}
