import React from 'react';
import { LanguageChoice } from '../../../utility/Enums';
import { Row, Col, Button } from 'react-bootstrap';

interface LanguageStepProps {
    onSelect: (value: LanguageChoice) => void;
}

const LanguageStep: React.FC<LanguageStepProps> = ({ onSelect }) => {
    const languageOptions = Object.values(LanguageChoice);

    return (
        <div className="fade show">
            <h3 className="mb-4">Choose language for the AI</h3>
            <Row>
                {languageOptions.map((lang) => (
                    <Col key={lang} xs={6} sm={4} className="mb-3">
                        <Button variant="outline-primary" className="w-100"
                                onClick={() => onSelect(lang as LanguageChoice)}>
                            {lang}
                        </Button>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default LanguageStep;
