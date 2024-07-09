import React from 'react';

const PianoKey = ({ note, isBlack, onPlayNote, onStopNote }) => {
  const keyClassName = `key ${isBlack ? 'black absolute' : 'white'} ${
    isBlack ? 'w-7 h-24 bg-black' : 'w-10 h-40 bg-white'
  } border border-black box-border`;

  const handleMouseDown = () => {
    onPlayNote && onPlayNote(note);
  };

  const handleMouseUp = () => {
    onStopNote && onStopNote(note);
  };

  return (
    <div
      className={keyClassName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      data-note={note}
      style={isBlack ? { marginLeft: '-0.75rem', marginRight: '-0.75rem', zIndex: 1 } : {}}
    />
  );
};

export default PianoKey;
