/**
 * Wedding Invitation - Envelope Controller
 * Quản lý mở phong bì 3D và đọc thông tin khách mời từ URL
 */

const EnvelopeController = (() => {
  // Lấy tên khách mời từ URL param ?guest=...
  const getGuestName = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam = urlParams.get('guest');
      if (guestParam && guestParam.trim()) {
        return decodeURIComponent(guestParam.trim());
      }
    } catch (e) {
      console.warn('Error parsing guest name:', e);
    }
    return "Quý Khách";
  };

  const init = () => {
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const guestNameElement = document.getElementById('envelope-guest-name');
    const rsvpGuestInput = document.getElementById('rsvp-name');
    const wishNameInput = document.getElementById('wish-name');

    const guestName = getGuestName();

    // Điền tên khách mời vào màn hình bao thư
    if (guestNameElement) {
      guestNameElement.textContent = guestName;
    }

    // Điền trước tên khách mời vào Form xác nhận RSVP và Sổ lưu bút
    if (rsvpGuestInput && guestName !== "Quý Khách") {
      rsvpGuestInput.value = guestName;
    }
    if (wishNameInput && guestName !== "Quý Khách") {
      wishNameInput.value = guestName;
    }

    if (!envelopeOverlay) return;

    // Khóa cuộn trang hoàn toàn khi phong bì đang hiển thị
    document.documentElement.classList.add('envelope-locked');
    document.body.classList.add('envelope-locked');

    // Chặn cuộn trên di động khi đang xem bì thư
    envelopeOverlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    let isOpened = false;

    // Xử lý mở phong bì
    const handleOpenEnvelope = (e) => {
      if (isOpened) return;
      isOpened = true;

      // Kích hoạt class animation mở nắp 3D và phóng to
      envelopeOverlay.classList.add('envelope-opening-active');

      // Tự động phát nhạc nền khi người dùng tương tác mở thiệp
      if (window.MusicPlayer) {
        window.MusicPlayer.play();
      }

      // Sau khi hoạt ảnh hoàn tất (khoảng 1s), ẩn overlay mượt mà và MỞ KHÓA cuộn trang
      setTimeout(() => {
        envelopeOverlay.classList.add('hidden');
        document.documentElement.classList.remove('envelope-locked');
        document.body.classList.remove('envelope-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Bắn pháo hoa Confetti chào đón
        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
          });
        }
      }, 1000);
    };

    // Lắng nghe sự kiện click / tap trên nhiều thành phần để đảm bảo 100% chạm là mở
    const clickableTargets = [
      envelopeWrapper,
      envelopeOverlay,
      document.querySelector('.envelope-hint-text'),
      document.querySelector('.envelope-hand-pointer')
    ].filter(Boolean);

    clickableTargets.forEach(target => {
      target.addEventListener('click', handleOpenEnvelope);
      target.addEventListener('touchstart', handleOpenEnvelope, { passive: true });
    });
  };

  return {
    init,
    getGuestName
  };
})();

// Xuất ra phạm vi toàn cục window
window.EnvelopeController = EnvelopeController;

// Tự động khởi chạy ngay khi DOM sẵn sàng để dự phòng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => EnvelopeController.init());
} else {
  EnvelopeController.init();
}
