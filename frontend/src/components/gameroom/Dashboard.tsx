import React, { useEffect, useState } from 'react';
import { useCacheHandler } from '../../hooks/useCacheHandler';
import PreferenceForm from './PreferenceForm';
import MatrixView from './MatrixView';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';

const CACHE_KEY = 'DashboardPreferences';

const Dashboard: React.FC = () => {
    // Initialiser cachehandler med inputparametre
    const { cachedData, saveToCache, clearCache } = useCacheHandler<{
        selectedPersonality: PersonalityType | null;
        selectedLanguage: LanguageChoice | null;
        customCategories: string[];
    }>(CACHE_KEY, {
        selectedPersonality: null,
        selectedLanguage: null,
        customCategories: ['', '', ''],
    });

    const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageChoice | null>(null);
    const [customCategories, setCustomCategories] = useState<string[]>(['', '', '']);
    const [showMatrix, setShowMatrix] = useState(false);

    // Synkroniser state med cachedData
    useEffect(() => {
        if (
            !cachedData ||
            !cachedData.customCategories ||
            cachedData.customCategories.every((cat: string) => cat === '')
        ) {
            setShowMatrix(false);
        } else {
            setSelectedPersonality(cachedData.selectedPersonality);
            setSelectedLanguage(cachedData.selectedLanguage);
            setCustomCategories(cachedData.customCategories);
            setShowMatrix(true);
        }
    }, [cachedData]);

    const handleSubmit = () => {
        if (!selectedPersonality || !selectedLanguage) {
            alert('Please select both personality and language.');
            return;
        }

        if (customCategories.some((category) => category.trim() === '')) {
            alert('Please fill out all categories.');
            return;
        }

        saveToCache({
            selectedPersonality,
            selectedLanguage,
            customCategories,
        });

        setShowMatrix(true);
    };

    const handleReset = () => {
        clearCache(); // Ryd cache og localStorage
        setSelectedPersonality(null);
        setSelectedLanguage(null);
        setCustomCategories(['', '', '']);
        setShowMatrix(false); // Skift til formularvisning
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
        <div>
            {!showMatrix ? (
                <PreferenceForm
                    selectedPersonality={selectedPersonality}
                    selectedLanguage={selectedLanguage}
                    customCategories={customCategories}
                    onCategoryChange={(index, value) => {
                        const updatedCategories = [...customCategories];
                        updatedCategories[index] = value.slice(0, 25);
                        setCustomCategories(updatedCategories);
                    }}
                    onPersonalityChange={(value) => setSelectedPersonality(value)}
                    onLanguageChange={(value) => setSelectedLanguage(value)}
                    onSubmit={handleSubmit}
                />
            ) : (
                <div>
                    <MatrixView matrixData={generateMatrixData()} />
                    <button onClick={handleReset} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
                        Start på ny
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
