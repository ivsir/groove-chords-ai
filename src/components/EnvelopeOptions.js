import React from 'react';

const EnvelopeOptions = ({ attackTime, releaseTime, noteLength, handleAttackChange, handleReleaseChange, handleNoteLengthChange }) => (
  <div id="envelope-options" className="mt-8">
    <h2 className="text-xl font-bold mb-2">Envelope</h2>
    <label htmlFor="attack-control">Attack Time</label><br />
    <input type="range" id="attack-control" className="block" min="0" max="0.5" step="0.02" value={attackTime} onChange={handleAttackChange} /><br />
    <label htmlFor="release-control">Release Time</label><br />
    <input type="range" id="release-control" className="block" min="0" max="0.5" step="0.02" value={releaseTime} onChange={handleReleaseChange} /><br />
    <label htmlFor="note-length-control">Note Length</label><br />
    <input type="range" id="note-length-control" className="block" min="0.3" max="1.5" step="0.1" value={noteLength} onChange={handleNoteLengthChange} />
  </div>
);

export default EnvelopeOptions;
