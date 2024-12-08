import React from 'react';
import { PersonalityType, LanguageChoice } from '../../utility/Enums';

interface PreferenceFormProps {
    selectedPersonality: PersonalityType | null;
    selectedLanguage: LanguageChoice | null;
    customCategories: string[];
    onCategoryChange: (index: number, value: string) => void;
    onPersonalityChange: (value: PersonalityType) => void;
    onLanguageChange: (value: LanguageChoice) => void;
    onSubmit: () => void;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({
                                                           selectedPersonality,
                                                           selectedLanguage,
                                                           customCategories,
                                                           onCategoryChange,
                                                           onPersonalityChange,
                                                           onLanguageChange,
                                                           onSubmit,
                                                       }) => {
    return (
        <div>
            <h1>Set Your Preferences</h1>

            <div>
                <label htmlFor="personality-select">Choose Personality:</label>
                <select
                    id="personality-select"
                    value={selectedPersonality || ''}
                    onChange={(e) => onPersonalityChange(e.target.value as PersonalityType)}
                >
                    <option value="">-- Select Personality --</option>
                    {Object.values(PersonalityType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="language-select">Choose Language:</label>
                <select
                    id="language-select"
                    value={selectedLanguage || ''}
                    onChange={(e) => onLanguageChange(e.target.value as LanguageChoice)}
                >
                    <option value="">-- Select Language --</option>
                    {Object.values(LanguageChoice).map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h3>Custom Categories:</h3>
                {customCategories.map((category, index) => (
                    <div key={index}>
                        <label htmlFor={`category-${index}`}>Category {index + 1}:</label>
                        <input
                            id={`category-${index}`}
                            type="text"
                            value={category}
                            onChange={(e) => onCategoryChange(index, e.target.value)}
                            maxLength={25}
                            placeholder="Enter category (max 25 chars)"
                        />
                    </div>
                ))}
            </div>

            <button onClick={onSubmit} style={{ marginTop: '10px' }}>
                Submit
            </button>
        </div>
    );
};

export default PreferenceForm;
