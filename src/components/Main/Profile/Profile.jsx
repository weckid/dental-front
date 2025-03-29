import React from "react";
import "./ProfileStyle.css";

const Profile = () => {
    // Состояние для данных пользователя
    const [userData, setUserData] = useState({
      username: 'user123',
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'user@example.com',
      phone: '+79123456789',
      avatar: 'https://via.placeholder.com/150',
    });
  
    // Состояние для формы изменения пароля
    const [passwordForm, setPasswordForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  
    // Состояние для редактирования
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    // Обработчик изменения данных
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Обработчик изменения пароля
    const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswordForm(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Обработчик загрузки фото
    const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserData(prev => ({
            ...prev,
            avatar: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    };
  
    // Обработчик сохранения данных
    const handleSave = async () => {
      try {
        // Здесь должен быть API-запрос для сохранения данных
        // await axios.put('/api/profile', userData);
        setIsEditing(false);
        setSuccess('Данные успешно обновлены');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Ошибка при обновлении данных');
        setTimeout(() => setError(''), 3000);
      }
    };
  
    // Обработчик смены пароля
    const handlePasswordSave = async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('Новые пароли не совпадают');
        setTimeout(() => setError(''), 3000);
        return;
      }
  
      try {
        // Здесь должен быть API-запрос для смены пароля
        // await axios.put('/api/change-password', {
        //   currentPassword: passwordForm.currentPassword,
        //   newPassword: passwordForm.newPassword
        // });
        
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
        setSuccess('Пароль успешно изменен');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Ошибка при изменении пароля. Проверьте текущий пароль.');
        setTimeout(() => setError(''), 3000);
      }
    };
  
    return (
      <div style={ProfileStyle.container}>
        <div style={ProfileStyle.header}>
          <label htmlFor="avatar-upload">
            <img 
              src={userData.avatar} 
              alt="Profile" 
              style={ProfileStyle.photo}
            />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={ProfileStyle.photoUpload}
          />
          <div style={ProfileStyle.info}>
            <h1 style={ProfileStyle.name}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    style={{...ProfileStyle.input, width: 'auto', marginRight: '5px'}}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    style={{...ProfileStyle.input, width: 'auto'}}
                  />
                </>
              ) : (
                `${userData.firstName} ${userData.lastName}`
              )}
            </h1>
            <p style={ProfileStyle.email}>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  style={ProfileStyle.input}
                />
              ) : (
                userData.email
              )}
            </p>
          </div>
        </div>
  
        <div style={ProfileStyle.section}>
          <h2 style={ProfileStyle.sectionTitle}>Основная информация</h2>
          <div style={ProfileStyle.formGroup}>
            <label style={ProfileStyle.label}>Логин</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                style={ProfileStyle.input}
              />
            ) : (
              <p>{userData.username}</p>
            )}
          </div>
          <div style={ProfileStyle.formGroup}>
            <label style={ProfileStyle.label}>Телефон</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                style={ProfileStyle.input}
              />
            ) : (
              <p>{userData.phone}</p>
            )}
          </div>
        </div>
  
        {!isChangingPassword ? (
          <div style={ProfileStyle.section}>
            <button 
              style={ProfileStyle.button} 
              onClick={() => setIsChangingPassword(true)}
            >
              Изменить пароль
            </button>
          </div>
        ) : (
          <div style={ProfileStyle.section}>
            <h2 style={ProfileStyle.sectionTitle}>Изменение пароля</h2>
            <div style={ProfileStyle.formGroup}>
              <label style={ProfileStyle.label}>Текущий пароль</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                style={ProfileStyle.input}
              />
            </div>
            <div style={ProfileStyle.formGroup}>
              <label style={ProfileStyle.label}>Новый пароль</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                style={ProfileStyle.input}
              />
            </div>
            <div style={ProfileStyle.formGroup}>
              <label style={ProfileStyle.label}>Подтвердите новый пароль</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                style={ProfileStyle.input}
              />
            </div>
            <button 
              style={ProfileStyle.button} 
              onClick={handlePasswordSave}
            >
              Сохранить пароль
            </button>
            <button 
              style={ProfileStyle.buttonSecondary} 
              onClick={() => setIsChangingPassword(false)}
            >
              Отмена
            </button>
          </div>
        )}
  
        <div style={ProfileStyle.section}>
          {!isEditing ? (
            <button 
              style={ProfileStyle.button} 
              onClick={() => setIsEditing(true)}
            >
              Редактировать профиль
            </button>
          ) : (
            <>
              <button 
                style={ProfileStyle.button} 
                onClick={handleSave}
              >
                Сохранить изменения
              </button>
              <button 
                style={ProfileStyle.buttonSecondary} 
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </button>
            </>
          )}
        </div>
  
        {error && <p style={ProfileStyle.error}>{error}</p>}
        {success && <p style={ProfileStyle.success}>{success}</p>}
      </div>
    );
  };
  
  export default Profile;