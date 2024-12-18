import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage: React.FC = () => {
    const handleButtonClick = async () => {
        console.log("Start Game clicked");
    };

    return (
        <div className="homepage-container">
            <div className="row justify-content-center text-center">
                <div className="col-12">
                    <h1>Welcome to the AI Quiz Game</h1>
                    <p className="h5">Test your knowledge, challenge AI-driven questions, and score big!</p>
                </div>
            </div>
            <div className="row justify-content-center mt-5 text-center ">
                <div className="col-12 col-md-8 align-items">
                    <h2>Game Rules</h2>
                    <p>
                        Step into a world where knowledge collides with cutting-edge AI. Before you begin,
                        familiarize yourself with these rules to ensure a thrilling and fair experience.
                    </p>
                    <ol>
                        <li>Choose the number of players (2-4). Each player receives their own scorecard.</li>
                        <li>Select an AI personality type and language for each AI opponent to set the tone.</li>
                        <li>Pick any 3 custom quiz categories, shaping your unique game board.</li>
                        <li>Click on a category card to reveal a question. Higher points mean tougher challenges.</li>
                        <li>Enter your answer and try to persuade the AI that you are correct—be creative!</li>
                        <li>After the AI’s verdict, update your score on your own scorecard accordingly.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
