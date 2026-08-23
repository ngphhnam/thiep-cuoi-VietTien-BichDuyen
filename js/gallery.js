/**
 * Wedding Invitation - Photo Gallery & Fullscreen Lightbox Controller
 * Bố cục Lookbook Tạp Chí Cưới Nghệ Thuật & Trình phóng to toàn màn hình
 */

const GalleryController = (() => {
  let allItems = [];
  let currentLightboxIndex = 0;
  let carouselIndex = 0;
  let carouselTimer = null;

  const getItems = () => {
    if (allItems && allItems.length > 0) return allItems;
    if (typeof WEDDING_DATA !== 'undefined' && WEDDING_DATA.gallery && Array.isArray(WEDDING_DATA.gallery.items) && WEDDING_DATA.gallery.items.length) {
      allItems = WEDDING_DATA.gallery.items;
      return allItems;
    }
    if (window.WEDDING_DATA && window.WEDDING_DATA.gallery && Array.isArray(window.WEDDING_DATA.gallery.items) && window.WEDDING_DATA.gallery.items.length) {
      allItems = window.WEDDING_DATA.gallery.items;
      return allItems;
    }
    // Fallback: Quét tất cả thẻ img trong khu vực Album cưới
    const imgs = document.querySelectorAll('#gallery img, .gallery-section img');
    if (imgs.length) {
      allItems = Array.from(imgs).map(img => ({ src: img.src, caption: img.alt || 'Ảnh cưới Bích Duyên & Việt Tiến' }));
    }
    return allItems;
  };

  const init = () => {
    getItems();
    initHeroCarousel();
    initClickableImages();
    renderAllModalGrid();
    initLightboxEvents();
  };

  // Khởi tạo Carousel ảnh ngang lớn ở đầu Album
  const initHeroCarousel = () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!slides.length) return;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.onclick = (e) => {
          e.stopPropagation();
          setCarouselSlide(idx);
        };
        dotsContainer.appendChild(dot);
      });
    }

    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      setCarouselSlide((carouselIndex + 1) % slides.length);
    }, 4000);
  };

  const setCarouselSlide = (index) => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides.length) return;

    carouselIndex = index;
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Lắng nghe sự kiện click trên tất cả ảnh cưới trong trang
  const initClickableImages = () => {
    const clickableSelectors = [
      '.gallery-hero-carousel',
      '.gallery-item',
      '.magazine-photo-tall',
      '.magazine-photo-stacked',
      '.magazine-hero-photo',
      '.poster-photo-item',
      '.carousel-slide'
    ];

    clickableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const img = el.querySelector('img');
          if (img && img.src) {
            openLightboxBySrc(img.src);
          }
        });
      });
    });
  };

  // Render lưới 18 ảnh cưới vào Modal Xem Tất Cả
  const renderAllModalGrid = () => {
    const grid = document.getElementById('gallery-all-grid');
    const items = getItems();
    if (!grid || !items.length) return;

    grid.innerHTML = '';
    items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-all-item';
      itemEl.title = item.caption || 'Xem phóng to';
      itemEl.innerHTML = `<img src="${item.src}" alt="${item.caption || 'Ảnh cưới'}" loading="lazy" />`;
      itemEl.onclick = (e) => {
        e.stopPropagation();
        openLightbox(index);
      };
      grid.appendChild(itemEl);
    });
  };

  // Mở Modal Xem Tất Cả
  const openViewAllModal = () => {
    renderAllModalGrid();
    const modal = document.getElementById('gallery-all-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // Đóng Modal Xem Tất Cả
  const closeViewAllModal = () => {
    const modal = document.getElementById('gallery-all-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Mở Lightbox xem ảnh toàn màn hình
  const openLightbox = (index) => {
    const items = getItems();
    if (!items.length) return;
    if (typeof index !== 'number' || index < 0 || index >= items.length) {
      index = 0;
    }

    currentLightboxIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    const caption = document.getElementById('lightbox-caption');

    if (!modal || !img) return;

    img.src = items[currentLightboxIndex].src;
    if (counter) {
      counter.textContent = `( ${currentLightboxIndex + 1} / ${items.length} )`;
    }
    if (caption) {
      caption.textContent = items[currentLightboxIndex].caption || '';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openLightboxBySrc = (src) => {
    const items = getItems();
    if (!items.length) {
      const modal = document.getElementById('lightbox-modal');
      const img = document.getElementById('lightbox-img');
      if (modal && img) {
        img.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    const cleanSrc = src.split('?')[0];
    const idx = items.findIndex(item => item.src.split('?')[0] === cleanSrc || src.includes(item.src) || item.src.includes(src));
    if (idx !== -1) {
      openLightbox(idx);
    } else {
      items.push({ src: src, caption: 'Ảnh cưới Bích Duyên & Việt Tiến' });
      openLightbox(items.length - 1);
    }
  };

  const closeLightbox = () => {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      const viewAllModal = document.getElementById('gallery-all-modal');
      if (!viewAllModal || !viewAllModal.classList.contains('active')) {
        document.body.style.overflow = '';
      }
    }
  };

  const nextImage = () => {
    const items = getItems();
    if (!items.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % items.length;
    updateLightboxUI();
  };

  const prevImage = () => {
    const items = getItems();
    if (!items.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + items.length) % items.length;
    updateLightboxUI();
  };

  const updateLightboxUI = () => {
    const items = getItems();
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    const caption = document.getElementById('lightbox-caption');

    if (img && items[currentLightboxIndex]) {
      img.src = items[currentLightboxIndex].src;
    }
    if (counter) {
      counter.textContent = `( ${currentLightboxIndex + 1} / ${items.length} )`;
    }
    if (caption) {
      caption.textContent = items[currentLightboxIndex].caption || '';
    }
  };

  const initLightboxEvents = () => {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    const nextBtn = document.getElementById('lightbox-next');
    const prevBtn = document.getElementById('lightbox-prev');

    if (closeBtn) closeBtn.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); nextImage(); };
    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); prevImage(); };

    // Đóng khi bấm nền ngoài ảnh
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-img-wrap')) {
          closeLightbox();
        }
      };
    }

    // Điều hướng bàn phím PC
    document.addEventListener('keydown', (e) => {
      const viewAllModal = document.getElementById('gallery-all-modal');
      if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      } else if (viewAllModal && viewAllModal.classList.contains('active')) {
        if (e.key === 'Escape') closeViewAllModal();
      }
    });

    // Vuốt cảm ứng điện thoại (Touch Swipe Gesture)
    let touchStartX = 0;
    let touchEndX = 0;

    if (modal) {
      modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
          if (swipeDistance < 0) {
            nextImage();
          } else {
            prevImage();
          }
        }
      }, { passive: true });
    }
  };

  return {
    init,
    getItems,
    openLightbox,
    openLightboxBySrc,
    closeLightbox,
    nextImage,
    prevImage,
    openViewAllModal,
    closeViewAllModal
  };
})();

window.GalleryController = GalleryController;

// Tự động khởi chạy an toàn
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GalleryController.init());
} else {
  GalleryController.init();
}
