import React, { useEffect, useRef, useState } from 'react';
import PianoKey from './components/PianoKey';
const keys = [
  'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  'C8'
];

const keyFrequencies = {
  'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
  'C8': 4186.01
};

const App = () => {
  const [waveform, setWaveform] = useState('sine');
  const [attackTime, setAttackTime] = useState(0.3);
  const [releaseTime, setReleaseTime] = useState(0.3);
  const [noteLength, setNoteLength] = useState(1);
  const [vibratoAmount, setVibratoAmount] = useState(0);
  const [vibratoSpeed, setVibratoSpeed] = useState(10);
  const [delayTime, setDelayTime] = useState(0);
  const [feedbackGain, setFeedbackGain] = useState(0);
  const [delayAmount, setDelayAmount] = useState(0);

  const contextRef = useRef(null);

  useEffect(() => {
    setupAudioContext();
  }, []);

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
      contextRef.current.delayAmountGain.gain.value = Number(event.target.value);
    }
  };

  const playNote = (note) => {
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    keyElement.classList.add('active');
    const { audioContext, masterVolumeNode } = contextRef.current;

    const osc = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const lfoGain = audioContext.createGain();
    const lfo = audioContext.createOscillator();

    const frequency = keyFrequencies[note];

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, 0);

    noteGain.gain.setValueAtTime(0, audioContext.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + noteLength * attackTime);
    noteGain.gain.setValueAtTime(0.8, audioContext.currentTime + noteLength - noteLength * releaseTime);
    noteGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + noteLength);

    lfo.frequency.setValueAtTime(vibratoSpeed, audioContext.currentTime);
    lfo.start(audioContext.currentTime);
    lfo.stop(audioContext.currentTime + noteLength);

    lfoGain.gain.setValueAtTime(vibratoAmount, audioContext.currentTime);

    osc.connect(noteGain);
    noteGain.connect(masterVolumeNode);
    noteGain.connect(contextRef.current.delayNode);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + noteLength);
  };

  const stopNote = (note) => {
    // Implement if necessary
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
      keyElement.classList.remove('active');
    };
  }

  return (
    <div className="container mx-auto p-4">
      <div>
      <h1 className="text-3xl font-bold mb-4">Piano Controls</h1>
      <div id="oscillator-options" className="mt-8">
        <h2 className="text-xl font-bold mb-2">Oscillator</h2>
        <div className="flex flex-col">
          <input type="radio" id="sin-wave" name="waveform" value="sine" checked={waveform === 'sine'} onChange={handleWaveformChange} className="mr-2" />
          <label htmlFor="sin-wave">Sin Wave</label><br />
          <input type="radio" id="square-wave" name="waveform" value="square" checked={waveform === 'square'} onChange={handleWaveformChange} className="mr-2" />
          <label htmlFor="square-wave">Square Wave</label><br />
          <input type="radio" id="triangle-wave" name="waveform" value="triangle" checked={waveform === 'triangle'} onChange={handleWaveformChange} className="mr-2" />
          <label htmlFor="triangle-wave">Triangle Wave</label><br />
          <input type="radio" id="sawtooth-wave" name="waveform" value="sawtooth" checked={waveform === 'sawtooth'} onChange={handleWaveformChange} className="mr-2" />
          <label htmlFor="sawtooth-wave">Sawtooth Wave</label>
        </div>
      </div>
      <div id="envelope-options" className="mt-8">
        <h2 className="text-xl font-bold mb-2">Envelope</h2>
        <label htmlFor="attack-control">Attack Time</label><br />
        <input type="range" id="attack-control" className="block" min="0" max="0.5" step="0.02" value={attackTime} onChange={handleAttackChange} /><br />
        <label htmlFor="release-control">Release Time</label><br />
        <input type="range" id="release-control" className="block" min="0" max="0.5" step="0.02" value={releaseTime} onChange={handleReleaseChange} /><br />
        <label htmlFor="note-length-control">Note Length</label><br />
        <input type="range" id="note-length-control" className="block" min="0.2" max="2" step="0.05" value={noteLength} onChange={handleNoteLengthChange} /><br />
      </div>
      <div id="vibrato-options" className="mt-8">
        <h2 className="text-xl font-bold mb-2">Vibrato</h2>
        <label htmlFor="vibrato-amount-control">Vibrato Amount</label><br />
        <input type="range" id="vibrato-amount-control" className="block" min="0" max="5" step="0.5" value={vibratoAmount} onChange={handleVibratoAmountChange} /><br />
        <label htmlFor="vibrato-speed-control">Vibrato Speed</label><br />
        <input type="range" id="vibrato-speed-control" className="block" min="0" max="30" step="0.5" value={vibratoSpeed} onChange={handleVibratoSpeedChange} /><br />
      </div>
      <div id="delay-options" className="mt-8">
        <h2 className="text-xl font-bold mb-2">Delay</h2>
        <label htmlFor="delay-time-control">Delay Time</label><br />
        <input id='delay-time-control' type="range" className="block" min="0" max="1" step='0.05' value={delayTime} onChange={handleDelayTimeChange} /><br />
        <label htmlFor="feedback-control">Delay Feedback</label><br />
        <input id='feedback-control' type="range" className="block" min="0" max=".9" step='0.05' value={feedbackGain} onChange={handleFeedbackChange} /><br />
        <label htmlFor="delay-amount-control">Delay Amount</label><br />
        <input id='delay-amount-control' type="range" className="block" min="0" max="1" step='0.05' value={delayAmount} onChange={handleDelayAmountChange} /><br />
      </div>
      </div>
      <div id="piano-keys" className="mt-8">
        <h2 className="text-xl font-bold mb-2">Piano Keys</h2>
        <div className="flex flex-wrap justify-center">
          {/* {Object.keys(keyFrequencies).map(note => (
            <PianoKey key={note} note={note} playNote={playNote} stopNote={stopNote} />
          ))} */}
          <div className="flex relative h-40">
            {/* Render white keys */}

            <div className='flex'>
              {keys.map((key, index) => {
                const isBlack = key.includes('#');
                console.log(key, "key render")
                return (
                  <div className='flex'>
                    <PianoKey
                      key={index}
                      note={key}
                      isBlack={isBlack}
                      onPlayNote={playNote}
                      onStopNote={stopNote}
                    />
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
