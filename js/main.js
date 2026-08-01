/**
 * KATLAVAN.UZ — Corporate Multi-Page Logic & Interactivity
 * Active Page Highlight, Animated Counters, Modals (with Local MP4 Video Player support), Filters, Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initBackToTop();
  highlightActiveNav();
  initCounters();
  initMachineryFilter();
  initGalleryFilter();
  initModals();
  initContactForm();
  initMobileMenu();
  initScrollReveal();
  initRipples();
  init3DTilt();
  initNavbarScroll();
  initVideoHoverPreviews();
  initHeroVideoBackground();
  initGalleryVideoClick();
  initContactWidget();
});

/* Video Scroll Auto-Play & Hover Preview Engine */
function initVideoHoverPreviews() {
  const videoObserverOptions = {
    root: null,
    rootMargin: '120px 0px 120px 0px', // start auto-playing slightly before scrolling into view
    threshold: 0.05
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      // Skip hero background video or video inside modal
      if (video.id === 'heroBgVideo' || video.id === 'aboutBgVideo' || video.closest('#videoModal')) return;

      if (entry.isIntersecting) {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.classList.add('is-playing');
            const parent = video.closest('.gallery-item, .project-card, .custom-card, .featured-project-card, .featured-project-img-box, .card-img-wrap');
            if (parent) parent.classList.add('video-active');
          }).catch(() => {
            // Autoplay prevented by browser, graceful fallback
          });
        }
      } else {
        video.pause();
        video.classList.remove('is-playing');
        const parent = video.closest('.gallery-item, .project-card, .custom-card, .featured-project-card, .featured-project-img-box, .card-img-wrap');
        if (parent) parent.classList.remove('video-active');
      }
    });
  }, videoObserverOptions);

  document.querySelectorAll('video').forEach(video => {
    if (video.id !== 'heroBgVideo' && video.id !== 'aboutBgVideo' && !video.closest('#videoModal')) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      video.preload = 'auto';

      videoObserver.observe(video);
    }

    // Mouse hover boost handler
    const parent = video.closest('.gallery-item, .project-card, .custom-card, .featured-project-card, .featured-project-img-box, .card-img-wrap');
    if (parent) {
      parent.addEventListener('mouseenter', () => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  });
}

/* Page Preloader */
function initPreloader() {
  if (!document.getElementById('page-preloader')) {
    const preloader = document.createElement('div');
    preloader.id = 'page-preloader';
    preloader.innerHTML = `
      <div class="preloader-spinner-wrap">
        <div class="preloader-ring"></div>
        <i class="fa-solid fa-truck-monster preloader-icon"></i>
      </div>
      <div class="preloader-title">KATLAVAN.UZ</div>
      <div class="preloader-bar-bg">
        <div class="preloader-bar-fill"></div>
      </div>
    `;
    document.body.prepend(preloader);
  }

  const hidePreloader = () => {
    const loader = document.getElementById('page-preloader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 600));
    // Fallback safety
    setTimeout(hidePreloader, 2000);
  }
}

/* Top Scroll Progress Indicator */
function initScrollProgress() {
  if (!document.getElementById('scroll-progress')) {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  const progressEl = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? winScroll / height : 0;
    if (progressEl) {
      progressEl.style.transform = `scaleX(${scrolled})`;
    }
  }, { passive: true });
}

/* Back To Top Button */
function initBackToTop() {
  if (!document.getElementById('backToTop')) {
    const btt = document.createElement('button');
    btt.id = 'backToTop';
    btt.setAttribute('title', 'Yuqoriga qaytish');
    btt.setAttribute('aria-label', 'Yuqoriga qaytish');
    btt.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
    document.body.appendChild(btt);
  }

  const bttBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      bttBtn.classList.add('show');
    } else {
      bttBtn.classList.remove('show');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Navbar Scroll Effect */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* Scroll Reveal Observer (AOS style) */
function initScrollReveal() {
  const selectors = [
    '.hero-content',
    '.hero-media',
    '.section-header',
    '.custom-card',
    '.machine-card-item',
    '.gallery-item-wrap',
    '.team-card',
    '.project-card-item',
    '.contact-card',
    '.stat-card',
    '.about-text-box',
    '.about-feature-item',
    '.faq-item',
    '.testimonial-card',
    '.machinery-filter',
    '.gallery-filter'
  ];

  const elementsToAnimate = [];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.hasAttribute('data-animate')) {
        // Apply staggered logic or default animation type
        if (selector.includes('card') || selector.includes('item')) {
          el.setAttribute('data-animate', 'fade-up');
        } else if (selector.includes('media')) {
          el.setAttribute('data-animate', 'fade-left');
        } else if (selector.includes('content') || selector.includes('text')) {
          el.setAttribute('data-animate', 'fade-right');
        } else {
          el.setAttribute('data-animate', 'fade-up');
        }
      }
      elementsToAnimate.push(el);
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Calculate index among siblings for staggered delay
        const parent = target.parentElement;
        let delay = 0;
        if (parent) {
          const siblings = Array.from(parent.children).filter(child => child.hasAttribute('data-animate'));
          const idx = siblings.indexOf(target);
          if (idx > 0) delay = idx * 100;
        }

        setTimeout(() => {
          target.classList.add('is-revealed');
        }, delay);

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => revealObserver.observe(el));
}

/* Button Ripple Effect */
function initRipples() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* 3D Tilt Card Hover Effect */
function init3DTilt() {
  const cards = document.querySelectorAll('.custom-card, .machine-card-item, .project-card-item, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });
  });
}

/* Highlight Active Link based on Page Filename */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* Animated Statistics Counters */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const target = parseInt(stat.getAttribute('data-target'), 10);
        if (!target || stat.getAttribute('data-animated') === 'true') return;

        stat.setAttribute('data-animated', 'true');
        let count = 0;
        const duration = 2000;
        const step = Math.ceil(target / (duration / 30));

        const counter = setInterval(() => {
          count += step;
          if (count >= target) {
            stat.innerText = target + '+';
            clearInterval(counter);
          } else {
            stat.innerText = count + '+';
          }
        }, 30);
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* Machinery Filtering */
function initMachineryFilter() {
  const filterBtns = document.querySelectorAll('.machinery-filter-btn');
  const machineItems = document.querySelectorAll('.machine-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      machineItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-brand') === filter) {
          item.style.display = 'flex';
          item.style.animation = 'fadeUpIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Gallery Filtering */
function initGalleryFilter() {
  const galleryBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-wrap');

  galleryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      galleryItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-type') === category) {
          item.style.display = 'block';
          item.style.animation = 'fadeUpIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Modals (Order, Specs, Video Player for MP4 & YouTube, Lightbox) */
function initModals() {
  document.addEventListener('click', (e) => {
    const orderBtn = e.target.closest('.open-order-modal');
    if (orderBtn) {
      e.preventDefault();
      const itemTitle = orderBtn.getAttribute('data-item') || 'Yer qazish xizmati';
      openOrderModal(itemTitle);
    }

    const videoBtn = e.target.closest('.open-video-modal');
    if (videoBtn) {
      e.preventDefault();
      const videoTitle = videoBtn.getAttribute('data-title') || 'Obyekt jarayoni';
      const videoSrc = videoBtn.getAttribute('data-video') || 'videos/bratske-abeykt1.mp4';
      openVideoModal(videoTitle, videoSrc);
    }

    const lightboxBtn = e.target.closest('.open-lightbox');
    if (lightboxBtn) {
      e.preventDefault();
      const imgSrc = lightboxBtn.getAttribute('data-src');
      openLightboxModal(imgSrc);
    }
  });

  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(element => {
    element.addEventListener('click', (e) => {
      if (e.target === element || e.target.classList.contains('modal-close')) {
        closeAllModals();
      }
    });
  });
}

function openOrderModal(itemName) {
  const modal = document.getElementById('orderModal');
  const modalItemText = document.getElementById('orderModalItemName');
  window.currentOrderItem = itemName;
  if (modalItemText) modalItemText.innerText = itemName;
  if (modal) modal.classList.add('active');
}

function openVideoModal(videoTitle, videoSrc) {
  const modal = document.getElementById('videoModal');
  const titleEl = document.getElementById('videoModalTitle');
  const containerEl = document.getElementById('videoModalContainer');

  if (titleEl) titleEl.innerText = videoTitle;

  if (containerEl) {
    if (videoSrc && (videoSrc.endsWith('.mp4') || videoSrc.includes('.mp4'))) {
      containerEl.style.paddingBottom = '0';
      containerEl.style.height = 'auto';
      containerEl.innerHTML = `
        <div style="background: #0f172a; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; border-radius: 16px 16px 0 0;">
          <h3 style="color: #FFF; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-film" style="color: var(--primary);"></i> ${videoTitle}
          </h3>
        </div>
        <video src="${videoSrc}" controls autoplay playsinline style="width:100%; max-height:75vh; border-radius: 0 0 16px 16px; display:block; margin:0 auto; background:#000;"></video>
      `;
    } else {
      containerEl.style.paddingBottom = '56.25%';
      containerEl.style.height = '0';
      containerEl.innerHTML = `<iframe src="${videoSrc}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>`;
    }
  }
  if (modal) modal.classList.add('active');
}

function openLightboxModal(imgSrc) {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  if (imgEl && imgSrc) imgEl.src = imgSrc;
  if (modal) modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('active');
  });

  // Stop video playback when closing
  const containerEl = document.getElementById('videoModalContainer');
  if (containerEl) {
    containerEl.innerHTML = '';
  }
}

/* Telegram Lead Bot Integration */
const TELEGRAM_BOT_TOKEN = '8863675989:AAGQCc8Z03bZIN_xX42cefyT3gN2KcyF8ls';
const TELEGRAM_CHAT_IDS = ['-1004451617065', '8202423244'];

async function sendTelegramLead(leadData) {
  let mapLocation = leadData.googleMapsUrl || window.userSelectedGeoUrl || '';

  // If user didn't click GPS button, try IP-based location automatically
  if (!mapLocation) {
    try {
      const locRes = await fetch('https://ipapi.co/json/');
      if (locRes.ok) {
        const loc = await locRes.json();
        if (loc.latitude && loc.longitude) {
          mapLocation = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude} (${loc.city || 'Toshkent'})`;
        }
      }
    } catch (e) {
      mapLocation = 'O\'zbekiston (GPS ulanmagan)';
    }
  }

  const text = `
🚜 *YANGI BUYURTMA | KATLAVAN.UZ* 🚜

👤 *Mijoz Ismi:* ${leadData.name || 'Ko\'rsatilmadi'}
📞 *Telefon raqami:* ${leadData.phone || 'Ko\'rsatilmadi'}
🛠 *Tanlangan Xizmat / Buyurtma:* ${leadData.service || 'Umumiy buyurtma'}
📍 *Google Maps Lokatsiyasi:* ${mapLocation || 'Biriktirilmagan'}
⏰ *Buyurtma berilgan aniq vaqt:* ${new Date().toLocaleString('uz-UZ')}
  `.trim();

  TELEGRAM_CHAT_IDS.forEach(chatId => {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    }).catch(err => console.error('Telegram API Error:', err));
  });
}

/* Google Maps GPS Location Handler */
function initGeoLocation() {
  document.addEventListener('click', (e) => {
    const geoBtn = e.target.closest('#getGeoBtn, .btn-get-geo');
    if (geoBtn) {
      e.preventDefault();
      const btnText = geoBtn.querySelector('span') || geoBtn;
      const hiddenInput = document.getElementById('geoMapUrl');

      if (!navigator.geolocation) {
        alert('Brauzeringiz lokatsiyani qo\'llab-quvvatlamaydi.');
        return;
      }

      btnText.innerText = '⌛ Lokatsiya olinmoqda...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
          if (hiddenInput) hiddenInput.value = mapUrl;
          window.userSelectedGeoUrl = mapUrl;

          geoBtn.style.background = '#10B981';
          geoBtn.style.color = '#FFFFFF';
          geoBtn.style.borderColor = '#10B981';
          btnText.innerHTML = '<i class="fa-solid fa-circle-check"></i> Lokatsiya biriktirildi (Google Maps)';
        },
        (error) => {
          btnText.innerText = '❌ Lokatsiya olish rad etildi';
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  });
}

/* Forms Submissions */
function initContactForm() {
  initGeoLocation();

  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('.form-control');
      const name = inputs[0] ? inputs[0].value : '';
      const phone = inputs[1] ? inputs[1].value : '';
      const service = inputs[2] ? inputs[2].value : 'Bog\'lanish sahifasi';

      sendTelegramLead({
        name,
        phone,
        service,
        googleMapsUrl: window.userSelectedGeoUrl || ''
      });

      showToast('Rahmat! Buyurtmangiz Telegram botimizga muvaffaqiyatli yuborildi!');
      contactForm.reset();
      window.userSelectedGeoUrl = '';
    });
  }

  const modalOrderForm = document.getElementById('modalOrderForm');
  if (modalOrderForm) {
    modalOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = modalOrderForm.querySelectorAll('.form-control');
      const name = inputs[0] ? inputs[0].value : '';
      const phone = inputs[1] ? inputs[1].value : '';
      const service = window.currentOrderItem || 'Tezkor Buyurtma Modal';

      sendTelegramLead({
        name,
        phone,
        service,
        googleMapsUrl: window.userSelectedGeoUrl || ''
      });

      closeAllModals();
      showToast('Buyurtmangiz Telegram botimizga yuborildi!');
      modalOrderForm.reset();
      window.userSelectedGeoUrl = '';
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* Mobile Left Off-Canvas Drawer Menu */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;

  // 1. Create backdrop overlay if missing
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  // 2. Inject Mobile Drawer Header if missing
  if (!navMenu.querySelector('.mobile-menu-header')) {
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'mobile-menu-header';
    drawerHeader.innerHTML = `
      <img src="images/logo.svg" alt="KATLAVAN.UZ" class="mobile-menu-brand-img">
      <div class="mobile-menu-close" title="Yopish"><i class="fa-solid fa-xmark"></i></div>
    `;
    navMenu.prepend(drawerHeader);
  }

  // 3. Inject Mobile Drawer Footer CTA if missing
  if (!navMenu.querySelector('.mobile-drawer-footer')) {
    const drawerFooter = document.createElement('div');
    drawerFooter.className = 'mobile-drawer-footer';
    drawerFooter.innerHTML = `
      <a href="contact.html" class="btn btn-primary" style="width: 100%; justify-content: center;">
        <i class="fa-solid fa-phone"></i> Bog'lanish
      </a>
      <a href="tel:+998977529999" class="btn btn-outline" style="width: 100%; justify-content: center; color: var(--secondary); border-color: var(--border-light);">
        <i class="fa-solid fa-phone-volume"></i> +998 97 752 99 99
      </a>
      <div style="font-size: 0.78rem; color: var(--secondary-muted); text-align: center; margin-top: 4px;">
        KATLAVAN.UZ — 24/7 Maxsus Texnika
      </div>
    `;
    navMenu.appendChild(drawerFooter);
  }

  const closeBtn = navMenu.querySelector('.mobile-menu-close');

  const openMenu = () => {
    navMenu.classList.add('active');
    backdrop.classList.add('active');
    if (toggle) toggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  backdrop.addEventListener('click', closeMenu);

  // Close menu when clicking any nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on ESC key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* Background Video Parallax Scroll & Auto-switching Video Playlist Carousel */
function initHeroVideoBackground() {
  const bgVideo = document.getElementById('heroBgVideo') || document.getElementById('aboutBgVideo') || document.getElementById('servicesBgVideo');
  const miniPreview = document.getElementById('heroMiniPreview') || document.getElementById('aboutVideoPreview') || document.getElementById('servicesVideoPreview');
  const toggleAudioBtn = document.getElementById('toggleHeroAudio');
  const audioIcon = document.getElementById('heroAudioIcon');
  const switchBtns = document.querySelectorAll('.hero-video-switcher');

  if (!bgVideo) return;

  // Video Playlist Array
  const playlist = [
    { src: 'obektlar/kumishkon.mp4', title: 'Kumushkon 1 Obyekti' },
    { src: 'obektlar/bektemir.mp4', title: 'Bektemir Obyekti' },
    { src: 'obektlar/kokcha.mp4', title: 'Ko\'kcha 1 Obyekti' },
    { src: 'obektlar/oq tepa.mp4', title: 'Ko\'kcha Oq-Tepa Obyekti' },
    { src: 'obektlar/ozbefilim.mp4', title: 'O\'zbekfilm 1 Obyekti' },
    { src: 'obektlar/sergili.mp4', title: 'Sergeli 1 Obyekti' },
    { src: 'videos/kirish.mp4', title: 'Bosh Katlavan Jarayoni' }
  ];

  let currentIndex = 0;
  let autoCycleTimer = null;

  // 1. Scroll Parallax Effect
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < 900) {
      bgVideo.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
    }
  }, { passive: true });

  // 2. Video Audio Toggle
  if (toggleAudioBtn && audioIcon) {
    toggleAudioBtn.addEventListener('click', () => {
      bgVideo.muted = !bgVideo.muted;
      if (bgVideo.muted) {
        audioIcon.className = 'fa-solid fa-volume-xmark';
        toggleAudioBtn.style.background = 'rgba(255, 255, 255, 0.12)';
      } else {
        audioIcon.className = 'fa-solid fa-volume-high';
        toggleAudioBtn.style.background = 'var(--primary)';
      }
    });
  }

  // 3. Switch Video Function
  function switchVideo(index) {
    currentIndex = index;
    const item = playlist[currentIndex];
    if (!item) return;

    // Smooth Crossfade transition
    bgVideo.style.opacity = '0.3';
    setTimeout(() => {
      bgVideo.src = item.src;
      if (miniPreview) miniPreview.src = item.src;
      bgVideo.play().catch(() => {});
      if (miniPreview) miniPreview.play().catch(() => {});
      bgVideo.style.opacity = '1';
    }, 250);

    // Update active button state
    switchBtns.forEach(btn => {
      const videoSrc = btn.getAttribute('data-video');
      if (videoSrc === item.src) {
        btn.classList.add('active');
        btn.style.background = 'var(--primary)';
        btn.style.borderColor = 'var(--primary)';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255,255,255,0.12)';
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    });

    // Update mini preview modal trigger
    const modalTrigger = document.querySelector('.hero-media .open-video-modal');
    if (modalTrigger) {
      modalTrigger.setAttribute('data-video', item.src);
      modalTrigger.setAttribute('data-title', item.title);
    }
  }

  // 4. Auto Cycle Loop (Switches every 6 seconds)
  function startAutoCycle() {
    stopAutoCycle();
    autoCycleTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % playlist.length;
      switchVideo(currentIndex);
    }, 6000);
  }

  function stopAutoCycle() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
  }

  // Initialize Auto Cycle
  startAutoCycle();

  // 5. Manual Switch Button Click
  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const videoSrc = btn.getAttribute('data-video');
      const foundIdx = playlist.findIndex(p => p.src === videoSrc);
      if (foundIdx !== -1) {
        switchVideo(foundIdx);
        startAutoCycle(); // Restart timer from clicked video
      }
    });
  });
}

/* Gallery Video Direct Click Handler */
function initGalleryVideoClick() {
  document.querySelectorAll('.gallery-item.open-video-modal, .gallery-item-wrap.open-video-modal').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const videoTitle = card.getAttribute('data-title') || 'Obyekt Videosi';
      const videoSrc = card.getAttribute('data-video') || '';
      if (videoSrc) {
        openVideoModal(videoTitle, videoSrc);
      }
    });
  });
}

/* Floating Live Contact Widget (Telegram & Phone Popup Menu) */
function initContactWidget() {
  const widget = document.getElementById('floatingContactWidget');
  const btn = document.getElementById('toggleContactWidget');
  const icon = document.getElementById('contactWidgetIcon');

  if (btn && widget) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      widget.classList.toggle('active');
      if (icon) {
        if (widget.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-comment-dots';
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        widget.classList.remove('active');
        if (icon) icon.className = 'fa-solid fa-comment-dots';
      }
    });
  }
}

