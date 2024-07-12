import React from 'react';

const MIDIPortsDisplay = ({ midiPorts, handleMIDIInputSelect }) => {
  const handleMIDIInputChange = (event) => {
    const selectedInputId = event.target.value;
    const selectedInput = midiPorts.inputs.find(input => input.id === selectedInputId);
    handleMIDIInputSelect(selectedInput);
  };

  return (
    <div>
      <h2 className="text-2xl mb-2">MIDI Ports</h2>
      <div>
        <label htmlFor="midiInputs">MIDI Inputs:</label>
        <select id="midiInputs" onChange={handleMIDIInputChange}>
          <option value="">Select a MIDI Input</option>
          {midiPorts.inputs.map(input => (
            <option key={input.id} value={input.id}>
              {input.manufacturer} {input.name} {input.version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MIDIPortsDisplay;
