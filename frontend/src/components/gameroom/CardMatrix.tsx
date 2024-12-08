import React from 'react';
import Card from './Card'; // Importér den tidligere Card-komponent

interface CardMatrixProps {
    cards: { category: string; points: number; onButtonClick: () => void }[];
}

const CardMatrix: React.FC<CardMatrixProps> = ({ cards }) => {
    return (
        <div style={matrixStyles.container}>
            {cards.map((card, index) => (
                <div key={index} style={matrixStyles.card}>
                    <Card
                        category={card.category}
                        points={card.points}
                        onButtonClick={card.onButtonClick}
                    />
                </div>
            ))}
        </div>
    );
};

// CSS styles til matrixen
const matrixStyles: {
    container: React.CSSProperties;
    card: React.CSSProperties;
} = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px',
    },
    card: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default CardMatrix;
