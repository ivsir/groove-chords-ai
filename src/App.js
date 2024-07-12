import React, { useEffect, useRef, useState } from "react";
import OscillatorOptions from "./components/OscillatorOptions";
import EnvelopeOptions from "./components/EnvelopeOptions";
import VibratoOptions from "./components/VibratoOptions";
import DelayOptions from "./components/DelayOptions";
import PianoKeys from "./components/PianoKeys";
import MIDIPortsDisplay from "./components/MIDIPortsDisplay";
import { keys, keyFrequencies } from "./keys/keys";

const App = () => {
  const [waveform, setWaveform] = useState("sine");
  const [attackTime, setAttackTime] = useState(0.3);
  const [releaseTime, setReleaseTime] = useState(0.3);
  const [noteLength, setNoteLength] = useState(1);
  const [vibratoAmount, setVibratoAmount] = useState(0);
  const [vibratoSpeed, setVibratoSpeed] = useState(10);
  const [delayTime, setDelayTime] = useState(0);
  const [feedbackGain, setFeedbackGain] = useState(0);
  const [delayAmount, setDelayAmount] = useState(0);
  const [midiPorts, setMidiPorts] = useState({ inputs: [], outputs: [] });
  const [selectedMIDIInput, setSelectedMIDIInput] = useState(null);

  const contextRef = useRef(null);
  const activeNotesRef = useRef({});
  const waveformRef = useRef(waveform);
  const attackTimeRef = useRef(attackTime);
  const releaseTimeRef = useRef(releaseTime);
  const noteLengthRef = useRef(noteLength)

  useEffect(()=>{
    waveformRef.current = waveform
  })
  useEffect(()=>{
    attackTimeRef.current = attackTime
  })
  useEffect(()=>{
    releaseTimeRef.current = releaseTime
  })

  useEffect(()=>{
    noteLengthRef.current = noteLength
  })

  useEffect(() => {
    setupAudioContext();
    // Fetch MIDI ports on mount
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(midiAccess => {
        const inputs = [];
        const outputs = [];
        for (let input of midiAccess.inputs.values()) {
          inputs.push({
            id: input.id,
            manufacturer: input.manufacturer,
            name: input.name,
            version: input.version,
          });
        }
        for (let output of midiAccess.outputs.values()) {
          outputs.push({
            id: output.id,
            manufacturer: output.manufacturer,
            name: output.name,
            version: output.version,
          });
        }
        setMidiPorts({ inputs, outputs });
      }).catch(error => {
        console.error('Failed to access MIDI devices:', error);
      });
    } else {
      console.warn('Web MIDI API is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    if (selectedMIDIInput) {
      setupMIDI(selectedMIDIInput);
    }
  }, [selectedMIDIInput]);


  const setupAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const masterVolumeNode = audioContext.createGain();
    masterVolumeNode.connect(audioContext.destination);
    masterVolumeNode.gain.value = 0.2;

    contextRef.current = {
      audioContext,
      masterVolumeNode,
      delayNode: audioContext.createDelay(),
      feedbackNode: audioContext.createGain(),
      delayAmountGain: audioContext.createGain(),
    };

    contextRef.current.delayNode.connect(contextRef.current.feedbackNode);
    contextRef.current.feedbackNode.connect(contextRef.current.delayNode);
    contextRef.current.delayNode.connect(masterVolumeNode);
    contextRef.current.delayAmountGain.connect(contextRef.current.delayNode);

    contextRef.current.delayNode.delayTime.value = delayTime;
    contextRef.current.feedbackNode.gain.value = feedbackGain;
    contextRef.current.delayAmountGain.gain.value = delayAmount;
  };

  const setupMIDI = async (selecetedMIDI) => {
    if (navigator.requestMIDIAccess) {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = [];
        const outputs = [];

        for (let input of midiAccess.inputs.values()) {
          inputs.push({
            id: input.id,
            manufacturer: input.manufacturer,
            name: input.name,
            version: input.version,
          });
          input.onmidimessage = (message) =>
            handleMIDIMessage(message);
        }

        for (let output of midiAccess.outputs.values()) {
          outputs.push({
            id: output.id,
            manufacturer: output.manufacturer,
            name: output.name,
            version: output.version,
          });
        }

        setMidiPorts({ inputs, outputs });
      } catch (error) {
        console.error("Failed to access MIDI devices:", error);
      }
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
    }
  };

  const handleMIDIMessage = (message) => {
    const currentWaveform = waveformRef.current;
    const [status, note, velocity] = message.data;
    const isNoteOn = (status & 0xf0) === 0x90;
    const isNoteOff = (status & 0xf0) === 0x80 || velocity === 0;
    if (isNoteOn) {
      playNoteByMIDI(note, currentWaveform);
    } else if (isNoteOff) {
      stopNoteByMIDI(note);
    }
  };

  const midiNoteToFrequency = (midiNote) => {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  const playNoteByMIDI = (midiNote, currentWaveform) => {
    const frequency = midiNoteToFrequency(midiNote);
    const note = Object.keys(keyFrequencies).find(
      (key) => Math.abs(keyFrequencies[key] - frequency) < 0.01
    );
    if (note) {
      playNote(note, currentWaveform);
    }
  };

  const stopNoteByMIDI = (midiNote) => {
    const frequency = midiNoteToFrequency(midiNote);
    const note = Object.keys(keyFrequencies).find(
      (key) => Math.abs(keyFrequencies[key] - frequency) < 0.01
    );
    if (note) {
      stopNote(note);
    }
  };

  const handleWaveformChange = (event) => {
    setWaveform(event.target.value);
  };

  const handleAttackChange = (event) => {
    setAttackTime(Number(event.target.value));
  };

  const handleReleaseChange = (event) => {
    setReleaseTime(Number(event.target.value));
  };

  const handleNoteLengthChange = (event) => {
    setNoteLength(Number(event.target.value));
  };

  const handleVibratoAmountChange = (event) => {
    setVibratoAmount(event.target.value);
  };

  const handleVibratoSpeedChange = (event) => {
    setVibratoSpeed(event.target.value);
  };

  const handleDelayTimeChange = (event) => {
    setDelayTime(Number(event.target.value));
    if (contextRef.current) {
      contextRef.current.delayNode.delayTime.value = Number(event.target.value);
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedbackGain(Number(event.target.value));
    if (contextRef.current) {
      contextRef.current.feedbackNode.gain.value = Number(event.target.value);
    }
  };

  const handleDelayAmountChange = (event) => {
    setDelayAmount(Number(event.target.value));
    if (contextRef.current) {
      contextRef.current.delayAmountGain.gain.value = Number(
        event.target.value
      );
    }
  };

  const handleMIDIInputSelect = (input) => {
    setSelectedMIDIInput(input);
  };

  const playNote = (note) => {
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    keyElement.classList.add("active");
    const { audioContext, masterVolumeNode } = contextRef.current;
    const currentNoteLength = noteLengthRef.current

    const osc = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const lfoGain = audioContext.createGain();
    const lfo = audioContext.createOscillator();

    const frequency = keyFrequencies[note];
    osc.type=waveformRef.current

    osc.frequency.setValueAtTime(frequency, 0);


    noteGain.gain.setValueAtTime(0, audioContext.currentTime);
    noteGain.gain.linearRampToValueAtTime(
      0.8,
      audioContext.currentTime + currentNoteLength * attackTimeRef.current
    );
    noteGain.gain.setValueAtTime(
      0.8,
      audioContext.currentTime + currentNoteLength - currentNoteLength * releaseTimeRef.current
    );
    noteGain.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + currentNoteLength
    );

    lfo.frequency.setValueAtTime(vibratoSpeed, audioContext.currentTime);
    lfo.start(audioContext.currentTime);
    lfo.stop(audioContext.currentTime + currentNoteLength);

    lfoGain.gain.setValueAtTime(vibratoAmount, audioContext.currentTime);

    osc.connect(noteGain);
    noteGain.connect(masterVolumeNode);
    noteGain.connect(contextRef.current.delayNode);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + currentNoteLength);

    activeNotesRef.current[note] = { osc, noteGain, lfo };
  };

  const stopNote = (note) => {
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
      keyElement.classList.remove("active");
    }
    const activeNote = activeNotesRef.current[note];
    if (activeNote) {
      activeNote.noteGain.gain.cancelScheduledValues(0);
      activeNote.noteGain.gain.setValueAtTime(
        activeNote.noteGain.gain.value,
        contextRef.current.audioContext.currentTime
      );
      activeNote.noteGain.gain.linearRampToValueAtTime(
        0,
        contextRef.current.audioContext.currentTime + releaseTimeRef.current
      );
      setTimeout(() => {
        activeNote.osc.stop();
        delete activeNotesRef.current[note];
      }, releaseTimeRef.current * 1000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="container flex-col">
        <h1 className="text-3xl font-bold mb-4">Piano Controls</h1>
        <div className="container flex justify-between">
          <div className="h-100 w-1/4  m-2 ">
            <MIDIPortsDisplay midiPorts={midiPorts} handleMIDIInputSelect={handleMIDIInputSelect} />
          </div>
          <div className="flex w-3/4">
            <div className=" h-full border-2 w-1/3 m-2 justify-center">
              <OscillatorOptions
                waveform={waveform}
                handleWaveformChange={handleWaveformChange}
              />
            </div>
            <div className="flex-row">
              <div className="border-2  m-2 p-4 h-full">
                <EnvelopeOptions
                  attackTime={attackTime}
                  releaseTime={releaseTime}
                  noteLength={noteLength}
                  handleAttackChange={handleAttackChange}
                  handleReleaseChange={handleReleaseChange}
                  handleNoteLengthChange={handleNoteLengthChange}
                />
              </div>
            </div>
            <div className="flex-row">
              <div className="m-2  border-2  p-4">
                <VibratoOptions
                  vibratoAmount={vibratoAmount}
                  vibratoSpeed={vibratoSpeed}
                  handleVibratoAmountChange={handleVibratoAmountChange}
                  handleVibratoSpeedChange={handleVibratoSpeedChange}
                />
              </div>
              <div className="m-2 border-2  p-4 ">
                <DelayOptions
                  delayTime={delayTime}
                  feedbackGain={feedbackGain}
                  delayAmount={delayAmount}
                  handleDelayTimeChange={handleDelayTimeChange}
                  handleFeedbackChange={handleFeedbackChange}
                  handleDelayAmountChange={handleDelayAmountChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PianoKeys keys={keys} playNote={playNote} stopNote={stopNote} />
    </div>
  );
};

export default App;
