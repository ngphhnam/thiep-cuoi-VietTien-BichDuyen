/**
 * Wedding Invitation - Main Application Coordinator
 * Khởi tạo toàn bộ các module và xử lý sự kiện giao diện người dùng
 */

const App = (() => {
  // Hiển thị Toast thông báo ngắn
  const showToast = (message, duration = 3000) => {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification toast-slide-up';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  };

  // Sao chép văn bản vào bộ nhớ tạm (Clipboard)
  const copyToClipboard = (text, successMsg = 'Đã sao chép vào bộ nhớ tạm!') => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  };

  const fallbackCopy = (text, successMsg) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      alert('Không thể sao chép tự động: ' + text);
    }
    document.body.removeChild(tempInput);
  };

  // Tạo liên kết thêm vào Google Calendar
  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent("Đám Cưới Bích Duyên & Việt Tiến");
    const details = encodeURIComponent("Trân trọng kính mời bạn đến tham dự lễ thành hôn của Bích Duyên & Việt Tiến tại Phước Long, Đồng Nai.");
    const location = encodeURIComponent("Phước Long, Đồng Nai");
    // Format YYYYMMDDTHHmmssZ (18/12/2026 09:00:00 UTC+7 -> 02:00:00Z)
    const dates = "20261218T020000Z/20261218T070000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Khởi tạo Scroll Reveal Animation
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-item');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback nếu trình duyệt cũ
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  };

  // Xử lý Hộp Mừng Cưới & Tab Tài khoản Ngân Hàng
  const initGiftBox = () => {
    const toggleBtn = document.getElementById('gift-toggle-btn');
    const giftContainer = document.getElementById('gift-container');
    const tabBtns = document.querySelectorAll('.gift-tab-btn');
    const bankCards = document.querySelectorAll('.bank-card');

    if (toggleBtn && giftContainer) {
      toggleBtn.addEventListener('click', () => {
        giftContainer.classList.toggle('active');
        if (giftContainer.classList.contains('active')) {
          giftContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSide = btn.dataset.side;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        bankCards.forEach(card => {
          if (card.dataset.side === targetSide) {
            card.style.display = 'grid';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Nút sao chép STK
    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const accountNumber = btn.dataset.account;
        copyToClipboard(accountNumber, `Đã sao chép số tài khoản: ${accountNumber}`);
      });
    });
  };

  // Xử lý Header và Nút Back to Top
  const initHeaderAndScroll = () => {
    const header = document.getElementById('site-header');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > 60) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add('active');
        } else {
          backToTopBtn.classList.remove('active');
        }
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Nút thêm vào Google Calendar
    const calendarBtn = document.getElementById('btn-add-calendar');
    if (calendarBtn) {
      calendarBtn.addEventListener('click', () => {
        window.open(createGoogleCalendarLink(), '_blank');
      });
    }

    // Đóng mở Mobile Menu Drawer (3 gạch ngang)
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu-nav a');

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMobileMenu();
      });
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        closeMobileMenu();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }
      });
    });
  };

  const openMobileMenu = () => {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileMenu = () => {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Khởi động toàn bộ trang
  const init = () => {
    if (window.EnvelopeController) window.EnvelopeController.init();
    if (window.MusicPlayer) window.MusicPlayer.init();
    if (window.PetalsEffect) window.PetalsEffect.init();
    if (window.GalleryController) window.GalleryController.init();
    if (window.CountdownTimer) window.CountdownTimer.init();
    if (window.WishesController) window.WishesController.init();
    if (window.RSVPController) window.RSVPController.init();

    initScrollReveal();
    initGiftBox();
    initHeaderAndScroll();
  };

  return {
    init,
    showToast,
    copyToClipboard,
    openMobileMenu,
    closeMobileMenu
  };
})();

window.App = App;

// Khởi chạy an toàn trong mọi trạng thái DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

