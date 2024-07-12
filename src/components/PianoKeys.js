import React from 'react';
import PianoKey from './PianoKey';

const PianoKeys = ({ keys, playNote, stopNote }) => (
  <div id="piano" className="mt-8">
    <h2 className="text-xl font-bold mb-2">Piano Keys</h2>
    <div className="flex">
      {keys.map((note) => {
        const color = note.includes('#') ? 'black' : 'white';
        return (
          <PianoKey
            key={note}
            note={note}
            color={color}
            playNote={playNote}
            stopNote={stopNote}
          />
        );
      })}
    </div>
  </div>
);

export default PianoKeys;
