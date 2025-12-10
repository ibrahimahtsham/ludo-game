import { useCallback, useRef } from "react";

const hasAudioContext =
  typeof window !== "undefined" &&
  (window.AudioContext || window.webkitAudioContext);

export function useSoundEffects() {
  const ctxRef = useRef(null);

  const getContext = useCallback(() => {
    if (!hasAudioContext) return null;
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  const playSequence = useCallback(
    (steps = []) => {
      const ctx = getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      steps.forEach((step, idx) => {
        const {
          freq = 440,
          duration = 0.12,
          type = "sine",
          gain = 0.18,
          delay,
        } = step;

        const start = now + (delay != null ? delay : idx * 0.06);
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);

        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(gain, start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gainNode).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.05);
      });
    },
    [getContext]
  );

  const playRoll = useCallback(() => {
    playSequence([
      { freq: 160, duration: 0.07, type: "square", gain: 0.14 },
      { freq: 220, duration: 0.08, type: "square", gain: 0.16 },
      { freq: 120, duration: 0.12, type: "triangle", gain: 0.18 },
    ]);
  }, [playSequence]);

  const playMove = useCallback(() => {
    playSequence([
      { freq: 360, duration: 0.08, type: "sine", gain: 0.2 },
      { freq: 280, duration: 0.08, type: "sine", gain: 0.16, delay: 0.08 },
    ]);
  }, [playSequence]);

  const playHome = useCallback(() => {
    playSequence([
      { freq: 520, duration: 0.12, type: "triangle", gain: 0.22 },
      { freq: 680, duration: 0.14, type: "triangle", gain: 0.22, delay: 0.08 },
    ]);
  }, [playSequence]);

  const playWin = useCallback(() => {
    playSequence([
      { freq: 520, duration: 0.12, type: "triangle", gain: 0.22 },
      { freq: 660, duration: 0.12, type: "triangle", gain: 0.22, delay: 0.08 },
      { freq: 820, duration: 0.16, type: "sawtooth", gain: 0.18, delay: 0.16 },
      { freq: 1020, duration: 0.18, type: "sine", gain: 0.16, delay: 0.26 },
    ]);
  }, [playSequence]);

  return {
    playRoll,
    playMove,
    playHome,
    playWin,
  };
}
