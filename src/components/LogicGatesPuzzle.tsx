import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface LogicGatesProps {
  onSuccess: (code: string) => void;
  savedAnswer?: string;
}

export default function LogicGatesPuzzle({ onSuccess, savedAnswer = "" }: LogicGatesProps) {
  // Parse saved binary string like "1010"
  const [switches, setSwitches] = useState({
    A: savedAnswer[0] === '1',
    B: savedAnswer[1] === '1',
    C: savedAnswer[2] === '1',
    D: savedAnswer[3] === '1',
  });

  const valA = switches.A ? 1 : 0;
  const valB = switches.B ? 1 : 0;
  const valC = switches.C ? 1 : 0;
  const valD = switches.D ? 1 : 0;

  // Logic Calculations:
  // Gate 1: AND
  const G1 = valA && valB; // A AND B
  // Gate 2: XOR
  const G2 = valC !== valD; // C XOR D (different triggers 1)
  // Final OUT: OR
  const OUT = G1 || G2 ? 1 : 0;

  const currentBinaryString = `${valA}${valB}${valC}${valD}`;

  useEffect(() => {
    // Notify the parent if the logic network is activated (OUT is 1)
    if (OUT === 1) {
      onSuccess(currentBinaryString);
    } else {
      onSuccess("");
    }
  }, [switches, OUT, currentBinaryString]);

  const toggleSwitch = (node: 'A' | 'B' | 'C' | 'D') => {
    audio.playDigitalClick();
    setSwitches((prev) => ({
      ...prev,
      [node]: !prev[node],
    }));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-purple-400 font-mono text-sm tracking-wider mb-5 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${OUT === 1 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-purple-500 animate-pulse'}`}></span>
        [SYS] LOGICAL TRANSISTOR NUCLEUS
      </h3>

      {/* Switches Grid Panel */}
      <div className="grid grid-cols-4 gap-2 w-full mb-6 select-none bg-slate-950 p-3.5 rounded-xl border border-slate-950">
        {(['A', 'B', 'C', 'D'] as const).map((ch) => {
          const isOn = switches[ch];
          return (
            <button
              id={`switch-${ch}`}
              key={ch}
              type="button"
              onClick={() => toggleSwitch(ch)}
              className={`flex flex-col items-center py-2.5 rounded-xl border font-mono transition-all duration-300 ${
                isOn 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold' 
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400'
              }`}
            >
              <span className="text-[10px] uppercase opacity-75">Sw {ch}</span>
              <span className="text-2xl font-black mt-1 leading-none">{isOn ? '1' : '0'}</span>
              <span className="text-[9px] mt-1 px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-sans tracking-wide">
                {isOn ? 'ON' : 'OFF'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Logic Gate Circuit Visualizer */}
      <div className="w-full bg-slate-950/80 p-5 rounded-xl border border-slate-950/85 mb-5 font-mono text-xs text-slate-400 space-y-4">
        {/* Row 1: Gate G1 & G2 calculations */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 text-[11px]">
          {/* Gate 1 (AND) */}
          <div className="flex-1 bg-slate-900 border border-slate-850 p-2.5 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-950 pb-1 mb-1">
              <span>AND GATE (G1)</span>
              <span className="font-extrabold text-[#f59e0b]">AND</span>
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <span>A({valA}) & B({valB}) ➔</span>
              <span className={`font-bold px-1.5 rounded ${G1 ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'}`}>
                G1 = {G1 ? '1 [참]' : '0 [거짓]'}
              </span>
            </div>
          </div>

          {/* Gate 2 (XOR) */}
          <div className="flex-1 bg-slate-900 border border-slate-850 p-2.5 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-950 pb-1 mb-1">
              <span>XOR GATE (G2)</span>
              <span className="font-extrabold text-[#3b82f6]">XOR</span>
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <span>C({valC}) ^ D({valD}) ➔</span>
              <span className={`font-bold px-1.5 rounded ${G2 ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'}`}>
                G2 = {G2 ? '1 [참]' : '0 [거짓]'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic connection lines (SVG) */}
        <div className="hidden sm:flex items-center justify-center py-1">
          <svg className="w-[120px] h-[30px]" viewBox="0 0 120 30">
            {/* G1 line */}
            <path 
              d="M 15,0 L 15,15 L 55,15" 
              fill="none" 
              stroke={G1 ? '#10b981' : '#334155'} 
              strokeWidth="2.5" 
              className="transition-colors duration-300"
            />
            {/* G2 line */}
            <path 
              d="M 105,0 L 105,15 L 65,15" 
              fill="none" 
              stroke={G2 ? '#10b981' : '#334155'} 
              strokeWidth="2.5" 
              className="transition-colors duration-300"
            />
            {/* Center output line */}
            <line 
              x1="60" y1="15" x2="60" y2="30" 
              stroke={OUT === 1 ? '#10b981' : '#334155'} 
              strokeWidth="2.5" 
              className="transition-colors duration-300"
            />
          </svg>
        </div>

        {/* Final output node (OR GATE) */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">OUTPUT RESOLVER (G1 OR G2)</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">최종 회로 충전 상태</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] border border-slate-750 font-bold text-indigo-400 px-1.5 py-0.5 rounded">OR GATE</span>
            <span className={`text-sm px-3 py-1 font-black rounded-lg transition-all duration-300 ${
              OUT === 1 
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                : 'bg-slate-950 text-slate-600 border border-slate-900'
            }`}>
              {OUT === 1 ? 'ACTIVE (1)' : 'STANDBY (0)'}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed text-center font-sans">
        스위치를 켜고 끌 때마다 논리 전위 연산이 역동적으로 변화합니다. AND(동시 참), XOR(두 상태의 어긋남)의 조건을 조율하여 전송 출력을 <span className="text-emerald-400 font-semibold">ACTIVE (1)</span> 상태로 전환하십시오.
      </p>

      {/* Binary string tracker */}
      <div className="mt-4 w-full bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono">가용 스위치 암호 상태 (ABCD):</span>
        <span className="text-lg font-mono font-black tracking-widest text-[#a855f7] bg-slate-950 px-3 py-0.5 rounded border border-slate-850 shadow-inner">
          {currentBinaryString}
        </span>
      </div>
    </div>
  );
}
