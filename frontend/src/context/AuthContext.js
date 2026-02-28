import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('city') || 'Bangalore');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const updateCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem('city', city);
    };

    const login = async (email, password) => {
        const res = await apiLogin({ email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
        if (u.city) updateCity(u.city);
        setToken(t);
        setUser(u);
        return res.data;
    };

    const register = async (name, email, password, phone, confirmPassword) => {
        const res = await apiRegister({ name, email, password, phone, confirmPassword });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('city');
        setToken(null);
        setUser(null);
    };

    const toggleFavorite = async (movieId) => {
        if (!user) return;
        try {
            const res = await API.post('/users/wishlist/toggle', { movieId });
            const updatedUser = { ...user, wishlist: res.data.wishlist };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return res.data;
        } catch (err) {
            console.error("Toggle Favorite Error:", err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, selectedCity, updateCity, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
