import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    const now = ((currentStep + 1) / totalSteps) * 100;
    return (
        <div className="my-4">
            <ProgressBar now={now} label={`${currentStep + 1}/${totalSteps}`} />
        </div>
    );
};

export default StepIndicator;
