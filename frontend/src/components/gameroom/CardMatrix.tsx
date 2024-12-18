import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { sendMessageToRabbitMQ } from '../../utility/APIService';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';
import { RabbitMQMessage } from '../../utility/APIService';
import { audioService } from '../../utility/AudioPlayer';

interface Card {
    id: number;
    category: string;
    points: number;
    locked?: boolean;
}

interface CardMatrixProps {
    cards: Card[];
    onLockCardsUpdate?: (updatedLockedCards: number[]) => void; // number[] her
}

const CardMatrix: React.FC<CardMatrixProps> = ({ cards, onLockCardsUpdate }) => {
    const { cachedData, saveToCache } = useCacheHandler<any>('DashboardPreferences');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | undefined>();
    const [initialMessage, setInitialMessage] = useState<string | undefined>();
    const [lockedCards, setLockedCards] = useState<number[]>([]); // number[]

    useEffect(() => {
        if (Array.isArray(cachedData?.lockedCards)) {
            setLockedCards(cachedData.lockedCards);
        }
    }, [cachedData]);

    const handleCardClick = async (card: Card) => {
        if (lockedCards.includes(card.id)) return;

        setIsModalVisible(true);
        setModalMessage('Sending message...');

        const message: RabbitMQMessage = {
            category: card.category,
            points: card.points,
            preferences: {
                personality: cachedData?.selectedPersonality || PersonalityType.FRIENDLY,
                language: cachedData?.selectedLanguage || LanguageChoice.ENGLISH,
            },
        };

        try {
            const response = await sendMessageToRabbitMQ(message);

            if (response.success && response.response) {
                const { audio_url, text } = response.response;

                setInitialMessage(text);
                setModalMessage('Message from RabbitMQ received.');

                const updatedLockedCards = [...lockedCards, card.id];
                setLockedCards(updatedLockedCards);

                // Persist lockedCards in cache
                saveToCache({
                    ...cachedData,
                    lockedCards: updatedLockedCards
                });

                if (onLockCardsUpdate) {
                    onLockCardsUpdate(updatedLockedCards);
                }

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
        <div className="mt-4">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {cards.map((card) => {
                    const isLocked = lockedCards.includes(card.id);
                    return (
                        <div
                            key={card.id}
                            className={`col ${isLocked ? 'disabled-card' : ''}`}
                            onClick={() => !isLocked && handleCardClick(card)}
                            style={{
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <div
                                className={`card text-center shadow-sm h-100 ${
                                    isLocked ? 'bg-danger text-white' : ''
                                }`}
                            >
                                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                    <h5 className="card-title">{card.category}</h5>
                                    <p className="card-text">{card.points} Points</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
