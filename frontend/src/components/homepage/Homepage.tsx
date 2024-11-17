import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import {sendMessageToRabbitMQ} from "../../utility/APIService";

const Homepage: React.FC = () => {
    const handleButtonClick = async () => {
        const result = await sendMessageToRabbitMQ('hej');
        if (result.success) {
            console.log("Response from RabbitMQ:", result.response);
        } else {
            console.error("Failed to send message:", result.message);
        }
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
