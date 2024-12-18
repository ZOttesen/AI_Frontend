import React from 'react';
import { PersonalityType } from '../../../utility/Enums';
import { Row, Col, Button } from 'react-bootstrap';

interface PersonalityStepProps {
    onSelect: (value: PersonalityType) => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({ onSelect }) => {
    const personalityOptions = Object.values(PersonalityType);

    return (
        <div className="fade show">
            <h3 className="mb-4">Choose personality</h3>
            <Row>
                {personalityOptions.map((p) => (
                    <Col key={p} xs={6} sm={4} className="mb-3">
                        <Button variant="outline-primary" className="w-100"
                                onClick={() => onSelect(p as PersonalityType)}>
                            {p}
                        </Button>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PersonalityStep;
