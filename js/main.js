const body = document.querySelector('body'),
      menu = document.querySelector('.nav-menu'),
      menuOpen = document.querySelector('.nav-burger'),
      menuClose = document.querySelector('.nav-menu-close');

menuOpen.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.add('_show');
  body.classList.add('_lock');
});

menuClose.addEventListener('click', () => {
  menu.classList.remove('_show');
  body.classList.remove('_lock');
});


// Закрытие меню при клике по заднему фону
const menuBody = document.querySelector('.nav-menu__body');

document.addEventListener('click', (e) => {
  if (menu.classList.contains('_show')) {
    const target = e.target,
          itsMenu = target == menuBody || menuBody.contains(target),
          itsBurger = target == menuOpen,
          itsBtnCallback = target == document.querySelector('.nav-menu-callback'),
          menuIsOpen = menu.classList.contains('_show');
  
    if (!itsMenu && !itsBurger && menuIsOpen || itsBtnCallback) {
      menu.classList.remove('_show');
      body.classList.remove('_lock');
    }
  }
});

// Открытие модальных окон
const btnsOpenModal = document.querySelectorAll('.modal-open');

for (let i = 0; i < btnsOpenModal.length; i++) {
  const btnOpenModal = btnsOpenModal[i];
  
  btnOpenModal.addEventListener('click', (e) => {
    const dataBtn = btnOpenModal.dataset.modalOpen;
    const modalThatOpens = document.querySelector(`.modal[data-modal=${dataBtn}]`)
    
    btnOpenModal.classList.add('modal-show');
    modalThatOpens.classList.add('_show');
    body.classList.add('_lock');

    // Закрытие модального окна с помощью клика по крестику
    if (btnOpenModal.classList.contains('modal-show')) {
      const modalIsOpen = document.querySelector('.modal._show'), // находим модальное окно, которое сейчас открыто
            closeThisModal = document.querySelector('.modal._show .modal-close'); // находим крестик этого модального окна
  
      closeThisModal.addEventListener('click', () => {
        btnOpenModal.classList.remove('modal-show');
        modalIsOpen.classList.remove('_show');
        body.classList.remove('_lock');
      });

      // закрытие модальных окон при клике по заднему фону
      // document.addEventListener('click', (e) => {
      //   if (btnOpenModal.classList.contains('modal-show')) {
      //     const modalContent = document.querySelector('.modal._show .modal__content');

      //     const target = e.target,
      //           itsModal = target == modalContent || modalContent.contains(target),
      //           itsBtnOpenModal = target == btnOpenModal;

      //     if (!itsModal && !itsBtnOpenModal && modalIsOpen.classList.contains('_show')) {
      //       console.log(btnOpenModal);
      //       btnOpenModal.classList.remove('modal-show');
      //       modalIsOpen.classList.remove('_show');
      //       body.classList.remove('_lock'); 
      //     }
      //   }
      // });
    }
  });

}

// Скрипт для элементов "select"

const selectHeader = document.querySelectorAll('.select__header'),
      selectItem = document.querySelectorAll('.select-item');

selectHeader.forEach(item => {
  item.addEventListener('click', selectToggle);
});

selectItem.forEach(item => {
  item.addEventListener('click', selectChoose);
});

function selectToggle() {
  // if (!this) {
  //   const everySelect = document.querySelectorAll('.select');

  //   for (let i = 0; i < everySelect.length; i++) {
  //     everySelect[i].classList.remove('_active');
  //   };
  // };

  this.parentNode.classList.toggle('_active');
};

function selectChoose() {
  const text = this.innerText,
        parent = this.closest('.select'),
        currentSelect = parent.querySelector('.select-current');
  
  currentSelect.innerText = text;
  parent.classList.remove('_active');
};


// reviews Swiper

if (document.querySelector('.reviews__slider-content')) {
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 32,
  
    pagination: {
      el: '.reviews__pagination',
      clickable: true,
    },
  
    navigation: {
      nextEl: '.reviews__arrows-right',
      prevEl: '.reviews__arrows-left',
    },
  });
}



// Подставление нужной информации в карточки в разделе "rental"

const rentalCard = document.querySelectorAll('.rental__service');

rentalCard.forEach(item => {
  item.addEventListener('click', () => {
    rentalCardInfo(item).then(e => {
      rentalSetInfo(e[0],e[1],e[2]);
    });
  });
});

async function rentalCardInfo(item) {
    const rentalCardData = item.dataset.rentalInfo;

    const  rentalRequest = await fetch('js/rental-info.json'),
           rentalResponse = await rentalRequest.json();

    const rentalIcon = rentalResponse[rentalCardData][0],
          rentalTitle = rentalResponse[rentalCardData][1],
          rentalText = rentalResponse[rentalCardData][2];

    return [rentalIcon,rentalTitle,rentalText];
}

function rentalSetInfo(icon,title,text) {
  const rentalIcon = document.querySelector('.modal-condition-icon img'),
        rentalTitle = document.querySelector('.modal-condition-title'),
        rentalText = document.querySelector('.modal-condition-text');

  rentalIcon.setAttribute('src', `img/${icon}`);
  rentalTitle.innerText = title;
  rentalText.innerText = text;
}

// Закрытие модального окна в разделе "rental"

if (document.querySelector('.modal-condition')) {
  const rentalModalClose = document.querySelector('.modal-condition-btn');
  
  rentalModalClose.addEventListener('click', (e) => {
    rentalModalClose.closest('.modal-condition').classList.remove('_show');
    body.classList.remove('_lock');
  });
}

// Фильтр для парка авто на главной

const parkClass = document.querySelectorAll('.park__class__item');

parkClass.forEach(item => {
  item.addEventListener('click', () => {
    parkClass.forEach(e => {
      e.classList.remove('_active');
    });
    item.classList.add('_active');

    parkFilter(item);
  })
});

function parkFilter(parkClass) {
  const parkClassData = parkClass.dataset.parkClass,
        parkCarAll = document.querySelectorAll('.park__car-item'),
        parkCarData = document.querySelectorAll(`.park__car-item[data-park-car=${parkClassData}]`);

  // Убираем ненужные карточки
  parkCarAll.forEach(item => {
    item.style.display = 'none';
    item.classList.remove('_show');
  });

  // Показываем нужные карточки
  parkCarData.forEach(item => { 
    item.style.display = 'flex';
    // let i = 0;

    // const parkCarInterval = setInterval(() => {
    //   item.style.transitionDelay = i + 's';
    //   // i = i + 0.1;

    //   if (i >= parkCarData.length) {
    //     clearInterval(parkCarInterval);
    //   }
    // });

    setTimeout(() => {
      item.classList.add('_show');
    }, 1);
  });
}

// Перенос данных в модальное окно на главном экране

if (document.querySelector('.main')) {
  const mainBtn = document.querySelector('.main-btn'),
        mainCarTitleElem = document.querySelector('.main__select-car .select-current'),
        mainCarDayElem = document.querySelector('.main__select-day .select-current'),
        mainCarPriceElem = document.querySelector('.main__price-all span'),
        mainCarPriceDayElem = document.querySelector('.main__price-day span'),
        mainCarDepositElem = document.querySelector('.main__price-deposit span');
  
  mainBtn.addEventListener('click', () => {
    mainMoveModule(); // Переносит данные с главного экрана в модальное окно
  });
  
  function mainMoveModule() {
    const carTitle = mainCarTitleElem.innerHTML,
          carDay = mainCarDayElem.innerHTML,
          carPrice = mainCarPriceElem.innerHTML,
          carPriceDay = mainCarPriceDayElem.innerHTML,
          carDeposit = mainCarDepositElem.innerHTML;
  
    document.querySelector('.modal-rent-info-title').innerText = carTitle;
    document.querySelector('.modal-rent-info-day span').innerText = carDay;
    document.querySelector('.modal-rent-info-price-day span').innerText = carPriceDay;
    document.querySelector('.modal-rent-info-deposit span').innerText = carDeposit;
    document.querySelector('.modal-rent-info-price span').innerText = carPrice;
  };
}

// Звездный рейтинг в отзывах
const reviewStars = document.querySelectorAll('.modal-review-star');

reviewStars.forEach(star => {
  star.addEventListener('click', () => {
    
    star.classList.toggle('_fill');
  });
});


// Аккордеон на странице "Контакты"
if (document.querySelector('.accordion')) {
  const accHeaderElems = document.querySelectorAll('.price__faq__header');
  
  accHeaderElems.forEach(accHeader => {
    
    accHeader.addEventListener('click', () => {
      const accParent = accHeader.closest('.price__faq__item');
      const accBody = accHeader.nextElementSibling;

      accParent.classList.toggle('_show');
      
      if (accParent.classList.contains('_show')) {
        accBody.style.maxHeight = accBody.scrollHeight + 'px';
      }
      else {
        accBody.style.maxHeight = 0;
      }
    })
  });
}

// Слайдер на странице "Об автомобиле"

if (document.querySelector('.car__slider')) {
  const carSecondSlider = new Swiper('.car__slider__second', {
    slidesPerView: 8,
    slidesPerColumn: 2,
    spaceBetween: 8,
    watchOverflow: true,

    navigation: {
      nextEl: '.car__slider__main-next',
      prevEl: '.car__slider__main-prev',
    },
  });
  
  const carMainSlider = new Swiper('.car__slider__main', {
    effect: 'fade',
    watchOverflow: false,

    navigation: {
      nextEl: '.car__slider__main-next',
      prevEl: '.car__slider__main-prev',
    },
    pagination: {
      el: '.car__slider__main-pagination',
    },
    thumbs: {
      swiper: carSecondSlider,
    },
  });
}

// Таб на странице "Цены и условия"

if (document.querySelector('.tab-header') && document.querySelector('.tab-body')) {
  const tabHeaders = document.querySelectorAll('.tab-header');
  
  tabHeaders.forEach(tabHeader => {
    tabHeader.addEventListener('click', () => {
      const tabHeaderData = tabHeader.dataset.season;
      const tabBodyShow = document.querySelector('.tab-body._show')
      const tabBody = document.querySelector(`.tab-body[data-season-body="${tabHeaderData}"]`);
  
      tabBodyShow.style.display = 'none';
      tabBodyShow.classList.remove('_show');
  
      tabBody.style.display = 'block';
      setTimeout(() => {
        tabBody.classList.add('_show');
      }, 1);
  
      tabHeaders.forEach(item => {
        item.classList.remove('_active');
      });
      tabHeader.classList.add('_active');
    })
  });
}

// Модальное окно "Арендовать" на странице автомобиля

if (document.querySelector('.car-modal-rent')) {
  const btnIsOpenModal = document.querySelector('button[data-modal-open="rent"]');

  btnIsOpenModal.addEventListener('click', () => {
    setDataInModal();
  });

  function setDataInModal() {
    // Данные с главного экрана
    const priceDay = document.querySelector('.car-rent-info-price-day span').innerHTML,
          deposit = document.querySelector('.car-rent-info-deposit span').innerHTML,
          airFee = document.querySelector('.car-rent-info-airport-fee span').innerHTML,
          dateStart = document.querySelector('.car-rent-date-start').value,
          timeStart = document.querySelector('.car__rent-time-start').innerHTML,
          quantityDay = document.querySelector('.car__select-quantity-day').value,
          priceAll = document.querySelector('.car-rent-price-all span').innerHTML;

    // Элементы в модальном окне, в которые будут вставляться данные
    const priceDayModal = document.querySelector('.car-rent-modal-price-day span'),
          depositModal = document.querySelector('.car-rent-modal-deposit span'),
          airFeeModal = document.querySelector('.car-rent-modal-airport-fee span'),
          dateStartModal = document.querySelector('.modal-rent__info-date-start'),
          dateEndModal = document.querySelector('.modal-rent__info-date-end'),
          timeStartModal = document.querySelector('.modal-rent__info-time-start'),
          timeEndModal = document.querySelector('.modal-rent__info-time-end'),
          quantityDayModal = document.querySelector('.modal-rent__info-days'),
          priceAllModal = document.querySelector('.modal-rent-info-price span');

    priceDayModal.innerHTML = priceDay;
    depositModal.innerHTML = deposit;
    airFeeModal.innerHTML = airFee;
    timeStartModal.innerHTML = timeStart;
    timeEndModal.innerHTML = timeStart;
    quantityDayModal.innerHTML = quantityDay;
    priceAllModal.innerHTML = priceAll;

    // Вставляем дату старта
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timezone: 'UTC'
    };

    dateStartModal.innerHTML = new Date(dateStart).toLocaleString('ru', options);

    // Вставляем дату окончания
    const dayStart = new Date(dateStart),
          dateStartUTC = dayStart.getTime(),
          dayEndMillyseconds = parseInt(quantityDay) * 8.64e+7, // кол-во миллисекунд с даты начала по даты окончания
          dayEnd = new Date(dateStartUTC + dayEndMillyseconds).toLocaleString('ru', options);
    
    dateEndModal.innerHTML = dayEnd;
  }
}




// Указываем дату начала автоматически на сегодня

if (document.querySelector('input[type="date"]')) {
  Date.prototype.toDateInputValue = (function() {
    const local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
  });

  document.querySelector('input[type="date"]').value = new Date().toDateInputValue();
}
