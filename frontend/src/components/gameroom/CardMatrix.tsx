import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import { sendMessageToRabbitMQ } from '../../utility/APIService';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';
import { RabbitMQMessage } from '../../utility/APIService';
import { audioService } from '../../utility/AudioPlayer';

interface CardMatrixProps {
    cards: { category: string; points: number }[];
}

interface UserPreferences {
    selectedPersonality: PersonalityType | null;
    selectedLanguage: LanguageChoice | null;
}

const CardMatrix: React.FC<CardMatrixProps> = ({ cards }) => {
    const { cachedData } = useCacheHandler<UserPreferences>('DashboardPreferences');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | undefined>();
    const [initialMessage, setInitialMessage] = useState<string | undefined>(); // Tilføjet state til RabbitMQ's første besked

    const handleCardClick = async (category: string, points: number) => {
        const message: RabbitMQMessage = {
            category,
            points,
            preferences: {
                personality: cachedData?.selectedPersonality || PersonalityType.FRIENDLY,
                language: cachedData?.selectedLanguage || LanguageChoice.ENGLISH,
            },
        };

        console.log(message.preferences);

        setIsModalVisible(true); // Vis modal, når knappen trykkes
        setModalMessage('Sending message...');

        try {
            const response = await sendMessageToRabbitMQ(message);

            if (response.success && response.response) {
                const { audio_url, text } = response.response;

                // Gem beskeden som initialMessage
                setInitialMessage(text);

                // Opdater modal med en statusbesked
                setModalMessage(`Message from RabbitMQ received.`);

                // Afspil lydfilen fra audio_url
                if (audio_url) {
                    audioService.playAudio(audio_url);
                } else {
                    console.warn('No audio URL provided in the response.');
                }
            } else {
                setModalMessage(`Error: ${response.message || 'Unknown error'}`);
                audioService.playAudio('/audio/error.mp3'); // Brug en standard-fejllyd
            }
        } catch (error) {
            setModalMessage('An unexpected error occurred.');
            console.error('Error in handleCardClick:', error);
        }
    };

    return (
        <div style={matrixStyles.container}>
            {cards.map((card, index) => (
                <div key={index} style={matrixStyles.card}>
                    <Card
                        category={card.category}
                        points={card.points}
                        onButtonClick={() => handleCardClick(card.category, card.points)}
                    />
                </div>
            ))}
            <Modal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message={modalMessage}
                initialMessage={initialMessage} // Send initialMessage til modal
            />
        </div>
    );
};

const matrixStyles = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
    },
    card: {
        display: 'flex',
        justifyContent: 'center',
    },
};

export default CardMatrix;
