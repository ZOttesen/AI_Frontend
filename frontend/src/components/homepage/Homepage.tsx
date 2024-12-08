import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import {sendMessageToRabbitMQ} from "../../utility/APIService";
import {audioService} from "../../utility/AudioPlayer";

const Homepage: React.FC = () => {
    const handleButtonClick = async () => {
        const result = await sendMessageToRabbitMQ('hej');
        if (result.success) {
            console.log("Response from RabbitMQ:", result.response);
        } else {
            console.error("Failed to send message:", result.message);
        }
        audioService.playAudio(result.response.audio_url);
    };
    const playSoundFileButton = async () => {
        audioService.playAudio('/7524161641702421710.mp3');
    };


    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Welcome to My Game</h1>
            <p>Explore the AI-driven questions and challenges!</p>
            <button type="button" className="homepage-button" onClick={handleButtonClick}>
                Primary
            </button>

            <button type="button" className="homepage-button" onClick={playSoundFileButton}>
                Play
            </button>
            <Link to="/rules">Read the Rules</Link>
        </div>

    );
};

export default Homepage;
