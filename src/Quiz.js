import React, { useState, useEffect } from 'react';
import Quizzes from './Quizzes.json';
import './Quiz.css';
import CNLogo from './CN-Logo.png';
import DBMSLogo from './DBMS-Logo.png';
import DSALogo from './DSA-Logo.png';
import OSLogo from './OS-Logo.png';
import WrongLogo from './wrong-Logo.png';
import RightLogo from './right-Logo.png';


const quizLogos = {
    1: CNLogo,
    2: DBMSLogo,
    3: OSLogo,
    4: DSALogo
};

function Quiz() {
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userChoice, setUserChoice] = useState('NA');
    const [timeLeft, setTimeLeft] = useState(15);
    const [totalTime, setTotalTime] = useState(0);
    const [score, setScore] = useState(0);
    const [autoNextTime, setAutoNextTime] = useState(5);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timerInterval, setTimerInterval] = useState(null);
    const [autoNextInterval, setAutoNextInterval] = useState(null);

    useEffect(() => {
        if (currentQuiz && !isAnswered) {
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        handleSave();
                        return 0;
                    }
                    return prevTime - 1;
                });
                setTotalTime((prevTime) => prevTime + 1);
            }, 1000);
            setTimerInterval(interval);
        } else {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval);
    }, [currentQuiz, isAnswered]);

    useEffect(() => {
        if (isAnswered && autoNextTime > 0) {
            const interval = setInterval(() => {
                setAutoNextTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        handleNext();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            setAutoNextInterval(interval);
        } else {
            clearInterval(autoNextInterval);
        }

        return () => clearInterval(autoNextInterval);
    }, [isAnswered, autoNextTime]);

    const handleOptionSelect = (option) => {
        if (!isAnswered) {
            setUserChoice(option);
        }
    };

    const handleSave = () => {
        if (!isAnswered) {
            setIsAnswered(true);
            if (userChoice === currentQuiz.questions[currentQuestionIndex].correctAnswer) {
                setScore(score + 1);
            }
            clearInterval(timerInterval);
        }
    };

    const handleNext = () => {
        setIsAnswered(false);
        setUserChoice('NA');
        setAutoNextTime(5);
        setTimeLeft(15);
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert(`Quiz completed! Your score: ${score}/${currentQuiz.questions.length}`);
            setCurrentQuiz(null);
        }
    };

    const handleReset = () => {
        setCurrentQuiz(null);
        setCurrentQuestionIndex(0);
        setUserChoice('NA');
        setTimeLeft(15);
        setTotalTime(0);
        setScore(0);
        setAutoNextTime(5);
        setIsAnswered(false);
        clearInterval(timerInterval);
        clearInterval(autoNextInterval);
    };

    const handleQuizSelect = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTotalTime(0);
        setTimeLeft(15);
        setAutoNextTime(5);
        setIsAnswered(false);
        setUserChoice('NA');
    };

    return (
        <div className="quiz-app">
            {!currentQuiz ? (
                <div className="quiz-list">
                    <h1>Select a Quiz</h1>
                    <div className="quiz-grid">
                        {Quizzes.quizzes.map((quiz) => (
                            <div key={quiz.id} className="quiz-card">
                                <img src={quizLogos[quiz.id]} alt={quiz.name} className="quiz-logo" />
                                <button onClick={() => handleQuizSelect(quiz)}>
                                    {quiz.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quiz-container">
                    <h2 className="quiz-title">{currentQuiz.name}</h2>
                    <p className="quiz-question">Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}</p>
                    <p className="quiz-question">{currentQuiz.questions[currentQuestionIndex].name}</p>
                        <div className="options-container">
                            {currentQuiz.questions[currentQuestionIndex].options.map((option) => {
                                const isCorrect = option === currentQuiz.questions[currentQuestionIndex].correctAnswer;
                                const isSelected = option === userChoice;
                                return (
                                    <div key={option} className="option-container">
                                        <button
                                            className={`option-button ${isSelected ? 'selected' : ''} ${isAnswered && isCorrect ? 'correct' : ''} ${isAnswered && isSelected && !isCorrect ? 'incorrect' : ''}`}
                                            onClick={() => handleOptionSelect(option)}
                                        >
                                            {option}
                                        </button>
                                        {isAnswered && (isCorrect || isSelected) && (
                                            <img
                                                src={isCorrect ? RightLogo : WrongLogo}
                                                alt={isCorrect ? "Correct" : "Incorrect"}
                                                className="option-logo"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    <div className="controls">
                        <button
                            className="btn btn-danger"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            className={`btn ${isAnswered ? 'btn-disabled' : 'btn-primary'}`}
                            onClick={handleSave}
                            disabled={isAnswered}
                        >
                            Save Answer
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                    <div id ="s1" className="status">
                        <p>Time Left: {timeLeft}s &nbsp;
                        Total Time: {Math.floor(totalTime / 60)}:{totalTime % 60}&nbsp;
                        Score: {score}</p>
                        {isAnswered && (
                            <p>Auto Next in: {autoNextTime}s</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Quiz;
