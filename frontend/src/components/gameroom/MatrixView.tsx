import React, { useEffect, useState } from 'react';
import CardMatrix from './CardMatrix';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { Row, Col } from 'react-bootstrap';
import PlayerCard from "./PlayerCard";

interface MatrixViewProps {
    matrixData: { category: string; points: number }[];
}

interface CachedData {
    players: { name: string; points: number }[];
    selectedPersonality?: any;
    selectedLanguage?: any;
    customCategories?: string[];
    lockedCards?: number[];
}

const MatrixView: React.FC<MatrixViewProps> = ({ matrixData }) => {
    const { cachedData, saveToCache } = useCacheHandler<CachedData>('DashboardPreferences');
    const [players, setPlayers] = useState<{ name: string; points: number }[]>([]);
    const [lockedCards, setLockedCards] = useState<number[]>([]); // Ændr til number[]

    useEffect(() => {
        if (cachedData?.players) {
            setPlayers(cachedData.players);
        }
        if (Array.isArray(cachedData?.lockedCards)) {
            setLockedCards(cachedData!.lockedCards);
        }
    }, [cachedData]);

    const updatePlayerPoints = (index: number, delta: number) => {
        const updated = [...players];
        updated[index].points += delta;
        setPlayers(updated);

        saveToCache({
            ...cachedData,
            players: updated,
            lockedCards: lockedCards || []
        });
    };

    const handleLockCardsUpdate = (updatedLockedCards: number[]) => {
        setLockedCards(updatedLockedCards);
        saveToCache({
            ...cachedData,
            players: players,
            lockedCards: updatedLockedCards
        });
    };

    return (
        <div>
            <div className="mb-4">
                <h4>Players:</h4>
                <Row>
                    {players.map((player, index) => (
                        <Col xs={12} sm={6} md={3} className="mb-3" key={index}>
                            <PlayerCard
                                player={player}
                                onUpdatePoints={(delta) => updatePlayerPoints(index, delta)}
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <CardMatrix
                cards={matrixData.map((card, i) => ({
                    id: i,
                    category: card.category,
                    points: card.points,
                    locked: lockedCards.includes(i)
                }))}
                onLockCardsUpdate={handleLockCardsUpdate}
            />
        </div>
    );
};
export default MatrixView;
