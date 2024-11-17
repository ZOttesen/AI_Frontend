import React, { useState } from 'react';
import './Register.css';

const Register: React.FC = () => {

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            console.log('Registering:', username, firstName, lastName, email, password)
            const response = await fetch('https://localhost:7186/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                setErrorMessage('')
                setIsRegistered(true);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                console.log('Registration failed:', errorData);
            }
        } catch (error) {
            console.error('Registration request error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="register-container">
            {isRegistered ? (
                <p className="success-message">Your account has been created successfully!</p>
            ) : (
            <form onSubmit={handleRegister}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <label htmlFor="Username">Username:</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Enter Username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="firstName">First Name:</label>
                <input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <label htmlFor="lastName">Last Name:</label>
                <input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="text"
                    placeholder="Enter email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            )}
        </div>
    )
};

export default Register;


