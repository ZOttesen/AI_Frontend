import { jwtDecode } from 'jwt-decode';

interface User {
    userGuid: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_AUTH_URL}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            const user: User = jwtDecode<User>(token); // Dekodér token for brugerdata
            return { success: true, user, token }; // Returnér både token og brugerdata
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login request error:', error);
        return { success: false, message: 'An error occurred. Please try again.' };
    }
};

export const sendMessageToRabbitMQ = async (message: string) => {
    console.log("Sending message to RabbitMQ:", message)
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message }),
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
