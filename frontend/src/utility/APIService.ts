export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch('https://localhost:7186/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
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
        const response = await fetch('http://localhost:5000/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
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
