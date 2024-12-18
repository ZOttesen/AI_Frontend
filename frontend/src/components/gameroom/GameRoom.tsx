import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utility/AuthContext';

interface GameRoomProps {
    children: React.ReactElement;
}

const GameRoomRoute: React.FC<GameRoomProps> = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default GameRoomRoute;
