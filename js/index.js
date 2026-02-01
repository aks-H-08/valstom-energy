const approvedClientsSwiper = new Swiper('.approved-clients-swiper', {
    loop: true,
    speed: 3500,
    autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
    },
    slidesPerView: 5,
    spaceBetween: 30,
    breakpoints: {
    0: { slidesPerView: 1 },
    576: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    992: { slidesPerView: 4 },
    1200: { slidesPerView: 5 }
    }
});