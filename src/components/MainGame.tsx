import React, { useState, useEffect, useRef } from 'react';
import { STAGES, GRADES } from '../data';
import { Stage, StageState } from '../types';
import { audio } from '../utils/audio';
import { saveLeaderboardRecord } from './Leaderboard';

// Import puzzle sub-components
import MagicSquarePuzzle from './MagicSquarePuzzle';
import CoolantValvesPuzzle from './CoolantValvesPuzzle';
import GeometryWheelPuzzle from './GeometryWheelPuzzle';
import LogicGatesPuzzle from './LogicGatesPuzzle';
import QuantumPrimePuzzle from './QuantumPrimePuzzle';
import AudioToggle from './AudioToggle';

// Icons
import { AlertCircle, HelpCircle, Lock, Unlock, ArrowRight, RefreshCw, Zap, ShieldAlert, Award } from 'lucide-react';

interface MainGameProps {
  playerName: string;
  onGameComplete: (finalScore: number, totalTime: number) => void;
  onQuit: () => void;
}

export default function MainGame({ playerName, onGameComplete, onQuit }: MainGameProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const activeStage = STAGES[currentStageIndex];

  // Stage runtime states
  const [stageScore, setStageScore] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(activeStage.timeLimit);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);

  // Tracks cumulative score from PREVIOUS stages
  const [cumulativePreviousScore, setCumulativePreviousScore] = useState(0);
  
  // Total elapsed time across all stages
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);

  // Active answer received from inner interactive gadget
  const [gadgetOutputValue, setGadgetOutputValue] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize stage parameters when index shifts
  useEffect(() => {
    setTimeLeft(activeStage.timeLimit);
    setStageScore(1000);
    setHintsRevealed(0);
    setAttempts(0);
    setGadgetOutputValue("");
    setManualCode("");
    setFeedback(null);
  }, [currentStageIndex]);

  // Stage Clock countdown
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }

        // Tick sounds below 5 seconds
        if (prev <= 6) {
          audio.playChronoTick();
        }

        // Tick down stage score
        setStageScore((score) => Math.max(100, score - 2));
        setTotalTimeUsed((time) => time + 1);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStageIndex]);

  const handleGadgetSuccess = (code: string) => {
    setGadgetOutputValue(code);
  };

  const handleRevealHint = () => {
    if (hintsRevealed >= activeStage.hints.length) return;
    audio.playDigitalClick();
    setHintsRevealed((prev) => prev + 1);
    // Deduct score penalty for hints
    setStageScore((score) => Math.max(100, score - 150));
    setFeedback({
      text: `💡 힌트 조율 성공. (패널티: -150점)`,
      success: false
    });
  };

  const handleUnlockTrigger = () => {
    // 1. Determine correctness targets
    let isCorrect = false;

    // Stage exact code matches
    if (activeStage.id === 1 && (manualCode === "174" || gadgetOutputValue === "174")) isCorrect = true;
    if (activeStage.id === 2 && (manualCode === "320" || gadgetOutputValue === "320")) isCorrect = true;
    if (activeStage.id === 3 && (manualCode === "15" || gadgetOutputValue === "15")) isCorrect = true;
    
    // Stage 4 accepts dynamic switches (OUT=1), gadget reports the binary string if valid
    if (activeStage.id === 4 && gadgetOutputValue !== "") isCorrect = true;

    // Stage 5 exact matches
    if (activeStage.id === 5 && (manualCode === "37" || gadgetOutputValue === "37")) isCorrect = true;

    if (isCorrect) {
      audio.playUnlock();
      audio.playSuccess();
      setFeedback({
        text: `🔓 수치 검증에 성공했습니다! 안전 격벽이 해제됩니다.`,
        success: true
      });

      // Freeze score for this stage and add to cumulative
      const finalStageScore = stageScore;
      const nextCumulative = cumulativePreviousScore + finalStageScore;
      setCumulativePreviousScore(nextCumulative);

      // Transition animation
      setTimeout(() => {
        if (currentStageIndex < STAGES.length - 1) {
          setCurrentStageIndex((prev) => prev + 1);
        } else {
          // Final escape! Record on leaderboard
          saveLeaderboardRecord(playerName, nextCumulative, totalTimeUsed);
          onGameComplete(nextCumulative, totalTimeUsed);
        }
      }, 1500);

    } else {
      audio.playFailure();
      setAttempts((prev) => prev + 1);
      setStageScore((score) => Math.max(100, score - 50));
      setFeedback({
        text: `❌ 기하 회로 공명이 일치하지 않습니다. 오답 피드백 발생! (오답 패널티: -50점)`,
        success: false
      });
    }
  };

  const handleStageRecharge = () => {
    audio.playUnlock();
    setTimeLeft(120); // give 2 minutes
    setStageScore((score) => Math.max(100, score - 250)); // heavy penalty
    setFeedback({
      text: "⚡ 메인 그리드에서 예비 안전 전압을 끌어왔습니다. 타이머가 추가되었습니다! (-250점)",
      success: false
    });
    // Restart interval
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        if (prev <= 6) audio.playChronoTick();
        setStageScore((score) => Math.max(100, score - 2));
        setTotalTimeUsed((time) => time + 1);
        return prev - 1;
      });
    }, 1000);
  };

  const formatMinSec = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentTotalScoreEstimator = cumulativePreviousScore + stageScore;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 select-none bg-slate-950 p-4 md:p-6 rounded-3xl border border-slate-900 shadow-2xl">
      
      {/* 🚀 Segment 1: Header Dashboard */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-black uppercase flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ACTIVE SYSTEM AGENT
            </span>
            <div className="text-lg font-sans font-black text-white">{playerName} 요원</div>
          </div>
        </div>

        {/* Level Progression Indicator Nodes */}
        <div className="flex items-center gap-2">
          {STAGES.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;
            return (
              <div key={stg.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : isActive 
                        ? 'bg-amber-950/40 text-amber-500 border-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                  title={stg.roomName}
                >
                  {isCompleted ? "✓" : stg.id}
                </div>
                {idx < STAGES.length - 1 && (
                  <div className={`h-[1px] w-4 border-t ${isCompleted ? 'border-emerald-500/40' : 'border-slate-800'}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timer, Live Score and Sound Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-5 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
            {/* Countdown widget */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">시간제한 (Timer)</span>
              <span className={`font-mono text-xl font-bold tracking-widest leading-none mt-1 ${
                timeLeft === 0 
                  ? 'text-rose-500 font-black animate-pulse'
                  : timeLeft < 30 
                    ? 'text-rose-400 font-extrabold animate-pulse' 
                    : 'text-amber-400'
              }`}>
                {formatMinSec(timeLeft)}
              </span>
            </div>

            {/* Score estimate widget */}
            <div className="flex flex-col items-right text-right border-l border-slate-800 pl-4">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">복합 점수 (Score)</span>
              <span className="font-mono text-xl font-black text-emerald-400 leading-none mt-1">
                {currentTotalScoreEstimator.toLocaleString()}
              </span>
            </div>
          </div>

          <AudioToggle />
        </div>
      </header>

      {/* 🛑 EXPIRED TIMER MODAL / CALL CARD INLINE */}
      {timeLeft === 0 && (
        <div className="bg-rose-950/20 border border-rose-500/35 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 animate-[shake_0.4s_ease-in-out]">
          <div className="flex items-center gap-3.5">
            <ShieldAlert className="text-rose-500 w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-rose-400 font-sans font-bold text-base">⚠️ 가동 기한 위상 만료 (ENERGY DEPLETED)</h3>
              <p className="text-xs text-rose-300/80 leading-relaxed mt-1">
                방장치 공명 전력이 고갈되었습니다. 예비 축전 전력을 연계하여 현재 구역을 강제 복구(냉각 충전)하거나 영구 탈출을 철회해야 합니다.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              id="btn-recharge-stage"
              type="button"
              onClick={handleStageRecharge}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs font-black tracking-wide shadow-lg transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw size={13} />
              에너지 재충전 (-250점)
            </button>
            <button
              id="btn-quit-room"
              type="button"
              onClick={() => { audio.playClick(); onQuit(); }}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition text-xs font-semibold"
            >
              연구소 퇴거 (Quit)
            </button>
          </div>
        </div>
      )}

      {/* 🚀 Segment 2: Principal Split View Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (Story, Diary, Log, Hints) - Width 5 */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Situation Log & Diary */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#a855f7] bg-purple-950/30 px-2 py-0.5 border border-purple-500/25 rounded">
                G-CHAMBER: {activeStage.roomName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">LEVEL {activeStage.id}</span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-sans font-extrabold text-white leading-tight">
                {activeStage.title}
              </h2>
              <div className="h-0.5 bg-slate-800 rounded w-16" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeStage.description}
            </p>

            {/* Mathematician X Transcript */}
            <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800 shadow-inner">
              <div className="text-[9.5px] text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse"></span>
                수학자 X의 잔류 홀로그램 레코드
              </div>
              <p className="text-xs text-emerald-400/90 leading-relaxed font-mono italic">
                {activeStage.narrative}
              </p>
            </div>

            {/* Mission constraints */}
            <div className="text-xs text-slate-400 bg-slate-950/20 border border-slate-850 p-3 rounded-xl leading-relaxed">
              <span className="text-amber-500 font-bold block mb-0.5">※ 제어실 탈출 연동 임무</span>
              {activeStage.mission}
            </div>
          </div>

          {/* Progressive Hint Decoder Terminal */}
          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
                <HelpCircle size={13} className="text-amber-500" />
                인공지능 힌트 해독반 (PROGRESIVE HINTS)
              </span>
              <span className="text-[10px] font-mono text-slate-600">
                ({hintsRevealed}/{activeStage.hints.length}) REVEALED
              </span>
            </div>

            {hintsRevealed < activeStage.hints.length ? (
              <button
                id="btn-unlock-hint"
                type="button"
                onClick={handleRevealHint}
                disabled={timeLeft === 0}
                className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/20 text-slate-300 hover:text-amber-400 transition font-sans text-xs font-bold leading-none disabled:opacity-40"
              >
                차선 단서 오토 해독 (-150점 포인트 패널티)
              </button>
            ) : (
              <div className="text-[10.5px] text-center font-mono text-slate-600 italic py-2 bg-slate-950/40 rounded border border-slate-900 border-dashed">
                모든 힌트 수치가 복원되었습니다.
              </div>
            )}

            {/* Hint disclosures */}
            {hintsRevealed > 0 && (
              <div className="space-y-2 mt-2">
                {activeStage.hints.slice(0, hintsRevealed).map((hintText, hidx) => (
                  <div 
                    key={hidx} 
                    className="p-3 bg-amber-950/15 border border-amber-500/20 text-xs rounded-xl text-amber-200/90 leading-relaxed font-sans shadow-inner animate-[fadeIn_0.3s_ease]"
                  >
                    <span className="text-amber-400 font-extrabold pr-1">단서 #{hidx + 1}:</span>
                    {hintText}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN (Interactive Puzzle Widget + Keypad Submit) - Width 7 */}
        <main className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Math Widget Container */}
          <div className="relative">
            {activeStage.id === 1 && (
              <MagicSquarePuzzle 
                onSuccess={handleGadgetSuccess} 
                savedAnswer={gadgetOutputValue}
              />
            )}
            {activeStage.id === 2 && (
              <CoolantValvesPuzzle 
                onSuccess={handleGadgetSuccess} 
                savedAnswer={gadgetOutputValue}
              />
            )}
            {activeStage.id === 3 && (
              <GeometryWheelPuzzle 
                onSuccess={handleGadgetSuccess} 
                savedAnswer={gadgetOutputValue}
              />
            )}
            {activeStage.id === 4 && (
              <LogicGatesPuzzle 
                onSuccess={handleGadgetSuccess} 
                savedAnswer={gadgetOutputValue}
              />
            )}
            {activeStage.id === 5 && (
              <QuantumPrimePuzzle 
                onSuccess={handleGadgetSuccess} 
                savedAnswer={gadgetOutputValue}
              />
            )}
          </div>

          {/* Answer Code Delivery Console (Standard Layout) */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
            
            {/* Display feedback alerts */}
            {feedback && (
              <div className={`p-3.5 rounded-xl border font-sans text-xs leading-relaxed text-center transition-all animate-none ${
                feedback.success 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 font-bold' 
                  : 'bg-rose-950/25 text-rose-400 border-rose-500/25'
              }`}>
                {feedback.text}
              </div>
            )}

            {/* Validation row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">전자 암호 안전 장치</span>
                <span className="text-xs text-slate-300">위 수치 보정 장치에서 계산력을 활성화하여 밸브를 파열하세요.</span>
              </div>

              {/* Input for stages with manual values (1, 2, 3, 5) */}
              {activeStage.id !== 4 && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <input
                    id="manual-code-input"
                    type="text"
                    pattern="[0-9]*"
                    value={manualCode || gadgetOutputValue}
                    onChange={(e) => {
                      audio.playDigitalClick();
                      setManualCode(e.target.value.replace(/[^0-9]/g, ''));
                    }}
                    placeholder="수동 코드 입력..."
                    className="w-36 h-11 text-center font-mono text-lg bg-slate-950 border border-slate-850 rounded-xl text-amber-400 focus:outline-none focus:ring-1.5 focus:ring-amber-500 placeholder-slate-705 shadow-inner"
                  />
                </div>
              )}
            </div>

            {/* Large trigger button */}
            <button
              id="btn-submit-verify-room"
              type="button"
              disabled={timeLeft === 0 || (activeStage.id !== 4 && !manualCode && !gadgetOutputValue)}
              onClick={handleUnlockTrigger}
              className={`w-full h-12 rounded-xl font-sans text-sm font-black tracking-wide flex items-center justify-center gap-2 border transition-all ${
                timeLeft === 0 
                  ? 'bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed shadow-none'
                  : 'bg-slate-950 text-white border-emerald-500/25 hover:border-emerald-500/40 hover:text-emerald-400 shadow-md hover:shadow-lg active:scale-[0.99]'
              }`}
            >
              <Unlock size={14} className="text-emerald-500" />
              보정 수치 해독 및 전도 검증 수행
            </button>
          </div>

          {/* Abort button */}
          <div className="flex justify-start">
            <button
              id="main-btn-abort-game"
              type="button"
              onClick={() => {
                if (window.confirm('현재까지의 탈출 기동 전력을 철회하고 메인 로비로 복귀하시겠습니까? (현재 점수는 수렴되지 않습니다)')) {
                  audio.playClick();
                  onQuit();
                }
              }}
              className="font-sans text-xs text-slate-500 hover:text-rose-400 transition"
            >
              ◀ 연구실 탈출 중단 및 수평 도주
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
