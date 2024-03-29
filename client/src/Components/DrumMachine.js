import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import TempoControls from "./TempoControls";
import PlaybackBar from "./PlaybackBar";
import { AppContext } from "../contexts/AppContext";
import { CiEraser, CiEdit } from "react-icons/ci";
import "../styles/DrumMachine.css";
import ChooseInstPopUp from "./PopUps/ChooseInstPopUp";
import UserBar from "./UserBar";
import { UserContext } from "../contexts/UserContext";
import Sequencer from "./DrumMachine/Sequencer";
import RhythmSelector from "./DrumMachine/RhythmSelector";
import CountSelector from "./DrumMachine/CountSelector";

// TODO snap to - the aligns the rhythms to a certain beat like eighth notes or quarter notes etc.

function DrumMachine({ savedState, isChanging }) {
  const {
    isPlaying,
    timeSignature,
    setTimeSignature,
    startDrumMachine,
    stopDrumMachine,
    bpm,
    setBpm,
    measures,
    dMTitle,
    setDMTitle,
    rhythmGrid,
    setRhythmGrid,
    instruments,
    setInstruments,
    rhythmSequence,
    createDMQueryUrl,
    NUM_CELLS_PER_BEAT,
    MAX_INSTRUMENTS,
    isStopped,
    setIsStopped,
    loaded,
    setLoaded,
  } = useContext(AppContext);

  const isTyping = useRef(false);

  const { saveNewDM, saveUpdateDM, userDrumMachines, loadDM, deleteDM } =
    useContext(UserContext);

  const createRhythmGrid = (num_measures = measures) =>
    Array.from({ length: MAX_INSTRUMENTS }, () =>
      Array(NUM_CELLS_PER_BEAT * timeSignature * num_measures).fill(false)
    );

  const [isChooseInstOpen, setIsChooseInstOpen] = useState(false);
  const instrumentIdx = useRef(0);
  const [rhythm, setRhythm] = useState(1);
  const [isEditDelete, setIsEditDelete] = useState(true);

  const [hoverGrid, setHoverGrid] = useState(createRhythmGrid());
  const hoverGridRef = useRef(createRhythmGrid());
  const stopRef = useRef("false");

  useEffect(() => {
    // initialize instruments, rhythm grid, rhythm sequence if not set
    if (!instruments.length) {
      setInstruments(
        Array.from({ length: MAX_INSTRUMENTS }, () => Array(3).fill(undefined))
      );
    }
    if (!rhythmGrid.length) {
      setRhythmGrid(
        Array.from({ length: MAX_INSTRUMENTS }, () =>
          Array(NUM_CELLS_PER_BEAT * timeSignature * measures).fill(false)
        )
      );
    }
    if (!rhythmSequence.current.length) {
      rhythmSequence.current = Array.from({ length: MAX_INSTRUMENTS }, () =>
        Array(NUM_CELLS_PER_BEAT * timeSignature * measures).fill(0)
      );
    }
  }, []);

  useEffect(() => {
    // Finish reset after stop completes
    if (
      isChanging.current === false &&
      stopRef.current === true &&
      isStopped === true &&
      isPlaying === false
    ) {
      setIsStopped(false);
      stopRef.current = false;
      startDrumMachine();
    }
  }, [isStopped, stopRef, isChanging, isPlaying]);

  useEffect(() => {
    // Restarts if a setting was changed or stop if all rhythms were removed
    if (isPlaying && !isChanging.current) {
      if (loaded) {
        setLoaded(false);
      }
      if (rhythmGrid.flat().every((instRhythm) => instRhythm === false)) {
        // Stop if all rhythms are false
        stopDrumMachine();
        return;
      }
      restart();
    }
  }, [timeSignature, measures, rhythmGrid, instruments, dMTitle]);

  useEffect(() => {
    // Restarts if a setting was changed or stop if all rhythms were removed
    if (loaded && isPlaying && !isChanging.current) {
      if (loaded) {
        setLoaded(false);
      }
      if (rhythmGrid.flat().every((instRhythm) => instRhythm === false)) {
        // Stop if all rhythms are false
        stopDrumMachine();
        return;
      }
      restart();
    }
  }, [loaded]);

  // Saves and loads bpm and time signature settings when changing/loading view
  useEffect(() => {
    if (isChanging.current && isChanging.current !== "met") {
      if (savedState.current.bpm !== undefined) {
        setBpm(savedState.current.bpm);
        setTimeSignature(savedState.current.timeSignature);
      }
      isChanging.current = false;
    }
    return () => {
      if (isChanging.current && isChanging.current !== "met") {
        isChanging.current = "met";
        savedState.current = Object.assign({}, savedState.current, {
          bpm,
          timeSignature,
        });
        if (isPlaying) {
          stopDrumMachine();
          stopRef.current = false;
        }
      }
    };
  }, [bpm, timeSignature, isPlaying]);

  const restart = () => {
    if (isPlaying) {
      stopRef.current = true;
      stopDrumMachine();
    }
  };

  const startStop = useCallback(() => {
    if (isPlaying) {
      stopDrumMachine();
    } else {
      startDrumMachine();
    }
  }, [isPlaying, instruments, rhythmSequence, bpm]);
  // Adds start/stop with space bar press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 32 && document.activeElement.nodeName !== "INPUT") {
        // Space key
        startStop();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [startStop]);

  const handleEditDelete = (e) => {
    const val = e.currentTarget.value;
    if (val === "edit" && !isEditDelete) setIsEditDelete(true);
    if (val === "delete" && isEditDelete) setIsEditDelete(false);
  };

  return (
    <div className="metronome-body">
      <UserBar
        view={"Drum Machine"}
        saveNew={saveNewDM}
        saveUpdate={saveUpdateDM}
        loadFunc={loadDM}
        data={userDrumMachines}
        isTyping={isTyping}
        title={dMTitle}
        setTitle={setDMTitle}
        createUrlFunc={createDMQueryUrl}
        deleteFunc={deleteDM}
      />
      <h2>Drum Machine</h2>

      <div className="top">
        <div className="left">
          <TempoControls start={startDrumMachine} />
        </div>
        <CountSelector
          hoverGridRef={hoverGridRef}
          setHoverGrid={setHoverGrid}
          createRhythmGrid={createRhythmGrid}
        />
      </div>
      <div>
        <RhythmSelector rhythm={rhythm} setRhythm={setRhythm} />
        <div>
          {/* edit - delete selection */}
          <button
            className={isEditDelete ? "selected" : ""}
            onClick={handleEditDelete}
            value={"edit"}
          >
            Add <CiEdit />
          </button>
          <button
            className={!isEditDelete ? "selected" : ""}
            onClick={handleEditDelete}
            value={"delete"}
          >
            Delete <CiEraser />
          </button>
        </div>
      </div>
      <Sequencer
        rhythm={rhythm}
        isEditDelete={isEditDelete}
        createRhythmGrid={createRhythmGrid}
        hoverGrid={hoverGrid}
        setHoverGrid={setHoverGrid}
        hoverGridRef={hoverGridRef}
        instrumentIdx={instrumentIdx}
        setIsChooseInstOpen={setIsChooseInstOpen}
      />

      <PlaybackBar startStop={startStop} />

      {isChooseInstOpen && (
        <ChooseInstPopUp
          instArr={instruments}
          setInstArr={setInstruments}
          instrumentIdx={instrumentIdx.current}
          setIsChooseInstOpen={setIsChooseInstOpen}
        />
      )}
    </div>
  );
}

export default DrumMachine;
