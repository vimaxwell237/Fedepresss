import React from 'react';

const SupportCard = ({ question, answer }) => {
  return (
    <div className="support-card">
      <h4>{question}</h4>
      <p>{answer}</p>
    </div>
  );
};

export default SupportCard;
