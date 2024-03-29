import { AudioContext } from "standardized-audio-context";
import metronomePlayer from "./metronome/metronomePlayer";

const createMetronomeUtils = (metronomeSettings) => {
  const {
    isStopping,
    tempoPractice,
    sectionPractice,
    setBpm,
    bpm,
    originalBpm,
    audioCtx,
    stopCheck,
    tempoInc,
    timerId,
  } = metronomeSettings;

  const stopSection = (startTime) => {
    if (startTime > audioCtx.current.currentTime) {
      const interval = setInterval(() => {
        if (audioCtx.current.currentTime > startTime + 0.2) {
          stopClick();
          stopCheck(timerId);
          clearInterval(interval);
        }
      }, 100);
    } else {
      stopClick();
      stopCheck(timerId);
    }
  };

  metronomeSettings.stopSection = stopSection;

  const { play } = metronomePlayer(metronomeSettings);

  const stopClick = () => {
    if (sectionPractice && tempoPractice && tempoInc > 0) {
      setBpm(originalBpm.current);
    }
    isStopping.current = true;
  };

  const startClick = async () => {
    audioCtx.current = new AudioContext();

    let start = audioCtx.current.currentTime + 0.1;
    originalBpm.current = bpm;
    if (start === undefined || start < 0) return;
    play(start);
  };
  return { startClick, stopClick };
};

export default createMetronomeUtils;
