import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utility/AuthContext';

interface GameRoomProps {
    children: JSX.Element;
}

const GameRoomRoute: React.FC<GameRoomProps> = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    console.log('isLoggedIn i komponent:', isLoggedIn);

    console.log(user?.username);

    if (!isLoggedIn) {
        console.log('User is not logged in');
        return <Navigate to="/" replace />;
    }
    console.log('User is logged in')

    return children;
};

export default GameRoomRoute;
