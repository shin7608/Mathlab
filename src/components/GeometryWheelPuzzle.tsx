import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

interface GeometryWheelProps {
  onSuccess: (code: string) => void;
  savedAnswer?: string;
}

export default function GeometryWheelPuzzle({ onSuccess, savedAnswer = "" }: GeometryWheelProps) {
  const [selectedShape, setSelectedShape] = useState<'A' | 'B'>('A');
  const [angleDiff, setAngleDiff] = useState<string>(savedAnswer || "");

  // Correct calculation:
  // A (Octagon interior angle) = 135
  // B (Hexagon interior angle) = 120
  // Difference = 15
  const isAngleCorrect = parseInt(angleDiff) === 15;

  useEffect(() => {
    if (isAngleCorrect) {
      onSuccess("15");
    } else {
      onSuccess("");
    }
  }, [angleDiff]);

  const handleInputChange = (text: string) => {
    audio.playDigitalClick();
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 3);
    setAngleDiff(sanitized);
  };

  const incrementAngle = (val: number) => {
    audio.playDigitalClick();
    const current = parseInt(angleDiff) || 0;
    const next = Math.max(0, Math.min(360, current + val));
    setAngleDiff(next.toString());
  };

  // Helper points for drawing polygons
  const getPolygonPoints = (sides: number, radius: number): string => {
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = 125 + radius * Math.cos(angle);
      const y = 125 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-pink-400 font-mono text-sm tracking-wider mb-5 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isAngleCorrect ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-pink-500 animate-pulse'}`}></span>
        [SYS] INTERFEROMETRIC GEOMETRY GRID
      </h3>

      {/* Interactive Polygon Hologram Radar */}
      <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-950 flex flex-col items-center mb-6">
        <div className="relative w-[250px] h-[250px] bg-slate-950 rounded-full border border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
          {/* Circular grid lines */}
          <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-slate-800/60 animate-[spin_55s_linear_infinite]" />
          <div className="absolute w-[150px] h-[150px] rounded-full border border-slate-800/40" />
          <div className="absolute w-[80px] h-[80px] rounded-full border border-dashed border-slate-900" />
          
          {/* Axis lines */}
          <div className="absolute inset-x-0 h-[1px] bg-slate-900/50" />
          <div className="absolute inset-y-0 w-[1px] bg-slate-900/50" />

          {/* Laser grids blocking (shatter animation/color change) */}
          <div className={`absolute inset-x-0 h-1 md:h-1.5 transition-all duration-300 ${
            isAngleCorrect 
              ? 'bg-emerald-500/10 shadow-none' 
              : 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
          }`} style={{ top: '35%' }} />
          <div className={`absolute inset-y-0 w-1 md:w-1.5 transition-all duration-300 ${
            isAngleCorrect 
              ? 'bg-emerald-500/10 shadow-none' 
              : 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
          }`} style={{ left: '65%' }} />

          {/* SVG shapes */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Deflector arc sweep */}
            {selectedShape === 'A' && (
              <path 
                d="M 125,55 A 70,70 0 0,1 195,125" 
                fill="none" 
                stroke="#f472b6" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            )}
            {selectedShape === 'B' && (
              <path 
                d="M 125,55 A 70,70 0 0,1 185.6,159.9" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            )}

            {/* Octagon Layer (Pink) */}
            <polygon
              points={getPolygonPoints(8, 70)}
              fill="none"
              stroke="#f472b6"
              strokeWidth={selectedShape === 'A' ? '3' : '1'}
              strokeOpacity={selectedShape === 'A' ? '1.0' : '0.2'}
              className="transition-all duration-300"
            />

            {/* Hexagon Layer (Cyan) */}
            <polygon
              points={getPolygonPoints(6, 70)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={selectedShape === 'B' ? '3' : '1'}
              strokeOpacity={selectedShape === 'B' ? '1.0' : '0.2'}
              className="transition-all duration-300"
            />
          </svg>

          {/* Readout label inside radar */}
          <div className="absolute bottom-4 bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-full backdrop-blur-sm text-[10px] font-mono text-slate-400">
            {selectedShape === 'A' ? "OCTAGON CORE: Active" : "HEXAGON CORE: Active"}
          </div>

          <div className="absolute top-4 left-4 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-pink-400">
            {selectedShape === 'A' ? "A = 135˚" : "B = 120˚"}
          </div>
        </div>

        {/* Core selector triggers */}
        <div className="flex gap-2.5 mt-4 w-full justify-center">
          <button
            id="shape-select-octagon"
            type="button"
            onClick={() => { audio.playClick(); setSelectedShape('A'); }}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedShape === 'A' 
                ? 'bg-pink-950/40 text-pink-400 border-pink-500/40 shadow-[0_0_8px_rgba(244,114,182,0.15)]' 
                : 'bg-slate-900 text-slate-500 border-slate-800/80 hover:text-slate-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            정팔각형 분석기 [A]
          </button>
          
          <button
            id="shape-select-hexagon"
            type="button"
            onClick={() => { audio.playClick(); setSelectedShape('B'); }}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedShape === 'B' 
                ? 'bg-sky-950/40 text-sky-400 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.15)]' 
                : 'bg-slate-900 text-slate-500 border-slate-800/80 hover:text-slate-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            정육각형 분석기 [B]
          </button>
        </div>
      </div>

      {/* Control Knob Encoder */}
      <div className="w-full p-4 rounded-xl border border-slate-850 bg-slate-950/40 flex flex-col items-center">
        <label htmlFor="angle-diff-input" className="text-xs text-slate-400 tracking-wider font-sans mb-3 text-center">
          안전 조율 위상 편차 각도 조정 (A - B)
        </label>
        
        <div className="flex items-center gap-4">
          <button
            id="btn-deg-dec-10"
            type="button"
            onClick={() => incrementAngle(-10)}
            className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold hover:bg-slate-800 active:scale-95 transition-all"
          >
            -10
          </button>
          <button
            id="btn-deg-dec-1"
            type="button"
            onClick={() => incrementAngle(-1)}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold hover:bg-slate-800 active:scale-95 transition-all"
          >
            -1
          </button>

          <div className="relative">
            <input
              id="angle-diff-input"
              type="text"
              pattern="[0-9]*"
              value={angleDiff}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0"
              className="w-24 h-12 text-center font-mono text-2xl font-black bg-slate-950 text-pink-400 placeholder-pink-900 border border-pink-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
            />
            <span className="absolute top-1.5 right-3.5 font-mono text-sm text-pink-500/60 font-semibold">˚</span>
          </div>

          <button
            id="btn-deg-inc-1"
            type="button"
            onClick={() => incrementAngle(1)}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold hover:bg-slate-800 active:scale-95 transition-all"
          >
            +1
          </button>
          <button
            id="btn-deg-inc-10"
            type="button"
            onClick={() => incrementAngle(10)}
            className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold hover:bg-slate-800 active:scale-95 transition-all"
          >
            +10
          </button>
        </div>

        {/* Decouple laser state alert */}
        <div className={`mt-5 text-center font-mono text-xs tracking-widest px-4 py-1.5 rounded-full border ${
          isAngleCorrect 
            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 font-semibold' 
            : 'bg-rose-950/20 text-rose-500 border-rose-500/10'
        }`}>
          {isAngleCorrect ? "▶ LASER BLOCKADE HIGH-PASS GRANTED" : "▷ LASER GRIDACTIVE: INTERFERENCE REQUIRED"}
        </div>
      </div>
    </div>
  );
}
