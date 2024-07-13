import React from 'react';

const VibratoOptions = ({ vibratoAmount, vibratoSpeed, handleVibratoAmountChange, handleVibratoSpeedChange }) => (
  <div id="vibrato-options" className="mt-8">
    <h2 className="text-xl font-bold mb-2">Vibrato</h2>
    <label htmlFor="vibrato-amount-control">Vibrato Amount</label><br />
    <input type="range" id="vibrato-amount-control" className="block" min="0" max="70" step="1" value={vibratoAmount} onChange={handleVibratoAmountChange} /><br />
    <label htmlFor="vibrato-speed-control">Vibrato Speed</label><br />
    <input type="range" id="vibrato-speed-control" className="block" min="0" max="20" step="0.5" value={vibratoSpeed} onChange={handleVibratoSpeedChange} />
  </div>
);

export default VibratoOptions;
