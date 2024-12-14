import React from 'react';
import CardMatrix from './CardMatrix';

interface MatrixViewProps {
    matrixData: { category: string; points: number }[];
}

const MatrixView: React.FC<MatrixViewProps> = ({ matrixData }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <CardMatrix
                cards={matrixData.map((card) => ({
                    category: card.category,
                    points: card.points,
                }))}
            />
        </div>
    );
};

export default MatrixView;
