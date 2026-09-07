import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

// Global state to persist metronome across component mounts
let globalAudioContext = null;
let globalTimerId = null;
let globalNextNoteTime = 0;
let globalBeat = 0;
let globalIsPlaying = false;
let globalTempo = 120;
let globalTimeSignature = { beats: 4, noteValue: 4 };
let globalSound = 'click';
let globalListeners = [];

const notifyListeners = () => {
  globalListeners.forEach(fn => fn());
};

// Tempo presets
const tempoPresets = [
  { bpm: 10, name: 'Grave' },
  { bpm: 46, name: 'Largo' },
  { bpm: 52, name: 'Lento' },
  { bpm: 56, name: 'Larghetto' },
  { bpm: 60, name: 'Adagio' },
  { bpm: 66, name: 'Adagietto' },
  { bpm: 72, name: 'Andante' },
  { bpm: 80, name: 'Andantino' },
  { bpm: 88, name: 'Maestoso' },
  { bpm: 96, name: 'Moderato' },
  { bpm: 108, name: 'Allegretto' },
  { bpm: 120, name: 'Animato' },
  { bpm: 132, name: 'Allegro' },
  { bpm: 160, name: 'Vivace' },
  { bpm: 184, name: 'Presto' },
  { bpm: 192, name: 'Vivacissimo' },
  { bpm: 208, name: 'Prestissimo' },
];

const getTempoName = (bpm) => {
  // Find closest preset
  let closest = tempoPresets[0];
  let minDiff = Math.abs(bpm - tempoPresets[0].bpm);
  
  for (const preset of tempoPresets) {
    const diff = Math.abs(bpm - preset.bpm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = preset;
    }
  }
  return closest.name;
};

const Metronome = ({ isOpen, onClose, buttonRef }) => {
  const [, forceUpdate] = useState({});
  const [currentBeat, setCurrentBeat] = useState(0);
  
  const sounds = [
    { id: 'click', name: 'Click', freq1: 1000, freq2: 800 },
    { id: 'wood', name: 'Wood', freq1: 400, freq2: 300 },
    { id: 'beep', name: 'Beep', freq1: 880, freq2: 660 },
    { id: 'tick', name: 'Tick', freq1: 1500, freq2: 1200 },
  ];

  const timeSignatures = [
    { beats: 2, noteValue: 4, label: '2/4' },
    { beats: 3, noteValue: 4, label: '3/4' },
    { beats: 4, noteValue: 4, label: '4/4' },
    { beats: 5, noteValue: 8, label: '5/8' },
    { beats: 6, noteValue: 8, label: '6/8' },
  ];

  // Subscribe to global state changes
  useEffect(() => {
    const update = () => forceUpdate({});
    globalListeners.push(update);
    return () => {
      globalListeners = globalListeners.filter(fn => fn !== update);
    };
  }, []);

  const playClick = useCallback((isAccent) => {
    if (!globalAudioContext) return;
    
    const ctx = globalAudioContext;
    const currentSound = sounds.find(s => s.id === globalSound) || sounds[0];
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = isAccent ? currentSound.freq1 : currentSound.freq2;
    osc.type = globalSound === 'beep' ? 'sine' : 'square';
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const scheduler = useCallback(() => {
    const secondsPerBeat = 60.0 / globalTempo;
    
    while (globalNextNoteTime < globalAudioContext.currentTime + 0.1) {
      const isAccent = globalBeat === 0;
      playClick(isAccent);
      
      setCurrentBeat(globalBeat);
      globalBeat = (globalBeat + 1) % globalTimeSignature.beats;
      globalNextNoteTime += secondsPerBeat;
    }
    
    globalTimerId = setTimeout(scheduler, 25);
  }, [playClick]);

  const startMetronome = useCallback(() => {
    if (!globalAudioContext) {
      globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (globalAudioContext.state === 'suspended') {
      globalAudioContext.resume();
    }
    
    globalBeat = 0;
    setCurrentBeat(0);
    globalNextNoteTime = globalAudioContext.currentTime;
    globalIsPlaying = true;
    notifyListeners();
    scheduler();
  }, [scheduler]);

  const stopMetronome = useCallback(() => {
    if (globalTimerId) {
      clearTimeout(globalTimerId);
      globalTimerId = null;
    }
    globalIsPlaying = false;
    setCurrentBeat(0);
    globalBeat = 0;
    notifyListeners();
  }, []);

  const togglePlay = () => {
    if (globalIsPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const setTempo = (value) => {
    globalTempo = value;
    notifyListeners();
  };

  const goToNextPreset = () => {
    const currentIndex = tempoPresets.findIndex(p => p.bpm >= globalTempo);
    if (currentIndex < tempoPresets.length - 1) {
      const nextIndex = globalTempo === tempoPresets[currentIndex]?.bpm ? currentIndex + 1 : currentIndex;
      if (nextIndex < tempoPresets.length) {
        setTempo(tempoPresets[nextIndex].bpm);
      }
    }
  };

  const goToPrevPreset = () => {
    const currentIndex = tempoPresets.findIndex(p => p.bpm >= globalTempo);
    if (currentIndex > 0) {
      setTempo(tempoPresets[currentIndex - 1].bpm);
    } else if (currentIndex === 0 && globalTempo > tempoPresets[0].bpm) {
      setTempo(tempoPresets[0].bpm);
    }
  };

  const setTimeSignature = (ts) => {
    globalTimeSignature = ts;
    globalBeat = 0;
    notifyListeners();
  };

  const setSound = (s) => {
    globalSound = s;
    notifyListeners();
  };

  // Calculate position near button
  const getPosition = () => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      };
    }
    return { top: 200, left: window.innerWidth / 2 };
  };

  if (!isOpen) return null;

  const position = getPosition();

  return (
    <>
      {/* Invisible backdrop to close on click outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Context menu style dropdown */}
      <div 
        className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Compact Content - Horizontal layout with vertical slider */}
        <div className="p-4 flex gap-4">
          {/* Left side - controls */}
          <div className="space-y-3 w-48">
            {/* Beat Indicator & Play Button Row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: globalTimeSignature.beats }).map((_, i) => (
                  <div
                    key={`beat-${i}`}
                    className={`w-3 h-3 rounded-full transition-all duration-75 ${
                      globalIsPlaying && currentBeat === i
                        ? i === 0 
                          ? 'bg-indigo-600 scale-125' 
                          : 'bg-indigo-400 scale-110'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={togglePlay}
                size="sm"
                className={`h-8 w-8 p-0 rounded-full ${
                  globalIsPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {globalIsPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>
            </div>

            {/* Time Signature */}
            <div className="space-y-2">
              <span className="text-xs text-slate-500">Time</span>
              <div className="grid grid-cols-5 gap-1">
                {timeSignatures.map((ts) => (
                  <button
                    key={ts.label}
                    onClick={() => setTimeSignature({ beats: ts.beats, noteValue: ts.noteValue })}
                    className={`py-1 px-1 rounded text-xs font-medium transition-all ${
                      globalTimeSignature.beats === ts.beats && globalTimeSignature.noteValue === ts.noteValue
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ts.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="space-y-2">
              <span className="text-xs text-slate-500">Sound</span>
              <div className="grid grid-cols-4 gap-1">
                {sounds.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSound(s.id)}
                    className={`py-1 px-2 rounded text-xs font-medium transition-all ${
                      globalSound === s.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - vertical tempo slider with presets */}
          <div className="flex flex-col items-center gap-1 pl-3 border-l border-slate-100">
            {/* Up arrow for next preset */}
            <button
              onClick={goToNextPreset}
              className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-indigo-600"
              title="Next tempo"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            
            {/* Tempo value */}
            <span className="text-lg font-bold text-indigo-600">{globalTempo}</span>
            
            {/* Tempo name */}
            <span className="text-[10px] text-slate-500 font-medium">{getTempoName(globalTempo)}</span>
            
            {/* Vertical slider */}
            <div className="h-28 flex items-center my-1">
              <Slider
                value={[globalTempo]}
                onValueChange={(value) => setTempo(value[0])}
                min={10}
                max={220}
                step={1}
                orientation="vertical"
                className="h-full [&_[data-orientation=vertical]>.bg-primary]:bg-slate-300"
              />
            </div>
            
            {/* Down arrow for previous preset */}
            <button
              onClick={goToPrevPreset}
              className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-indigo-600"
              title="Previous tempo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <span className="text-[10px] text-slate-400">BPM</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Metronome;

