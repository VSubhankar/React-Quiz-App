import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import logo from './giphy.webp';
import playIcon from './play-icon.png';  // Assuming the play button is a PNG file
import instructionsIcon from './instructions-icon.jpg'; // Assuming the instructions icon is a JPG file

function App() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handlePlayClick = () => {
    // Redirect to Quiz.js
    window.location.href = '/Quiz';
  };

  const handleInstructionsClick = () => {
    setShowInstructions(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="App min-vh-100 d-flex justify-content-center align-items-center">
      <div className="floating-container p-5 text-center">
      <img src={logo} alt="Quiz Game Logo" className="logo mb-4" />
        <h1 className="floating-text display-4 text-light bold-text">
          Welcome to Quiz Game <span role="img" aria-label="waving hand">👋</span>
        </h1>
        <p className="instructions mt-4">
          Test your knowledge with our exciting quizzes!
        </p>
        <div className="container-group d-flex justify-content-around mt-4">
          <div className="c1 d-flex flex-column align-items-center">
            <div className="c11 mb-3 text-light">Start Playing ↓ </div>
            <div className="c12">
              <img 
                src={playIcon} 
                alt="Play Button" 
                className="interactive-icon" 
                onClick={handlePlayClick} 
              />
            </div>
          </div>
          <div className="c2 d-flex flex-column align-items-center">
            <div className="c21 mb-3 text-light">How to Play ↓ </div>
            <div className="c22">
              <img 
                src={instructionsIcon} 
                alt="Instructions Button" 
                className="interactive-icon" 
                onClick={handleInstructionsClick} 
              />
            </div>
          </div>
        </div>
        {showInstructions && (
          <div className="instructions-popup">
            <button className="close-btn" onClick={closeInstructions}>✖</button>
            <ul className="instructions-content">
              <li>The quiz is uni-directional; once answered, you cannot go back. You have to retake it if you want to change your answers.</li>
              <li>You have 15 seconds to answer every question. After selecting an option and clicking save, only the correct answer is shown in green.</li>
              <li>If your selected answer is incorrect, it will be shown in red, along with the correct answer in green.</li>
              <li>At the end of each question, either when 15 seconds are over or after selecting an option, the total timer stops for 6 seconds to show the correct answer. After this, the screen automatically moves to the next question, whether the user clicks next or not.</li>
              <li>Finally, in the quiz report, correct answers are shown in green, and wrong answers are shown in red as a list.</li>
            </ul>
            <button className="btn btn-primary mt-3" onClick={closeInstructions}>Okay</button>
          </div>
        )}

      </div>
    </div>
  );
}
export default App;
