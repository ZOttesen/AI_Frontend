import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage: React.FC = () => {
    const handleButtonClick = async () => {
        console.log("Button clicked");
    };


    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Welcome to My Game</h1>
            <p>Explore the AI-driven questions and challenges!</p>
            <button type="button" className="homepage-button" onClick={handleButtonClick}>
                Primary
            </button>
            <Link to="/rules">Read the Rules</Link>
        </div>

    );
};

export default Homepage;
