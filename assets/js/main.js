
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Sticky Header on Scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop;
    let nextElement = selectHeader.nextElementSibling;

    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('sticked');
        if (nextElement) nextElement.classList.add('sticked-header-offset');
      } else {
        selectHeader.classList.remove('sticked');
        if (nextElement) nextElement.classList.remove('sticked-header-offset');
      }
    }
    window.addEventListener('load', headerFixed);
    document.addEventListener('scroll', headerFixed);
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar a');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Render shared content from assets/js/site-data.js
   */
  const siteData = window.cityOfIdeasData || {};

  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);

  document.querySelectorAll('[data-events-list]').forEach(container => {
    const listName = container.dataset.eventsList;
    const limit = Number(container.dataset.limit) || undefined;
    const events = (siteData[listName] || []).slice(0, limit);

    container.innerHTML = events.map(item => `
      <div class="col-xl-4 col-md-6 portfolio-item">
        <div class="portfolio-wrap">
          <a href="${escapeHtml(item.image)}" data-gallery="city-gallery" class="glightbox">
            <img src="${escapeHtml(item.image)}" class="img-fluid" alt="${escapeHtml(item.alt || item.title)}" />
          </a>
          <div class="portfolio-info">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </div>
      </div>
    `).join('');
  });

  document.querySelectorAll('[data-pricing-list]').forEach(container => {
    const packages = siteData.pricing || [];

    container.innerHTML = packages.map(item => `
      <div class="col-xl-3 col-md-6">
        <article class="pricing-card ${item.popular ? 'is-popular' : ''} h-100">
          <div class="pricing-topline">
            <span class="pricing-tier">${escapeHtml(item.tier)}</span>
            <span class="pricing-badge">${escapeHtml(item.badge)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="pricing-price">${escapeHtml(item.investment)}</p>
          <p class="pricing-audience">${escapeHtml(item.audience)}</p>
          <p><strong>Outcome:</strong> ${escapeHtml(item.outcome)}</p>
          <div class="pricing-includes">
            <strong>You get:</strong>
            <ul>
              ${(item.includes || []).map(point => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
          ${item.topics ? `<p><strong>Topics:</strong> ${escapeHtml(item.topics)}</p>` : ''}
          <a class="btn btn-contact" href="https://wa.me/2348083410417?text=${encodeURIComponent(item.message || item.cta)}" target="_blank" rel="noopener">${escapeHtml(item.cta)}</a>
        </article>
      </div>
    `).join('');
  });

  document.querySelectorAll('[data-trusted-by]').forEach(container => {
    const trustedBy = siteData.trustedBy || [];
    const logos = [...trustedBy, ...trustedBy];

    container.innerHTML = logos.map(item => `
      <div class="trusted-logo" aria-label="${escapeHtml(item.name)}">
        ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)} logo" />` : `<span class="trusted-wordmark">City <em>of</em> Ideas</span>`}
      </div>
    `).join('');
  });

  /**
   * Initiate glightbox
   */
  GLightbox({
    selector: '.glightbox'
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Send contact and booking forms to WhatsApp
   */
  document.querySelectorAll('.php-email-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const formData = new FormData(form);
      const title = form.dataset.whatsappTitle || document.title || 'City Of Ideas Enquiry';
      const lines = [`${title}`];

      formData.forEach((value, key) => {
        const cleanValue = String(value).trim();
        if (!cleanValue) return;
        const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        lines.push(`${cleanKey}: ${cleanValue}`);
      });

      const message = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/2348083410417?text=${message}`, '_blank', 'noopener');
    }, true);
  });

  /**
   * Show homepage WhatsApp pulse only after the hero section
   */
  const whatsappFloat = document.querySelector('.whatsapp-float[data-show-after-hero="true"]');
  const hero = document.querySelector('#hero');
  if (whatsappFloat && hero) {
    const toggleWhatsappFloat = () => {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      whatsappFloat.classList.toggle('is-visible', window.scrollY > heroBottom - 120);
    };
    window.addEventListener('load', toggleWhatsappFloat);
    document.addEventListener('scroll', toggleWhatsappFloat);
    toggleWhatsappFloat();
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      let portfolioIsotope = new Isotope(document.querySelector('.portfolio-container'), {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
          document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 700,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});
