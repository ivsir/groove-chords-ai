import React from 'react';

const OscillatorOptions = ({ waveform, handleWaveformChange }) => (
  <div id="oscillator-options" className="mt-8">
    <h2 className="text-xl font-bold mb-2">Oscillator</h2>
    <div className="grid grid-rows-2 grid-flow-col">
      <div >
        <input type="radio" id="sine-wave" name="waveform" value="sine" checked={waveform === 'sine'} onChange={handleWaveformChange} className="mr-2" />
        <label htmlFor="sine-wave">Sine Wave</label><br />
      </div>
      <div >
        <input type="radio" id="square-wave" name="waveform" value="square" checked={waveform === 'square'} onChange={handleWaveformChange} className="mr-2" />
        <label htmlFor="square-wave">Square Wave</label><br />
      </div>
      <div>
        <input type="radio" id="triangle-wave" name="waveform" value="triangle" checked={waveform === 'triangle'} onChange={handleWaveformChange} className="mr-2" />
        <label htmlFor="triangle-wave">Triangle Wave</label><br />
      </div>
      <div>
        <input type="radio" id="sawtooth-wave" name="waveform" value="sawtooth" checked={waveform === 'sawtooth'} onChange={handleWaveformChange} className="mr-2" />
        <label htmlFor="sawtooth-wave">Sawtooth Wave</label>
      </div>
    </div>
  </div>
);

export default OscillatorOptions;
