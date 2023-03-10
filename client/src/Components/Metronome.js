import React, { useEffect, useContext, useCallback, useRef } from "react";
import "../styles/Metronome.css";
import ChangeMeter from "./ChangeMeter";
import TempoControls from "./TempoControls";
import ToneSelector from "./ToneSelector";

import Practice from "./Practice";
import BottomControls from "./BottomControls";
import { AppContext } from "../contexts/AppContext";

function Metronome({ savedState, isChanging, user }) {
  const {
    bpm,
    setBpm,
    bpmRef,
    isPlaying,
    setIsPlaying,
    isStopping,
    timerId,
    setTimerId,
    timeSignature,
    setTimeSignature,
    downBeat,
    subdivide,
    mainBeat,
    key,
    tone,
    countIn,
    numMeasures,
    repeat,
    tempoInc,
    tempoPractice,
    sectionPractice,
    startClick,
    stopClick,
    metronomeLoad,
  } = useContext(AppContext);

  const save = async (title) => {
    if (user !== undefined) {
      const token = await user.getIdToken();
      const settings = {
        bpm,
        timeSignature,
        downBeat,
        subdivide,
        mainBeat,
        key,
        tone,
        countIn,
        numMeasures,
        repeat,
        tempoInc,
        sectionPractice,
        tempoPractice,
        title,
      };
      // save settings to db
    }
  };

  const restart = () => {
    if (isPlaying) {
      isStopping.current = true;
      clearInterval(timerId);

      setIsPlaying(false);
      setTimerId(null);
      if (tempoPractice) {
        setBpm(bpmRef.current);
      }
    }

    startClick();
  };

  // Memoize the startStop function with useCallback
  const startStop = useCallback(() => {
    if (isPlaying) {
      // stopping
      stopClick();
    } else {
      // Stops playing incase there is an interval running
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      startClick();
    }
  }, [
    isPlaying,
    timerId,
    timeSignature,
    downBeat,
    tone,
    key,
    subdivide,
    mainBeat,
    countIn,
    sectionPractice,
    numMeasures,
    repeat,
    tempoInc,
    tempoPractice,
  ]);

  // Adds start/stop with space bar press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        // Space key
        startStop();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [startStop]);

  // updates to new selected time signature
  useEffect(() => {
    if (isPlaying) {
      restart();
    }
  }, [
    timeSignature,
    downBeat,
    tone,
    key,
    subdivide,
    mainBeat,
    countIn,
    sectionPractice,
    numMeasures,
    repeat,
    tempoInc,
    tempoPractice,
  ]);

  useEffect(() => {
    if (isChanging.current) {
      if (savedState.current.bpm !== undefined) {
        setBpm(savedState.current.bpm);
        setTimeSignature(savedState.current.timeSignature);
      }
      isChanging.current = false;
    }
    return () => {
      if (isChanging.current) {
        savedState.current = Object.assign({}, savedState.current, {
          bpm,
          timeSignature,
        });
      }
    };
  }, [bpm, timeSignature]);

  return (
    <div className="metronome-body">
      <h2>Metronome</h2>
      <div id="sections">
        <div id="left-col">
          <TempoControls startStop={startStop} />
          <ToneSelector />
        </div>
        <ChangeMeter />
      </div>
      <Practice />
      <BottomControls startStop={startStop} />
    </div>
  );
}

export default Metronome;
