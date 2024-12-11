import { User } from './AuthContext';
import {LanguageChoice, PersonalityType} from "./Enums";

export interface Preferences{
    personality: PersonalityType;
    language: LanguageChoice;
}
export interface RabbitMQMessage {
    category: string;
    points: number;
    preferences: Preferences;
}

export interface RabbitMQAnswer {
    answer: string;
    question: string;
    preferences: Preferences;
}

const API_URL = process.env.REACT_APP_AUTH_URL;

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    console.log(`${API_URL}login`);
    try {
        const response = await fetch(`${API_URL}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            console.log("Login successful")
            return { success: true, message: 'Login successful' };
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return { success: false, message: errorData.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Unable to connect to server' };
    }
};

export const fetchUser = async (): Promise<User | null> => {
    try {
        const response = await fetch(`${API_URL}user`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
            return userData; // Returnér kun data
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
    }
    return null; // Returnér null ved fejl
};


export const logoutUser = async (): Promise<void> => {
    await fetch(`${API_URL}logout`, {
        method: 'POST',
        credentials: 'include', // Send cookies med for at logge ud
    });
};



export const sendMessageToRabbitMQ = async (message: RabbitMQMessage) => {
    console.log("Sending message to RabbitMQ:", message);
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message), // Send hele objektet som besked
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, response: data.response };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Failed to send message' };
        }
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
        return { success: false, message: 'An error occurred. Please try again.' };
    }
};

export const answerMessageToRabbitMQ = async (message: RabbitMQAnswer) => {
    console.log("Answering to RabbitMQ:", message);
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message), // Send hele objektet som besked
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, response: data.response };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Failed to send message' };
        }
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
        return { success: false, message: 'An error occurred. Please try again.' };
    }
};

