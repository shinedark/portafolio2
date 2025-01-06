import React from 'react'
import './SmileyOverlay.css'

function SmileyOverlay({ onClose }) {
  return (
    <div className="smiley-overlay" onClick={onClose}>
      <div className="smiley-overlay-content">
        <div className="eye left-eye"></div>
        <div className="eye right-eye"></div>
        <div className="mouth">
          <div className="tooth left-tooth"></div>
          <div className="tooth right-tooth"></div>
        </div>
      </div>
      <div className="typing-text">HELLO WORLD</div>
    </div>
  )
}

export default SmileyOverlay
