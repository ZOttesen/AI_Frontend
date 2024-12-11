import React, { useState } from 'react';
import {answerMessageToRabbitMQ, RabbitMQAnswer} from '../../utility/APIService';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    message?: string;
    initialMessage?: string;
}
const Modal: React.FC<ModalProps> = ({ isVisible, onClose, initialMessage }) => {
    const [userInput, setUserInput] = useState<string>(''); // Brugerens input
    const { cachedData } = useCacheHandler('DashboardPreferences', {
        selectedPersonality: PersonalityType.FRIENDLY,
        selectedLanguage: LanguageChoice.ENGLISH,
    });

    if (!isVisible) return null;

    const handleSubmit = async () => {
        if (!userInput) {
            alert('Please enter some text.');
            return;
        }

        const message: RabbitMQAnswer = {
            answer: userInput,
            question: initialMessage!,
            preferences: {
                personality: cachedData?.selectedPersonality || PersonalityType.FRIENDLY,
                language: cachedData?.selectedLanguage || LanguageChoice.ENGLISH,
            },
        };

        try {
            const response = await answerMessageToRabbitMQ(message);
            console.log('RabbitMQ Response:', response);
            alert(response.success ? 'Message sent successfully!' : `Error: ${response}`);
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
            alert('Failed to send the message.');
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <p>{initialMessage}</p>
                <input
                    type="text"
                    placeholder="Enter your response"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={modalStyles.input}
                />
                <button onClick={handleSubmit} style={modalStyles.button}>
                    Submit
                </button>
                <button onClick={onClose} style={modalStyles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

const modalStyles: { overlay: React.CSSProperties; modal: React.CSSProperties; input: React.CSSProperties; button: React.CSSProperties; closeButton: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    closeButton: {
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

export default Modal;
