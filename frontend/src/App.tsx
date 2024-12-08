import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Navbar from './components/navbar/Navbar';
import Register from './components/register/Register';
import { AuthProvider } from './utility/AuthContext';
import GameRoomRoute from './components/gameroom/GameRoom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from "./components/gameroom/Dashboard";
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/gameroom"
                            element={
                                <GameRoomRoute>
                                    <Dashboard />
                                </GameRoomRoute>
                            }
                        />
                    </Routes>
                </Router>
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
