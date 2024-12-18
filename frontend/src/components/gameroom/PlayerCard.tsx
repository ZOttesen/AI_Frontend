import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

interface PlayerCardProps {
    player: { name: string; points: number };
    onUpdatePoints: (delta: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdatePoints }) => {
    return (
        <Card
            className="text-center">
            <Card.Body>
                <Card.Title>{player.name}</Card.Title>
                <Card.Text>Points: {player.points}</Card.Text>
                <Button variant="success" className="me-2" onClick={() => onUpdatePoints(10)}>
                    +10
                </Button>
                <Button variant="danger" onClick={() => onUpdatePoints(-10)}>
                    -10
                </Button>
            </Card.Body>
        </Card>

    );
};

export default PlayerCard;
