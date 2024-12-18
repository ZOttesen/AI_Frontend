import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

interface PlayerSetupStepProps {
    onSubmit: (players: { name: string; points: number }[]) => void;
}

const PlayerSetupStep: React.FC<PlayerSetupStepProps> = ({ onSubmit }) => {
    const [playerCount, setPlayerCount] = useState(2);
    const [playerNames, setPlayerNames] = useState<string[]>(['', '']);

    const handlePlayerCountChange = (count: number) => {
        setPlayerCount(count);
        // Adjust playerNames array length
        const updated = [...playerNames];
        if (updated.length < count) {
            while (updated.length < count) {
                updated.push('');
            }
        } else if (updated.length > count) {
            updated.splice(count);
        }
        setPlayerNames(updated);
    };

    const handleNameChange = (index: number, value: string) => {
        const updated = [...playerNames];
        updated[index] = value;
        setPlayerNames(updated);
    };

    const handleSubmit = () => {
        if (playerNames.some(name => name.trim() === '')) {
            alert('Please fill out all player names.');
            return;
        }
        const players = playerNames.map(name => ({ name, points: 0 }));
        onSubmit(players);
    };

    return (
        <div className="fade show">
            <h3 className="mb-4">Choose amount of players and player names</h3>
            <div className="mb-3">
                <Button
                    variant={playerCount === 2 ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => handlePlayerCountChange(2)}
                >
                    2 Players
                </Button>
                <Button
                    variant={playerCount === 3 ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => handlePlayerCountChange(3)}
                >
                    3 Players
                </Button>
                <Button
                    variant={playerCount === 4 ? 'primary' : 'outline-primary'}
                    onClick={() => handlePlayerCountChange(4)}
                >
                    4 Players
                </Button>
            </div>
            {playerNames.map((name, index) => (
                <Form.Group className="mb-3" key={index}>
                    <Form.Label>Player {index + 1} Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        style={{ backgroundColor: '#2f2f2f', color: '#f9f9f9' }}
                    />
                </Form.Group>
            ))}
            <Button variant="success" onClick={handleSubmit}>Next</Button>
        </div>
    );
};

export default PlayerSetupStep;
