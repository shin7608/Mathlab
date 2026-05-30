import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface QuantumPrimeProps {
  onSuccess: (code: string) => void;
  savedAnswer?: string;
}

export default function QuantumPrimePuzzle({ onSuccess, savedAnswer = "" }: QuantumPrimeProps) {
  const [target, setTarget] = useState<number>(1235);
  const [factors, setFactors] = useState<number[]>([]);
  const [customInput, setCustomInput] = useState<string>("");
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>(savedAnswer || "");

  const sumOfFactors = factors.reduce((sum, val) => sum + val, 0);
  const isStabilized = target === 1;

  // Expected answer: 5 + 13 + 19 = 37.
  const isPasswordCorrect = parseInt(passwordInput) === 37;

  useEffect(() => {
    if (isPasswordCorrect) {
      onSuccess("37");
    } else {
      onSuccess("");
    }
  }, [passwordInput, isPasswordCorrect]);

  const handleShootPrime = (primeNum: number) => {
    audio.playClick();
    
    // Check if truly a prime (simple check for the interactive grid primes)
    const isPrime = (n: number) => {
      if (n <= 1) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    };

    if (!isPrime(primeNum)) {
      audio.playFailure();
      setFeedback({ text: `🚫 ${primeNum}은(는) 소수가 아닙니다. 소수 주파수만 선택 가능합니다.`, error: true });
      return;
    }

    if (target % primeNum === 0) {
      // Correct split!
      audio.playUnlock();
      const nextTarget = target / primeNum;
      
      const newFactors = [...factors, primeNum];
      setFactors(newFactors);
      setTarget(nextTarget);
      setFeedback({ text: `⚡ 빔 방출! 주파수 분할에 성공했습니다. (남은 가치: ${nextTarget})`, error: false });
      
      if (nextTarget === 1) {
        audio.playSuccess();
        // Automatically suggest answer helper
        setFeedback({ text: "🎉 주파수가 1로 안정화되었습니다! 구출한 모든 원 소수들의 합을 입력창에 등록하세요.", error: false });
      }
    } else {
      // Wrong divisor
      audio.playFailure();
      setFeedback({ text: `⚠️ 주파수 ${target}은(는) 소수 ${primeNum}(으)로 나누어 떨어지지 않아 빔이 반사되었습니다!`, error: true });
    }
  };

  const handleCustomShoot = () => {
    const num = parseInt(customInput);
    if (isNaN(num)) return;
    handleShootPrime(num);
    setCustomInput("");
  };

  const handleReset = () => {
    audio.playDigitalClick();
    setTarget(1235);
    setFactors([]);
    setFeedback({ text: "소인수분해 주파수 안정기가 1235Hz로 초기화되었습니다.", error: false });
  };

  // Recommended primes list for clicking
  const commonPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-amber-500 font-mono text-sm tracking-wider mb-5 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isStabilized ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-ping'}`}></span>
        [SYS] QUANTUM PRIME WAVE DEEP DECRYPTOR
      </h3>

      {/* Interactive Laser Chamber */}
      <div className="relative w-full bg-slate-950 p-5 rounded-2xl border border-slate-950/85 mb-5 flex flex-col items-center overflow-hidden min-h-[180px] justify-between">
        
        {/* Particle/Energy background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04),transparent_70%)]" />

        {/* Dynamic target displays */}
        <div className="z-10 text-center flex flex-col items-center mt-2.5">
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">현재 공명 주파수</span>
          <div className={`mt-1 font-mono text-4xl font-extrabold tracking-wider transition-all duration-300 ${
            isStabilized 
              ? 'text-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
              : 'text-amber-500'
          }`}>
            {target} <span className="text-xs font-medium text-slate-500">Hz</span>
          </div>
        </div>

        {/* Extracted fragments list */}
        <div className="z-10 w-full px-4 text-center mt-4">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">추출 및 검출 보관된 소인수 배열 G</span>
          <div className="flex flex-wrap justify-center gap-2.5 mt-2 min-h-[36px]">
            {factors.length === 0 ? (
              <span className="text-xs text-slate-600 font-mono italic flex items-center">[ 비어 있음 - 분해 빔을 발사하세요 ]</span>
            ) : (
              factors.map((val, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-1 bg-amber-950/30 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 rounded-lg shadow-md flex items-center gap-1 animate-[bounce_0.2s_ease-out]"
                >
                  <span className="text-[9px] text-amber-500/50">×</span>
                  {val}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic sum info */}
        {factors.length > 0 && (
          <div className="z-10 mt-3 flex items-center justify-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-900/50">
            <span>검출 소수 총합:</span>
            <span className="text-amber-400 font-black">{factors.join(' + ')} = {sumOfFactors}</span>
          </div>
        )}
      </div>

      {/* Laser strike ammo list */}
      <div className="w-full space-y-4">
        {/* Ammo container */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-950">
          <div className="text-xs text-slate-500 font-mono tracking-wider uppercase mb-2.5 text-center">양자 소인수분해 주입 장전 소수</div>
          <div className="grid grid-cols-5 gap-2 select-none">
            {commonPrimes.map((prime) => {
              const usedInCurrent = target === 1;
              return (
                <button
                  id={`btn-shoot-${prime}`}
                  key={prime}
                  type="button"
                  disabled={usedInCurrent}
                  onClick={() => handleShootPrime(prime)}
                  className={`py-2 rounded-lg font-mono text-xs font-extrabold border transition-all active:scale-95 ${
                    usedInCurrent 
                      ? 'bg-slate-950 text-slate-800 border-slate-900 cursor-not-allowed'
                      : 'bg-slate-900 text-amber-400 border-slate-800 hover:border-amber-500/30 hover:bg-slate-850'
                  }`}
                >
                  {prime}
                </button>
              );
            })}
          </div>

          {/* Custom prime entry beam */}
          <div className="mt-3 flex gap-2">
            <input
              id="custom-prime-input"
              type="text"
              pattern="[0-9]*"
              value={customInput}
              disabled={isStabilized}
              onChange={(e) => setCustomInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="기타 소수 직접 타격..."
              className="flex-1 px-3 py-1.5 font-mono text-xs bg-slate-950 border border-slate-800/80 rounded-lg text-amber-400 placeholder-slate-700 focus:outline-none focus:border-amber-500/40"
            />
            <button
              id="custom-prime-shoot"
              type="button"
              disabled={isStabilized || !customInput}
              onClick={handleCustomShoot}
              className="px-4 py-1.5 bg-amber-950/40 text-amber-400 border border-amber-500/30 rounded-lg font-mono text-xs font-bold hover:bg-amber-900/30 transition-colors disabled:opacity-40"
            >
              빔 전송
            </button>
            <button
              id="btn-re-stabilize"
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg font-sans text-xs hover:text-white transition-colors"
            >
              재부팅
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className={`text-xs px-3.5 py-2.5 rounded-lg border text-center leading-relaxed font-sans transition-all animate-none ${
            feedback.error 
              ? 'bg-rose-950/30 text-rose-400 border-rose-500/20' 
              : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'
          }`}>
            {feedback.text}
          </div>
        )}

        {/* Final code verification keypad drawer */}
        <div className="w-full p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col items-center">
          <label htmlFor="final-prime-passcode" className="text-xs text-slate-400 font-sans tracking-wide mb-3 text-center">
            🔬 안정화된 금고 최종 합계 비밀번호 입력 (Sum)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="final-prime-passcode"
              type="text"
              pattern="[0-9]*"
              value={passwordInput}
              onChange={(e) => {
                audio.playDigitalClick();
                setPasswordInput(e.target.value.replace(/[^0-9]/g, ''));
              }}
              placeholder="합계 계산..."
              className="w-40 h-11 text-center font-mono text-xl font-black bg-slate-900 text-amber-500 placeholder-slate-700 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
            />
            <div className={`px-3.5 py-2.5 rounded-lg border text-xs font-mono tracking-widest uppercase font-bold ${
              isPasswordCorrect 
                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {isPasswordCorrect ? "DECRYPT OK" : "LOCK ACTIVE"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
