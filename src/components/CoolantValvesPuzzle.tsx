import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface CoolantValvesProps {
  onSuccess: (code: string) => void;
  savedAnswer?: string; // product key (e.g., 320)
}

export default function CoolantValvesPuzzle({ onSuccess, savedAnswer = "" }: CoolantValvesProps) {
  // Precompile initial values (safe defaults)
  const [valX, setValX] = useState<number>(0); // Target: 4
  const [valY, setValY] = useState<number>(0); // Target: 10
  const [valZ, setValZ] = useState<number>(0); // Target: 8

  const eq1 = valX + valY; // target: 14
  const eq2 = valY + valZ; // target: 18
  const eq3 = valZ + valX; // target: 12

  const eq1Ok = eq1 === 14;
  const eq2Ok = eq2 === 18;
  const eq3Ok = eq3 === 12;

  const totalProduct = valX * valY * valZ;
  const isFullyNormalized = eq1Ok && eq2Ok && eq3Ok;

  useEffect(() => {
    if (isFullyNormalized) {
      onSuccess(totalProduct.toString());
    } else {
      onSuccess("");
    }
  }, [valX, valY, valZ, isFullyNormalized]);

  const handleSliderChange = (pipe: 'X' | 'Y' | 'Z', value: number) => {
    audio.playDigitalClick();
    if (pipe === 'X') setValX(value);
    if (pipe === 'Y') setValY(value);
    if (pipe === 'Z') setValZ(value);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-cyan-400 font-mono text-sm tracking-wider mb-6 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isFullyNormalized ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 animate-ping'}`}></span>
        [SYS] THERMAL REGULATOR COIL CALIBRATOR
      </h3>

      {/* Pipes Visualization Grid */}
      <div className="grid grid-cols-3 gap-4 w-full mb-8 select-none bg-slate-950/50 p-4 rounded-xl border border-slate-950">
        {/* Pipe Alpha (X) */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs text-cyan-400 font-bold mb-2">Alpha Loop (x)</span>
          <div className="relative w-12 h-36 bg-slate-900 border border-slate-850 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div 
              style={{ height: `${(valX / 20) * 100}%` }}
              className="w-full rounded-full bg-gradient-to-t from-cyan-600/80 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-150"
            />
            {/* Value overlay */}
            <div className="absolute inset-0 flex items-center justify-center font-mono text-base font-black text-white mix-blend-difference">
              {valX}
            </div>
          </div>
          <input
            id="valves-x-slider"
            type="range"
            min="0"
            max="20"
            value={valX}
            onChange={(e) => handleSliderChange('X', parseInt(e.target.value))}
            className="w-full mt-4 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Pipe Beta (Y) */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs text-cyan-400 font-bold mb-2">Beta Loop (y)</span>
          <div className="relative w-12 h-36 bg-slate-900 border border-slate-850 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div 
              style={{ height: `${(valY / 20) * 100}%` }}
              className="w-full rounded-full bg-gradient-to-t from-cyan-600/80 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-150"
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-base font-black text-white mix-blend-difference">
              {valY}
            </div>
          </div>
          <input
            id="valves-y-slider"
            type="range"
            min="0"
            max="20"
            value={valY}
            onChange={(e) => handleSliderChange('Y', parseInt(e.target.value))}
            className="w-full mt-4 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Pipe Gamma (Z) */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs text-cyan-400 font-bold mb-2">Gamma Loop (z)</span>
          <div className="relative w-12 h-36 bg-slate-900 border border-slate-850 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div 
              style={{ height: `${(valZ / 20) * 100}%` }}
              className="w-full rounded-full bg-gradient-to-t from-cyan-600/80 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-150"
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-base font-black text-white mix-blend-difference">
              {valZ}
            </div>
          </div>
          <input
            id="valves-z-slider"
            type="range"
            min="0"
            max="20"
            value={valZ}
            onChange={(e) => handleSliderChange('Z', parseInt(e.target.value))}
            className="w-full mt-4 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Equations Calibration Console */}
      <div className="w-full space-y-2.5 bg-slate-950/80 p-4 rounded-xl border border-slate-900 font-mono text-sm leading-relaxed text-slate-300">
        <div className="text-xs text-slate-500 tracking-wider uppercase mb-1">상호 대조 냉각계 루프 모니터</div>
        
        {/* Loop 1: alpha + beta */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900">
          <span>대조 루프 A (x + y):</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{valX} + {valY} = {eq1}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${eq1Ok ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-400 border border-rose-500/10'}`}>
              {eq1Ok ? "NORMAL (14)" : `ERROR (Req: 14)`}
            </span>
          </div>
        </div>

        {/* Loop 2: beta + gamma */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900">
          <span>대조 루프 B (y + z):</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{valY} + {valZ} = {eq2}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${eq2Ok ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-400 border border-rose-500/10'}`}>
              {eq2Ok ? "NORMAL (18)" : `ERROR (Req: 18)`}
            </span>
          </div>
        </div>

        {/* Loop 3: gamma + alpha */}
        <div className="flex items-center justify-between py-1">
          <span>대조 루프 C (z + x):</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{valZ} + {valX} = {eq3}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${eq3Ok ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-400 border border-rose-500/10'}`}>
              {eq3Ok ? "NORMAL (12)" : `ERROR (Req: 12)`}
            </span>
          </div>
        </div>
      </div>

      {/* Product calculation result */}
      <div className="mt-5 w-full bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono">가 에너지 전도 수치 (x · y · z):</span>
        <span className={`text-xl font-mono font-black tracking-widest px-3 py-1 rounded border shadow-inner transition-colors duration-300 ${
          isFullyNormalized 
            ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/40' 
            : 'text-slate-600 bg-slate-950 border-slate-850'
        }`}>
          {totalProduct === 0 ? "???" : totalProduct}
        </span>
      </div>
    </div>
  );
}
