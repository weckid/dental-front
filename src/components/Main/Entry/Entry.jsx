
import "./EntryStyle.css";

export const Entry = () => {
 

    return (
        <main className="entry-page">
            <div className="entry-container">
                {/* Hero секция */}
                <section className="entry-hero">
                    <h1 className="entry-title">Запись на прием к стоматологу</h1>
                    <p className="entry-subtitle">
                        Добро пожаловать в клинику RX! Мы предлагаем современные стоматологические услуги 
                        с комфортом и заботой о каждом пациенте.
                    </p>
                </section>

                {/* Способы записи */}
                <section className="entry-methods">
                    <h2 className="section-title">Способы записи</h2>
                    <div className="methods-grid">
                        <div className="method-card">
                            <div className="method-icon">📱</div>
                            <h3>Онлайн-запись</h3>
                            <p>Заполните форму ниже и мы свяжемся с вами для подтверждения записи</p>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">📞</div>
                            <h3>По телефону</h3>
                            <p><strong>(111) 123-45-67</strong> с 9:00 до 18:00</p>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">💬</div>
                            <h3>Мессенджеры</h3>
                            <p>WhatsApp/Telegram: <strong>(111) 123-45-67</strong></p>
                        </div>
                    </div>
                </section>

               

                {/* Подготовка к приему */}
                <section className="preparation-section">
                    <h2 className="section-title">Подготовка к приему</h2>
                    <div className="preparation-tips">
                        <div className="tip-card">
                            <h3>Документы</h3>
                            <p>Возьмите с собой паспорт и медицинский полис (если есть)</p>
                        </div>
                        <div className="tip-card">
                            <h3>Анализы</h3>
                            <p>Принесите результаты предыдущих обследований</p>
                        </div>
                        <div className="tip-card">
                            <h3>Вопросы</h3>
                            <p>Запишите вопросы, которые хотите задать врачу</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};