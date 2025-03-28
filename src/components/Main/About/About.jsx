import React from "react";
import "swiper/css"; // Основные стили Swiper
import "swiper/css/pagination"; // Стили для пагинации
import "swiper/css/navigation"; // Стили для навигации
import { Pagination, Navigation } from "swiper/modules"; // Импорт модулей
import { Swiper, SwiperSlide } from "swiper/react";
import "./AboutStyle.css";

const About = () => {
  return (
    <main className="swiper-container">
      <div className="about-content">

      
      <Swiper
        className="mySwiper"
        modules={[Pagination, Navigation]} // Передаем модули
        pagination={{ clickable: true }}
        navigation
      >
        <SwiperSlide>
          <div className="slider_img">
            <img src="/slider1.png" alt="Забота о вашем здоровье" />
          </div>
          <div className="swiper_content">
            <h2>Забота о вашем здоровье</h2>
            <p>
              Наша стоматология направлена на предоставление высококачественного
              медицинского обслуживания, основанного на уважении и внимании к
              каждому пациенту. Мы стремимся улучшать здоровье и качество жизни
              наших клиентов.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider_img">
            <img src="slider2.png" alt="Команда экспертов" />
          </div>
          <div className="swiper_content">
            <h2>Команда экспертов</h2>
            <p>
              Мы гордимся своим квалифицированным и опытным медицинским
              персоналом, который состоит из врачей, медсестер и стоматологов.
              Наша команда работает с готовностью предоставлять услуги на самом
              высоком уровне.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider_img">
            <img src="slider.png" alt="Современные технологии" />
          </div>
          <div className="swiper_content">
            <h2>Современные технологии</h2>
            <p>
              Мы используем передовые методы диагностики и лечения, чтобы
              обеспечить максимальную эффективность в нашей работе. Оснащение
              нашей клиники современным медицинским оборудованием позволяет нам
              достигать лучших результатов.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider_img">
            <img src="/comfort.jpg" alt="Комфорт и удобство" />
          </div>
          <div className="swiper_content">
            <h2>Комфорт и удобство</h2>
            <p>
              Мы понимаем, насколько важны комфорт и удобство при посещении
              клиники. Поэтому мы предлагаем удобное расположение, комфортные
              условия ожидания и индивидуальный подход к каждому пациенту.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider_img">
            <img src="view.jpeg" alt="Ваше мнение важно" />
          </div>
          <div className="swiper_content">
            <h2>Ваше мнение важно</h2>
            <p>
              Мы ценим каждое мнение наших пациентов. Ваши отзывы помогают нам
              совершенствоваться и предоставлять услуги на более высоком уровне.
              Делитесь вашим опытом, чтобы сделать нашу клинику еще лучше!
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
      </div>
    </main>
  );
};

export default About;