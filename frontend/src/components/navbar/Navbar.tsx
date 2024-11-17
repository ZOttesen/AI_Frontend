import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LoginDropdown from './Login';

const Navbar: React.FC = () => {
    const [isLoginDropdownVisible, setLoginDropdownVisible] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null); // Opdateret til HTMLLIElement

    const toggleLoginDropdown = (event: React.MouseEvent) => {
        event.preventDefault();
        setLoginDropdownVisible(!isLoginDropdownVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    };

    const handleLogin = (email: string, password: string) => {
        console.log('Login successful:', email);
        localStorage.setItem('token', 'dummy_token'); // eller brug en faktisk token hvis det er muligt
        setLoggedIn(true);
        setLoginDropdownVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLoginDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/AILogo.png" alt="Game Logo" className="navbar-logo" />
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
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        </li>

                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item" ref={dropdownRef}>
                                <button className="btn btn-outline-light" onClick={toggleLoginDropdown}>
                                    Login
                                </button>
                                {isLoginDropdownVisible && (
                                    <LoginDropdown onLogin={handleLogin} />
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
