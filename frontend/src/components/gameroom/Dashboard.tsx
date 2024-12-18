import React, { useEffect, useState } from 'react';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';
import { Container, Button } from 'react-bootstrap';
import MatrixView from './MatrixView';

import StepIndicator from './gamesetup/StepIndicator';
import PlayerSetupStep from './gamesetup/PlayerSetupStep';
import PersonalityStep from './gamesetup/PersonalityStep';
import LanguageStep from './gamesetup/LanguageStep';
import CategoryStep from './gamesetup/CategoryStep';

const CACHE_KEY = 'DashboardPreferences';

interface CachedData {
    players: { name: string; points: number }[];
    selectedPersonality: PersonalityType | null;
    selectedLanguage: LanguageChoice | null;
    customCategories: string[];
}

const Dashboard: React.FC = () => {
    const { cachedData, saveToCache, clearCache, trigger } = useCacheHandler<CachedData>(CACHE_KEY, {
        players: [],
        selectedPersonality: null,
        selectedLanguage: null,
        customCategories: ['', '', ''],
    });

    const [players, setPlayers] = useState<{ name: string; points: number }[]>([]);
    const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageChoice | null>(null);
    const [customCategories, setCustomCategories] = useState<string[]>(['', '', '']);
    const [showMatrix, setShowMatrix] = useState(false);

    // Steps: 0 = player setup, 1 = personality, 2 = language, 3 = categories
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!cachedData || !cachedData.customCategories || cachedData.customCategories.every((cat) => cat === '')) {
            setShowMatrix(false);
            setCurrentStep(0);
        } else {
            setPlayers(cachedData.players || []);
            setSelectedPersonality(cachedData.selectedPersonality);
            setSelectedLanguage(cachedData.selectedLanguage);
            setCustomCategories(cachedData.customCategories);
            setShowMatrix(true);
        }
    }, [cachedData, trigger]);

    const handleCategoryChange = (index: number, value: string) => {
        const updatedCategories = [...customCategories];
        updatedCategories[index] = value.slice(0, 25);
        setCustomCategories(updatedCategories);
    };

    const handleFinalSubmit = () => {
        if (!selectedPersonality || !selectedLanguage) {
            alert('Please select both personality and language.');
            return;
        }
        if (customCategories.some((category) => category.trim() === '')) {
            alert('Please fill out all categories.');
            return;
        }
        if (players.length === 0) {
            alert('Please set up players first.');
            return;
        }

        saveToCache({
            players,
            selectedPersonality,
            selectedLanguage,
            customCategories,
        });

        setShowMatrix(true);
    };

    const handleReset = () => {
        clearCache();
        setPlayers([]);
        setSelectedPersonality(null);
        setSelectedLanguage(null);
        setCustomCategories(['', '', '']);
        setShowMatrix(false);
        setCurrentStep(0);
    };

    const generateMatrixData = () => {
        return [
            { category: customCategories[0], points: 10 },
            { category: customCategories[1], points: 10 },
            { category: customCategories[2], points: 10 },
            { category: customCategories[0], points: 20 },
            { category: customCategories[1], points: 20 },
            { category: customCategories[2], points: 20 },
            { category: customCategories[0], points: 30 },
            { category: customCategories[1], points: 30 },
            { category: customCategories[2], points: 30 },
        ];
    };

    return (
        <Container className="py-5">
            {!showMatrix ? (
                <>
                    <h1 className="mb-4">Setup Game Preferences</h1>
                    <StepIndicator currentStep={currentStep} totalSteps={4} />

                    {currentStep === 0 && (
                        <PlayerSetupStep
                            onSubmit={(playerData) => {
                                setPlayers(playerData);
                                setCurrentStep(1);
                            }}
                        />
                    )}

                    {currentStep === 1 && (
                        <PersonalityStep
                            onSelect={(p) => {
                                setSelectedPersonality(p);
                                setCurrentStep(2);
                            }}
                        />
                    )}

                    {currentStep === 2 && (
                        <LanguageStep
                            onSelect={(l) => {
                                setSelectedLanguage(l);
                                setCurrentStep(3);
                            }}
                        />
                    )}

                    {currentStep === 3 && (
                        <CategoryStep
                            categories={customCategories}
                            onCategoryChange={handleCategoryChange}
                            onSubmit={handleFinalSubmit}
                        />
                    )}
                </>
            ) : (
                <div>
                    <MatrixView matrixData={generateMatrixData()} />
                    <Button onClick={handleReset} style={{ marginTop: '20px' }} variant="danger">
                        Reset Game
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default Dashboard;
