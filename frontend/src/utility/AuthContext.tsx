// AuthProvider.tsx
import React, {createContext, useContext, ReactNode, useEffect, useState} from 'react';
import { loginUser, logoutUser, fetchUser } from './APIService';
import { useCacheHandler } from '../hooks/useCacheHandler';

export interface User {
    userGuid: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

interface AuthContextProps {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { cachedData: user, saveToCache, clearCache, trigger } = useCacheHandler<User | null>('user', null);
    const [hasFetchedUser, setHasFetchedUser] = useState(false);

    useEffect(() => {
        (async () => {
            if (!user && !hasFetchedUser) {
                setHasFetchedUser(true);
                const userData = await fetchUser();
                if (userData) {
                    saveToCache(userData);
                } else {
                    clearCache();
                }
            }
        })();
    }, [user, saveToCache, clearCache, trigger, hasFetchedUser]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const result = await loginUser(email, password);
            if (result.success) {
                const userData = await fetchUser();
                saveToCache(userData);
                return true;
            }
        } catch (error) {
            console.error('Login error:', error);
        }
        return false;
    };

    const logout = async () => {
        try {
            await logoutUser();
            clearCache();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user: user ?? null, isLoggedIn: !!user, login, logout }}>
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
