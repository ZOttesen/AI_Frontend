import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useCacheHandler } from '../hooks/useCacheHandler'; // Importer hook
import { loginUser } from './APIService';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';

// Brugerens data type
interface User {
    userGuid: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

// AuthContext props
interface AuthContextProps {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    // Brug useCacheHandler til at håndtere cachen
    const { cachedData, saveToCache, clearCache } = useCacheHandler<User | null>('user', null);

    // Lokal state for at sikre øjeblikkelig opdatering af bruger
    const [user, setUser] = useState<User | null>(cachedData ?? null);

    const fetchUserFromToken = async (): Promise<User | null> => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: User = jwtDecode(token);
                return decoded;
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
        return null;
    };

    // Synkroniser cache med lokal state ved første render eller ændringer
    useEffect(() => {
        setUser(cachedData); // Opdater lokal state baseret på cachedData
    }, [cachedData]);

    const login = async (email: string, password: string): Promise<boolean> => {
        const result = await loginUser(email, password);
        if (result.success && result.user && result.token) {
            localStorage.setItem('token', result.token); // Gem token i localStorage
            saveToCache(result.user); // Gem bruger i cache
            setUser(result.user); // Opdater lokal state
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token'); // Fjern token fra localStorage
        clearCache(); // Ryd cache via useCacheHandler
        queryClient.setQueryData(['user'], null); // Ryd React Query-cachen
        setUser(null); // Opdater lokal state til null
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
