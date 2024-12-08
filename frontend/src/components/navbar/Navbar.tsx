import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utility/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user, isLoggedIn, login, logout } = useAuth();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle login
    const handleLogin = async () => {
        try {
            const success = await login(email, password); // Kald login-funktionen
            if (!success) {
                setError('Invalid credentials. Please try again.');
            } else {
                setError('');
                setDropdownVisible(false); // Close dropdown on successful login
            }
        } catch (e) {
            console.error('Login error:', e);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/AILogo.png" alt="App Logo" className="navbar-logo" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/register" className="btn me-2">
                                        Register
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={toggleDropdown}
                                    >
                                        Login
                                    </button>
                                    {isDropdownVisible && (
                                        <div className="dropdown-login" ref={dropdownRef}>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleLogin();
                                                }}
                                            >
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {error && <div className="text-danger">{error}</div>}
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100"
                                                >
                                                    Login
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Welcome, {user?.firstName}!</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn me-2" to="/gameroom">
                                        Game Room
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={logout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
