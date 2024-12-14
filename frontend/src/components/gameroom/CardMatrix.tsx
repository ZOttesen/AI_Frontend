import React, { useState } from 'react';
import Modal from './Modal';
import { sendMessageToRabbitMQ } from '../../utility/APIService';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';
import { RabbitMQMessage } from '../../utility/APIService';
import { audioService } from '../../utility/AudioPlayer';

interface CardMatrixProps {
    cards: { category: string; points: number }[];
}

const CardMatrix: React.FC<CardMatrixProps> = ({ cards }) => {
    const { cachedData } = useCacheHandler<any>('DashboardPreferences');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | undefined>();
    const [initialMessage, setInitialMessage] = useState<string | undefined>();
    const [clickedCards, setClickedCards] = useState<string[]>([]);


    const handleCardClick = async (category: string, points: number) => {
        if (clickedCards.includes(category)) return;

        setClickedCards((prev) => [...prev, category]);

        const message: RabbitMQMessage = {
            category,
            points,
            preferences: {
                personality: cachedData?.selectedPersonality || PersonalityType.FRIENDLY,
                language: cachedData?.selectedLanguage || LanguageChoice.ENGLISH,
            },
        };

        setIsModalVisible(true);
        setModalMessage('Sending message...');

        try {
            const response = await sendMessageToRabbitMQ(message);

            if (response.success && response.response) {
                const { audio_url, text } = response.response;

                setInitialMessage(text);
                setModalMessage('Message from RabbitMQ received.');

                if (audio_url) {
                    audioService.playAudio(audio_url);
                }
            } else {
                setModalMessage(`Error: ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            setModalMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`col ${clickedCards.includes(card.category) ? 'disabled-card' : ''}`}
                        onClick={() => handleCardClick(card.category, card.points)}
                        style={{cursor: clickedCards.includes(card.category) ? 'not-allowed' : 'pointer'}}
                    >
                        <div
                            className={`card text-center shadow-sm h-100 ${
                                clickedCards.includes(card.category) ? 'bg-danger text-white' : ''
                            }`}
                        >
                            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <h5 className="card-title">{card.category}</h5>
                                <p className="card-text ">{card.points} Points</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message={modalMessage}
                initialMessage={initialMessage}
            />
        </div>
    );
};

export default CardMatrix;
