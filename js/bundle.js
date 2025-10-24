const clientsCarousel = new Swiper(".clients-carousel", {
    slidesPerView: "auto",
    spaceBetween: 64,
    loop: true,
    allowTouchMove: false,
    speed: 2500,
    autoplay: {
        delay: 0,
        disableOnInteraction: false,
    },
});

// Optional pause on hover
const el = document.querySelector(".clients-carousel");
el.addEventListener("mouseenter", () => clientsCarousel.autoplay.stop());
el.addEventListener("mouseleave", () => clientsCarousel.autoplay.start());