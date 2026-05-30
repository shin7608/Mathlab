import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface MagicSquareProps {
  onSuccess: (code: string) => void;
  savedAnswer?: string;
}

export default function MagicSquarePuzzle({ onSuccess, savedAnswer = "" }: MagicSquareProps) {
  // A = [0, 1], B = [1, 2], C = [2, 0]
  const [valA, setValA] = useState<string>(savedAnswer[0] || "");
  const [valB, setValB] = useState<string>(savedAnswer[1] || "");
  const [valC, setValC] = useState<string>(savedAnswer[2] || "");

  // Grid represented as 2D array:
  // [8, A, 6]
  // [3, 5, B]
  // [C, 9, 2]
  const numA = parseInt(valA) || 0;
  const numB = parseInt(valB) || 0;
  const numC = parseInt(valC) || 0;

  const grid = [
    [8, numA, 6],
    [3, 5, numB],
    [numC, 9, 2]
  ];

  // Calculate sums
  const rowSums = [
    grid[0][0] + grid[0][1] + grid[0][2], // Row 0
    grid[1][0] + grid[1][1] + grid[1][2], // Row 1
    grid[2][0] + grid[2][1] + grid[2][2]  // Row 2
  ];

  const colSums = [
    grid[0][0] + grid[1][0] + grid[2][0], // Col 0
    grid[0][1] + grid[1][1] + grid[2][1], // Col 1
    grid[0][2] + grid[1][2] + grid[2][2]  // Col 2
  ];

  const diagSums = [
    grid[0][0] + grid[1][1] + grid[2][2], // Major Diag
    grid[0][2] + grid[1][1] + grid[2][0]  // Minor Diag
  ];

  const TARGET_SUM = 15;

  const isRowOk = (idx: number) => rowSums[idx] === TARGET_SUM;
  const isColOk = (idx: number) => colSums[idx] === TARGET_SUM;
  const isDiagOk = (idx: number) => diagSums[idx] === TARGET_SUM;

  useEffect(() => {
    // Generate code when all elements are filled
    if (valA && valB && valC) {
      const code = `${valA}${valB}${valC}`;
      onSuccess(code);
    } else {
      onSuccess("");
    }
  }, [valA, valB, valC]);

  const handleInputChange = (char: 'A' | 'B' | 'C', text: string) => {
    audio.playDigitalClick();
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 1);
    if (char === 'A') setValA(sanitized);
    if (char === 'B') setValB(sanitized);
    if (char === 'C') setValC(sanitized);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-emerald-400 font-mono text-sm tracking-wider mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        [SYS] ARCHIVE LOCKPAD MATRIX
      </h3>

      {/* Grid container with indicators */}
      <div className="grid grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-900 w-full select-none">
        {/* Row 1 / Col 1..3 */}
        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">8</div>
        
        {/* Cell A Input */}
        <div className="relative">
          <input
            id="cell-a-input"
            type="text"
            pattern="[0-9]*"
            value={valA}
            onChange={(e) => handleInputChange('A', e.target.value)}
            placeholder="A"
            className="w-full h-14 text-center font-mono text-2xl font-bold bg-amber-950/20 text-amber-400 placeholder-amber-700/60 border border-amber-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.1)] focus:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all"
          />
          <span className="absolute bottom-1 right-2 font-mono text-[9px] text-amber-500/50">A</span>
        </div>

        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">6</div>
        
        {/* Row 1 Sum Indicator */}
        <div className={`flex items-center justify-center gap-1.5 font-mono text-xs rounded-lg px-2 h-14 border ${
          isRowOk(0) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span>Row1:</span>
          <span className="font-bold">{rowSums[0]}</span>
        </div>

        {/* Row 2 / Col 1..3 */}
        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">3</div>
        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">5</div>
        
        {/* Cell B Input */}
        <div className="relative">
          <input
            id="cell-b-input"
            type="text"
            pattern="[0-9]*"
            value={valB}
            onChange={(e) => handleInputChange('B', e.target.value)}
            placeholder="B"
            className="w-full h-14 text-center font-mono text-2xl font-bold bg-amber-950/20 text-amber-400 placeholder-amber-700/60 border border-amber-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.1)] focus:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all"
          />
          <span className="absolute bottom-1 right-2 font-mono text-[9px] text-amber-500/50">B</span>
        </div>

        {/* Row 2 Sum Indicator */}
        <div className={`flex items-center justify-center gap-1.5 font-mono text-xs rounded-lg px-2 h-14 border ${
          isRowOk(1) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span>Row2:</span>
          <span className="font-bold">{rowSums[1]}</span>
        </div>

        {/* Row 3 / Col 1..3 */}
        {/* Cell C Input */}
        <div className="relative">
          <input
            id="cell-c-input"
            type="text"
            pattern="[0-9]*"
            value={valC}
            onChange={(e) => handleInputChange('C', e.target.value)}
            placeholder="C"
            className="w-full h-14 text-center font-mono text-2xl font-bold bg-amber-950/20 text-amber-400 placeholder-amber-700/60 border border-amber-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.1)] focus:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all"
          />
          <span className="absolute bottom-1 right-2 font-mono text-[9px] text-amber-500/50">C</span>
        </div>

        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">9</div>
        <div className="flex items-center justify-center font-mono text-xl text-slate-300 font-bold bg-slate-900/80 border border-slate-800 h-14 rounded-lg shadow-inner">2</div>

        {/* Row 3 Sum Indicator */}
        <div className={`flex items-center justify-center gap-1.5 font-mono text-xs rounded-lg px-2 h-14 border ${
          isRowOk(2) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span>Row3:</span>
          <span className="font-bold">{rowSums[2]}</span>
        </div>

        {/* Column sum feedback row */}
        <div className={`flex flex-col items-center justify-center text-center font-mono text-[10px] rounded-lg py-1 border ${
          isColOk(0) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span className="opacity-75">Col 1</span>
          <span className="text-xs font-bold leading-none mt-0.5">{colSums[0]}</span>
        </div>

        <div className={`flex flex-col items-center justify-center text-center font-mono text-[10px] rounded-lg py-1 border ${
          isColOk(1) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span className="opacity-75">Col 2</span>
          <span className="text-xs font-bold leading-none mt-0.5">{colSums[1]}</span>
        </div>

        <div className={`flex flex-col items-center justify-center text-center font-mono text-[10px] rounded-lg py-1 border ${
          isColOk(2) 
            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-slate-950 text-slate-600 border-slate-900'
        }`}>
          <span className="opacity-75">Col 3</span>
          <span className="text-xs font-bold leading-none mt-0.5">{colSums[2]}</span>
        </div>

        {/* Diagonal sum feedback node */}
        <div className="flex flex-col gap-1 items-stretch justify-center">
          <div className={`flex items-center justify-between text-center font-mono text-[9px] rounded px-1.5 py-0.5 border ${
            isDiagOk(0) 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold border-solid' 
              : 'bg-slate-950 text-slate-600 border-slate-900 border-dashed'
          }`}>
            <span>Diag ↘</span>
            <span className="font-bold">{diagSums[0]}</span>
          </div>
          <div className={`flex items-center justify-between text-center font-mono text-[9px] rounded px-1.5 py-0.5 border ${
            isDiagOk(1) 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 font-semibold border-solid' 
              : 'bg-slate-950 text-slate-600 border-slate-900 border-dashed'
          }`}>
            <span>Diag ↗</span>
            <span className="font-bold">{diagSums[1]}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed text-center font-sans">
        각 입력란에 한 자리 숫자를 넣으면 실시간으로 각 행(Row), 열(Col), 대각선(Diag)의 합이 계산됩니다. 집계 LED가 전부 <span className="text-emerald-400 font-semibold">초록색(합 15)</span>으로 켜지면 3자리 암호인 <span className="text-amber-400 font-semibold">ABC</span>의 성분이 올바르게 수렴됩니다.
      </p>

      {/* Dynamic passcode display */}
      <div className="mt-5 w-full bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono">가동 부품 연산 코드:</span>
        <span className="text-xl font-mono font-black tracking-widest text-amber-400 bg-slate-950 px-3 py-1 rounded border border-slate-800 shadow-inner">
          {valA || "_"} {valB || "_"} {valC || "_"}
        </span>
      </div>
    </div>
  );
}
