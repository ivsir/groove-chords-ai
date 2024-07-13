import React from 'react';

const DelayOptions = ({ delayTime, feedbackGain, delayAmount, handleDelayTimeChange, handleFeedbackChange, handleDelayAmountChange }) => (
  <div id="delay-options" className="mt-8">
    <h2 className="text-xl font-bold mb-2">Delay</h2>
    <label htmlFor="delay-time-control">Delay Time</label><br />
    <input type="range" id="delay-time-control" className="block" min="0" max="0.5" step="0.01" value={delayTime} onChange={handleDelayTimeChange} /><br />
    <label htmlFor="feedback-control">Feedback</label><br />
    <input type="range" id="feedback-control" className="block" min="0" max="0.8" step="0.05" value={feedbackGain} onChange={handleFeedbackChange} /><br />
    <label htmlFor="delay-amount-control">Delay Amount</label><br />
    <input type="range" id="delay-amount-control" className="block" min="0" max="0.5" step="0.01" value={delayAmount} onChange={handleDelayAmountChange} />
  </div>
);

export default DelayOptions;
