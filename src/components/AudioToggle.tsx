import React, { useState } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { audio } from '../utils/audio';

export default function AudioToggle() {
  const [sfxOn, setSfxOn] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);

  const handleToggleSfx = () => {
    const nextState = !sfxOn;
    setSfxOn(nextState);
    audio.toggleSound(nextState);
    audio.playClick();

    // If sfx turns off, ambient must also turn off
    if (!nextState) {
      setAmbientOn(false);
      audio.setAmbientEnabled(false);
    }
  };

  const handleToggleAmbient = () => {
    if (!sfxOn) {
      // Must enable sfx master first
      audio.toggleSound(true);
      setSfxOn(true);
    }
    const nextState = !ambientOn;
    setAmbientOn(nextState);
    audio.setAmbientEnabled(nextState);
    audio.playDigitalClick();
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 px-3 rounded-full shadow-lg backdrop-blur-sm">
      {/* Master Audio Controller */}
      <button
        id="btn-toggle-sfx"
        type="button"
        onClick={handleToggleSfx}
        title={sfxOn ? "효과음 끄기" : "효과음 켜기"}
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
          sfxOn 
            ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/30' 
            : 'bg-slate-950 text-slate-500 hover:text-slate-400'
        }`}
      >
        {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {/* Lab Machine Hum Loop */}
      <button
        id="btn-toggle-ambient"
        type="button"
        onClick={handleToggleAmbient}
        title={ambientOn ? "배경 미세 공명음 끄기" : "배경 미세 공명음 켜기"}
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
          ambientOn 
            ? 'bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/30 shadow-[0_0_8px_rgba(34,211,238,0.25)]' 
            : 'bg-slate-1000/20 text-slate-600 hover:text-slate-500'
        }`}
      >
        <Radio size={16} className={ambientOn ? 'animate-pulse' : ''} />
      </button>

      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline select-none pr-1">
        {sfxOn 
          ? (ambientOn ? 'AUDIO: MAX' : 'AUDIO: SFX') 
          : 'AUDIO: MUTE'
        }
      </span>
    </div>
  );
}
