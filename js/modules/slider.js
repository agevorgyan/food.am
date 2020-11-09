'use strict';
function slider() {
    //Slider
    /*
    const sliders = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        counter = document.querySelector('.offer__slider-counter');
    let indexSlide = 1,
        total = document.querySelector('#total'),
        current = document.querySelector('#current');

    if (sliders.length < 10) {
        total.textContent = `0${sliders.length}`;
    } else {
        total.textContent = sliders.length;
    }

    function showSlide(i) {
        if (i > sliders.length) {
            indexSlide = 1;
        }
        if (i < 1) {
            indexSlide = sliders.length;
        }
        sliders.forEach(item => item.classList.add('hide'));
        sliders[indexSlide - 1].classList.remove('hide');

        if (indexSlide < 10) {
            current.textContent = `0${indexSlide}`;
        } else {
            current.textContent = indexSlide;
        }
    }

    function plusIndex(i) {
        showSlide(indexSlide += i);
    }

    next.addEventListener('click', (e) => {
        e.preventDefault();
        plusIndex(1);
    });

    prev.addEventListener('click', (e) => {
        e.preventDefault();
        plusIndex(-1);
    });

    counter.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            plusIndex(1);
        } else {
            plusIndex(-1);
        }

    });

    showSlide(indexSlide);
*/
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        counter = document.querySelector('.offer__slider-counter'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0,
        total = document.querySelector('#total'),
        current = document.querySelector('#current');

    total.textContent = addZero(slides.length);
    current.textContent = addZero(slideIndex);

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s All";

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function toDigi(string) {
        return +string.replace(/\D/g, '');
    }

    function dotOpacity() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    next.addEventListener('click', () => {
        if (offset == toDigi(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += toDigi(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        current.textContent = addZero(slideIndex);

        dotOpacity();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = toDigi(width) * (slides.length - 1);
        } else {
            offset -= toDigi(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        current.textContent = addZero(slideIndex);

        dotOpacity();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = toDigi(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            current.textContent = addZero(slideIndex);

            dotOpacity();
        });
    });
}
module.exports = slider;