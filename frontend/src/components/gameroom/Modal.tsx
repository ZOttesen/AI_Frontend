import React, { useState, useEffect, useRef } from 'react';
import { answerMessageToRabbitMQ, RabbitMQAnswer } from '../../utility/APIService';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';
import { audioService } from "../../utility/AudioPlayer";
import { Spinner } from 'react-bootstrap';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    message?: string;
    initialMessage?: string;
}

type ChatMessage = {
    sender: 'server' | 'user' | 'loading';
    text: string;
};

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, initialMessage }) => {
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMessageSent, setIsMessageSent] = useState<boolean>(false);
    const prevInitialMessage = useRef<string | undefined>(undefined);

    const initialChat: ChatMessage[] = [{ sender: 'loading', text: '...' }];
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChat);

    const { cachedData } = useCacheHandler('DashboardPreferences', {
        selectedPersonality: PersonalityType.FRIENDLY,
        selectedLanguage: LanguageChoice.ENGLISH,
    });

    useEffect(() => {
        if (isVisible) {
            // Start altid forfra med "thinking"
            setChatHistory([{ sender: 'loading', text: '...' }]);
            setUserInput('');
            setIsMessageSent(false);

            // Viser initialMessage kun hvis den er ny
            if (initialMessage && initialMessage !== prevInitialMessage.current) {
                setChatHistory([{ sender: 'server', text: initialMessage }]);
                prevInitialMessage.current = initialMessage;
            }
        } else {
            // Ryd op når modal lukkes
            setChatHistory([]);
        }
    }, [isVisible, initialMessage]);

    const handleOverlayClick = () => {
        onClose();
    };

    if (!isVisible) return null;

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!userInput) {
            alert('Please enter some text.');
            return;
        }

        // Mark message as sent and disable input
        setIsMessageSent(true);

        // Add user message to chat history
        setChatHistory((prev) => [...prev, { sender: 'user', text: userInput }]);

        // Add a "loading" message from server
        setChatHistory((prev) => [...prev, { sender: 'loading', text: '...' }]);
        setIsLoading(true);

        const message: RabbitMQAnswer = {
            answer: userInput,
            question: initialMessage || '',
            preferences: {
                personality: cachedData?.selectedPersonality || PersonalityType.FRIENDLY,
                language: cachedData?.selectedLanguage || LanguageChoice.ENGLISH,
            },
        };

        try {
            const response = await answerMessageToRabbitMQ(message);

            if (response.success && response.response) {
                const { audio_url, text } = response.response;

                // Replace loading message with server's response
                setChatHistory((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.findIndex((msg) => msg.sender === 'loading');
                    if (lastIndex >= 0) updated.splice(lastIndex, 1);
                    updated.push({ sender: 'server', text });
                    return updated;
                });

                if (audio_url) {
                    audioService.playAudio(audio_url);
                }
            } else {
                throw new Error('Invalid response from server.');
            }
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
            alert('Failed to send the message.');
            setChatHistory((prev) => prev.filter((msg) => msg.sender !== 'loading'));
        } finally {
            setUserInput('');
            setIsLoading(false);
            // Fjern setIsMessageSent(false) så inputfeltet ikke dukker op igen.
        }
    };

    return (
        <div
            className="modal-overlay d-flex justify-content-center align-items-center"
            onClick={handleOverlayClick}
        >
            <div
                className="modal-container bg-white p-3 rounded shadow d-flex flex-column position-relative"
                onClick={handleModalClick}
            >
                <div className="outer-container">
                    {chatHistory.map((msg, idx) => {
                        const isUser = msg.sender === 'user';
                        const bubbleClasses = isUser ? 'message-container' : 'reply-container';
                        const outerBubbleClasses = isUser ? 'justify-content-end' : 'justify-content-start';
                        return (
                            <div className={`${outerBubbleClasses} mb-2 d-flex`} key={idx}>
                                <div className={`${bubbleClasses} col-auto`}>
                                    {msg.sender === 'loading' ? (
                                        <div className="spinner-container">
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="me-2 my-custom-spinner"
                                                style={{ color: 'var(--primary-blue)' }}
                                            />
                                            <span style={{ color: 'var(--primary-blue)' }}>Thinking...</span>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!isMessageSent && (
                    <input
                        type="text"
                        className="form-control"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || isMessageSent} // Disable input under loading
                    />
                )}
            </div>
        </div>
    );
};

export default Modal;
