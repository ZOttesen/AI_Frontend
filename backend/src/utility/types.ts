export interface Preferences {
    personality: string;
    language: string;
}

export interface Message {
    category: string;
    points: number;
    preferences: Preferences;
}

export interface Answer {
    answer: string;
    question: string;
    preferences: Preferences;
}
