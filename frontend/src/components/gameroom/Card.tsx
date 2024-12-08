import React from 'react';

interface CardProps {
    category: string; // Kategoriens tekst
    points: number; // Antal point for kortet
    onButtonClick: () => void; // Hvad der sker, når knappen trykkes
    buttonText?: string; // Tekst på knappen (valgfri, standard er "Click Me")
}

const Card: React.FC<CardProps> = ({ category, points, onButtonClick, buttonText = "Click Me" }) => {
    return (
        <div style={cardStyles.cardContainer}>
            <h2 style={cardStyles.categoryText}>{category.toUpperCase()}</h2>
            <div style={cardStyles.pointsBox}>
                <span style={cardStyles.pointsText}>{points}</span>
                <p style={cardStyles.pointsLabel}>Points</p>
            </div>
            <button style={cardStyles.button} onClick={onButtonClick}>
                {buttonText}
            </button>
        </div>
    );
};

// Stilarter defineret med React.CSSProperties
const cardStyles: {
    cardContainer: React.CSSProperties;
    categoryText: React.CSSProperties;
    pointsBox: React.CSSProperties;
    pointsText: React.CSSProperties;
    pointsLabel: React.CSSProperties;
    button: React.CSSProperties;
} = {
    cardContainer: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    categoryText: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333',
    },
    pointsBox: {
        margin: '20px 0',
        padding: '10px',
        backgroundColor: '#007BFF',
        borderRadius: '8px',
        color: '#fff',
        textAlign: 'center',
    },
    pointsText: {
        fontSize: '36px',
        fontWeight: 'bold',
        margin: '0',
    },
    pointsLabel: {
        fontSize: '14px',
        margin: '0',
    },
    button: {
        padding: '8px 16px',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Card;
