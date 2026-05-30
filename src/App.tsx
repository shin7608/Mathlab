import React, { useState } from 'react';
import { audio } from './utils/audio';
import { GRADES } from './data';

// Import Screen Views
import IntroScreen from './components/IntroScreen';
import MainGame from './components/MainGame';
import Leaderboard from './components/Leaderboard';

// Icons
import { Award, Compass, RefreshCw, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

type ScreenState = 'INTRO' | 'RUNNING' | 'LEADERBOARD' | 'OUTRO';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('INTRO');
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setScreen('RUNNING');
  };

  const handleGameComplete = (score: number, time: number) => {
    setFinalScore(score);
    setTotalTime(time);
    setScreen('OUTRO');
  };

  const handleResetToHome = () => {
    audio.playUnlock();
    setScreen('INTRO');
  };

  // Compute final rank badge based on total score
  const getGradeInfo = (score: number) => {
    const matched = GRADES.find((g) => score >= g.minScore);
    return matched || GRADES[GRADES.length - 1];
  };

  const grade = getGradeInfo(finalScore);

  const formatMinSec = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}분 ${sec < 10 ? '0' : ''}${sec}초`;
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,rgba(15,23,42,0.6),rgba(2,6,23,1))] text-slate-100 font-sans flex items-center justify-center p-4">
      
      {/* Visual cyber mesh/grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.15)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main active container view */}
      <div className="w-full relative z-10 animate-[fadeIn_0.5s_ease-out]">
        
        {/* VIEW 1: INTRO FORM */}
        {screen === 'INTRO' && (
          <IntroScreen 
            onStart={handleStartGame} 
            onViewLeaderboard={() => setScreen('LEADERBOARD')} 
          />
        )}

        {/* VIEW 2: LAB SIMULATION */}
        {screen === 'RUNNING' && (
          <MainGame 
            playerName={playerName} 
            onGameComplete={handleGameComplete} 
            onQuit={() => setScreen('INTRO')}
          />
        )}

        {/* VIEW 3: LEADERBOARD CORES */}
        {screen === 'LEADERBOARD' && (
          <Leaderboard 
            onBack={handleResetToHome} 
            highlightName={playerName}
          />
        )}

        {/* VIEW 4: OUTRO / SUCCESS RECOVERY */}
        {screen === 'OUTRO' && (
          <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative select-none text-center">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            
            {/* Animated Badge Header */}
            <div className="inline-flex p-4 rounded-3xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 mb-5 shadow-lg animate-bounce duration-1000">
              <Award className="w-12 h-12 stroke-[1.25]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-sans font-black text-white leading-tight">
              연구소 완전 탈출 성공!
            </h2>
            <p className="text-xs text-slate-400 font-mono tracking-widest mt-1 uppercase">
              Lab Core Decoupled & Researches Saved
            </p>

            {/* Main Stats Ledger */}
            <div className="my-6 bg-slate-950 p-5 rounded-2xl border border-slate-900 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">최종 등급 배정</span>
                <div className="text-xl font-bold font-sans text-yellow-400 flex items-center justify-center gap-1.5">
                  🥇 {grade.title}
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-1 font-sans">
                  {grade.desc}
                </p>
              </div>

              <div className="h-[1px] bg-slate-900 w-full" />

              <div className="grid grid-cols-2 gap-4 text-left font-mono">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">최종 연산 점수</span>
                  <span className="text-lg font-black text-emerald-400 mt-0.5">{finalScore.toLocaleString()}점</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">인공 탈출 기록</span>
                  <span className="text-md font-bold text-white mt-1">{formatMinSec(totalTime)}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6 font-sans">
              천재 요원님! 수학자 X가 은신처 깊숙이 축적해 둔 안전 가치들을 완전히 회수하는 데 성공했습니다. 복합 암호 정보들은 가동 코드와 함께 명예의 전당 보관소에 안전하게 업로드 완료되었습니다.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="outro-btn-leaderboard"
                type="button"
                onClick={() => { audio.playClick(); setScreen('LEADERBOARD'); }}
                className="flex-1 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Trophy size={14} className="text-yellow-500" />
                정예 보관소 확인
              </button>

              <button
                id="outro-btn-restart"
                type="button"
                onClick={handleResetToHome}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl transition shadow-[0_4px_12px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1"
              >
                <RefreshCw size={13} />
                새 요원으로 다시 도전
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative Outer Margin credits */}
      <footer className="absolute bottom-3 text-[10px] font-mono text-slate-600/80 tracking-widest hidden sm:block uppercase">
        MATHEMATICIAN X ESCAPE MISSION DEVICE v2.6.5
      </footer>
    </div>
  );
}
