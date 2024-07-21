import React from 'react';

const PianoKey = ({ note, color, previousColor, playNote, stopNote }) => (
  <div
    className={`key ${color === 'black' ? 'black' : 'white'} ${color === 'black' ? 'w-7 h-24 bg-black' : 'w-10 h-40 bg-white'
      } border border-black box-border`}
    data-note={note}
    onMouseDown={() => playNote(note)}
    onMouseUp={() => stopNote(note)}
    onMouseLeave={() => stopNote(note)}
    style={color === 'black' ? { marginLeft: '-0.75rem', marginRight: '-0.75rem', zIndex: 1 } : {}}
  >
  </div>
);

export default PianoKey;