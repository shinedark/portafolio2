import React, { useState, useEffect } from 'react';
import './Interest.css'; // We'll create this file for styling

const Interest = () => {
  const paragraphs = [
    "Learning: Cyfrin Updraft courses, Eigen Layer, and AI.",
    "Hobbies: Cooking, Golf, Music, and Futbol.",
    "The Vision is large, Attitude the steering wheel, and discipline the fuel."
  ];

  const [typedParagraphs, setTypedParagraphs] = useState(paragraphs.map(() => ''));
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let timeouts = [];
    let currentIndexes = paragraphs.map(() => 0);

    const typeNextCharacter = () => {
      let allCompleted = true;

      const newTypedParagraphs = typedParagraphs.map((typed, index) => {
        if (currentIndexes[index] < paragraphs[index].length) {
          allCompleted = false;
          currentIndexes[index]++;
          return paragraphs[index].slice(0, currentIndexes[index]);
        }
        return typed;
      });

      setTypedParagraphs(newTypedParagraphs);

      if (!allCompleted) {
        timeouts.push(setTimeout(typeNextCharacter, 50));
      } else {
        setIsTypingComplete(true);
      }
    };

    typeNextCharacter();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="interest-section">
      <h2>Interests</h2>
      <div className="interest-grid">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="interest-column">
            <p>{isTypingComplete ? paragraph : typedParagraphs[index]}</p>
            {!isTypingComplete && <span className="cursor">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interest;
