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
    const [autoNextTime, setAutoNextTime] = useState(8);
    const [isAnswered, setIsAnswered] = useState(false);
    const [responses, setResponses] = useState(Array(10).fill({ chosenOption: 'NA', correctAnswer: '', isCorrect: false }));
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Choose your option and click on save");

    useEffect(() => {
        if (currentQuiz) {
            // Prefetch the correct answers into the responses matrix
            const updatedResponses = currentQuiz.questions.map(question => ({
                chosenOption: 'NA',
                correctAnswer: question.correctAnswer,
                isCorrect: false
            }));
            setResponses(updatedResponses);
        }
    }, [currentQuiz]);

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
            return () => clearInterval(interval);
        }
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
            return () => clearInterval(interval);
        }
    }, [isAnswered, autoNextTime]);

    const handleOptionSelect = (option) => {
        if (!isAnswered) {
            setUserChoice(option);
        }
    };

    const handleSave = () => {
        if (!isAnswered) {
            const correctAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer;
            const isCorrect = userChoice === correctAnswer;
            setIsAnswered(true);

            const updatedResponses = [...responses];
            updatedResponses[currentQuestionIndex] = {
                chosenOption: userChoice,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            };
            setResponses(updatedResponses);

            if (isCorrect) {
                setScore(score + 1);
                setStatusMessage("Correct answer, keep going champ!");
            } else if (userChoice === 'NA') {
                setStatusMessage("No response received, displaying the correct answer");
            } else {
                setStatusMessage("Better luck next time!");
            }

            if (currentQuestionIndex === currentQuiz.questions.length - 1) {
                setQuizCompleted(true);
            }
        }
    };

    const handleNext = () => {
        setIsAnswered(false);
        setUserChoice('NA');
        setAutoNextTime(8);
        setTimeLeft(15);
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setStatusMessage("Choose your option and click on save");
        }
    };

    const handleReset = () => {
        setCurrentQuiz(null);
        setCurrentQuestionIndex(0);
        setUserChoice('NA');
        setTimeLeft(15);
        setTotalTime(0);
        setScore(0);
        setAutoNextTime(8);
        setIsAnswered(false);
        setResponses(Array(10).fill({ chosenOption: 'NA', correctAnswer: '', isCorrect: false }));
        setQuizCompleted(false);
        setStatusMessage("Choose your option and click on save");
    };

    const handleQuizSelect = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTotalTime(0);
        setTimeLeft(15);
        setAutoNextTime(8);
        setIsAnswered(false);
        setUserChoice('NA');
        const updatedResponses = quiz.questions.map(question => ({
            chosenOption: 'NA',
            correctAnswer: question.correctAnswer,
            isCorrect: false
        }));
        setResponses(updatedResponses);
        setQuizCompleted(false);
        setStatusMessage("Choose your option and click on save");
    };

    const handleSubmit = () => {
        setQuizCompleted(true);
    };

    const calculateScorePercentage = () => {
        return Math.round((score / currentQuiz.questions.length) * 100);
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
            ) : quizCompleted ? (
                <div className="quiz-report">
                    <h1>Quiz Completed Sucessfully</h1> <br/>
                    <h2>Your Score is {calculateScorePercentage()}%</h2> <br/>
                    <h2>Here is your Quiz Summary</h2>
                    <table className="report-table table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Question</th>
                                <th>Chosen Option</th>
                                <th>Correct Answer</th>
                                <th>Scored Correct</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((response, index) => (
                                <tr key={index} className={response.isCorrect ? 'table-success' : 'table-danger'}>
                                    <td>{index + 1}</td>
                                    <td>{currentQuiz.questions[index].name}</td>
                                    <td>{response.chosenOption}</td>
                                    <td>{response.correctAnswer}</td>
                                    <td>{response.isCorrect ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={handleReset}>Restart Quiz</button>
                </div>
            ) : (
                <div className="quiz-container">
                    <h2 className="quiz-title">{currentQuiz.name}</h2>
                    <p className="quiz-question">Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}</p>
                    <p className="quiz-question">{currentQuiz.questions[currentQuestionIndex].name}</p>
                    <p className="status-message">{statusMessage}</p>
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

                    <div className="quiz-controls">
                        <button
                            className="btn btn-danger"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isAnswered}
                        >
                            Save Answer
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNext}
                            disabled={!isAnswered}
                        >
                            Next
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >
                            Submit Quiz
                        </button>
                    </div>
                    {isAnswered && (
                        <div className="auto-save-timer">
                            <p>Auto save in: {autoNextTime} seconds</p>
                        </div>
                    )}
                    <div className="quiz-timer">
                        <p>Time left: {timeLeft} seconds</p>
                        <p>Total time: {totalTime} seconds</p>
                        <p>Total score: {score}</p> {/* Displaying total score */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Quiz;
