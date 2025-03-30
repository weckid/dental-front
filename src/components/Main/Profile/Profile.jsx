import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileStyle.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        login: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUserData({
                    login: response.data.username,
                    email: response.data.email
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Не удалось загрузить данные профиля');
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="entry-page">
                <div className="entry-container">
                    <div className="loading-spinner">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="entry-page">
                <div className="entry-container">
                    <div className="error-message">{error}</div>
                    <button 
                        className="submit-btn"
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="entry-page">
            <div className="entry-container">
                <div className="entry-hero">
                    <h1 className="entry-title">Профиль пользователя</h1>
                    <p className="entry-subtitle">Здесь вы можете просмотреть свои данные</p>
                </div>

                <div className="profile-content">
                    <div className="section-title">Личная информация</div>
                    
                    <div className="profile-info">
                        <div className="profile-field">
                            <span className="profile-label">Логин:</span>
                            <span className="profile-value">{userData.login}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Email:</span>
                            <span className="profile-value">{userData.email}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button 
                            className="submit-btn"
                            onClick={handleLogout}
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;