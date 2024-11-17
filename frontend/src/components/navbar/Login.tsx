import React, { useState } from 'react';
import { loginUser } from "../../utility/APIService";

interface LoginDropdownProps {
    onLogin: (email: string, password: string) => void;
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const result = await loginUser(email, password);

        if (result.success) {
            console.log('Login successful:', result.data);

            if (result.data.token) {
                localStorage.setItem('token', result.data.token); // Save token
                onLogin(email, result.data.token); // Call onLogin with email and token
            } else {
                setErrorMessage('Login successful, but no token provided.');
            }
        } else {
            setErrorMessage(result.message || 'Invalid credentials');
        }
    };

    return (
        <div className="dropdown-login">
            <form onSubmit={handleLogin}>
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

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="btn btn-primary w-100 mt-2">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginDropdown;
