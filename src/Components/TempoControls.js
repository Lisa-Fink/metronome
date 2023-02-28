import React, { useRef } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

function TempoControls({ bpm, setBpm, isPlaying, startStop, paused }) {
  const MAX_BPM = 240;
  const MIN_BPM = 40;

  const mouseDownIntervalId = useRef(null);

  const incrementBPM = () => {
    setBpm((prevBpm) => {
      if (prevBpm === MAX_BPM) {
        clearInterval(mouseDownIntervalId.current);
        return prevBpm;
      } else {
        const newBpm = prevBpm + 1;
        return newBpm;
      }
    });
  };

  const decrementBPM = () => {
    setBpm((prevBpm) => {
      if (prevBpm === MIN_BPM) {
        clearInterval(mouseDownIntervalId.current);
        return prevBpm;
      } else {
        return prevBpm - 1;
      }
    });
  };

  const handleMouseDownUpArrow = () => {
    if (bpm < MAX_BPM) {
      // Stop the audio when the mouse button is held down
      if (isPlaying) {
        startStop();
        paused.current = true;
      }
      const interval = setInterval(() => {
        incrementBPM();
      }, 100);
      mouseDownIntervalId.current = interval;
    }
  };

  const handleMouseDownDownArrow = () => {
    if (bpm > MIN_BPM) {
      // Stop the audio when the mouse button is held down
      if (isPlaying) {
        startStop();
        paused.current = true;
      }
      const interval = setInterval(() => {
        decrementBPM();
      }, 100);
      mouseDownIntervalId.current = interval;
    }
  };

  const stopBpmChange = () => {
    if (paused.current) {
      startStop();
      paused.current = false;
    }
    clearInterval(mouseDownIntervalId.current);
  };

  const handleBpmSliderChange = (event) => {
    const newBpm = event.target.value;
    setBpm(parseInt(newBpm));
    if (isPlaying) {
      startStop();
      paused.current = true;
    }
  };

  const handleBpmChange = (e) => {
    setBpm(e.target.value);
  };
  return (
    <div id="tempo">
      <label>
        <h3>Tempo (BPM):</h3>

        <div className="flex-row">
          <input
            disabled
            id="tempo-input"
            type="number"
            value={bpm}
            onChange={handleBpmChange}
            onBlur={(e) => {
              if (e.target.value < MIN_BPM) {
                setBpm(MIN_BPM);
              } else if (e.target.value > MAX_BPM) {
                setBpm(MAX_BPM);
              }
            }}
          />
          <div id="tempo-arrows">
            <BiUpArrow
              onMouseDown={handleMouseDownUpArrow}
              onMouseUp={stopBpmChange}
              onMouseLeave={stopBpmChange}
            />
            <BiDownArrow
              onMouseDown={handleMouseDownDownArrow}
              onMouseUp={stopBpmChange}
              onMouseLeave={stopBpmChange}
            />
          </div>
        </div>
        <input
          id="tempo-slider"
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={handleBpmSliderChange}
          onMouseUp={() => {
            if (paused.current) {
              startStop();
              paused.current = false;
            }
          }}
        />
      </label>
    </div>
  );
}

export default TempoControls;
