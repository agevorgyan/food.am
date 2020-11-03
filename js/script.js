'use strict';

window.addEventListener('DOMContentLoaded', () => {

    //start Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');

    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // end Tabs

    // start Timer

    const deadline = '2021-10-1';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            if (t.total <= 0) {
                clearInterval(timeInterval);
                t.days = 0;
                t.hours = 0;
                t.minutes = 0;
                t.seconds = 0;
            }
            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);

        }

    }
    setClock('.timer', deadline);

    // Timer end

    // start Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach((item) => {
        item.addEventListener('click', openModal);
    });

    // function toggleModal() {
    //     modal.classList.toggle('show');
    //     document.body.style.overflow = 'hidden';
    // }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        window.removeEventListener('scroll', showModalByScroll);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Classes


    class MenuCard {
        constructor(src, alt, title, desc, price, parentElement, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.desc = desc;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentElement);
            this.transfer = 27;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            if (this.classes.length == 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.desc}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fitch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data =>{
    //         data.forEach(({img, altimg, title, descr, price}) =>{
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thank you',
        fail: 'Failure'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');

            // request.setRequestHeader('Content-type', 'multipart/form-data');
            // request.setRequestHeader('Content-type', 'applicaton/json');



            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // request.send(json);

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showTanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showTanksModal(message.fail);
            //     }
            // });

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showTanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showTanksModal(message.fail);
                }).finally(() => {
                    form.reset();
                });

        });
    }

    function showTanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');

        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);

    } // end forms

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));


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
    
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }
    
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s All";

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    next.addEventListener('click',() =>{
        if(offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length){
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
        
    });
    
    prev.addEventListener('click',() =>{
        if(offset == 0){
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
        
        if(slideIndex == 1){
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });


}); //DOMContentLoaded