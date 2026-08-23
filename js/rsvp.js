/**
 * Wedding Invitation - RSVP Attendance Confirmation Controller
 * Xác nhận tham dự đám cưới, bắn pháo hoa confetti và lưu trữ
 */

const RSVPController = (() => {
  const init = () => {
    const form = document.getElementById('rsvp-form');
    const radioCards = document.querySelectorAll('.radio-card');
    const sideInput = document.getElementById('rsvp-side');
    const attendingSelect = document.getElementById('rsvp-attending');
    const guestsGroup = document.getElementById('rsvp-guests-group');

    // Xử lý chọn card khách bên nào
    radioCards.forEach(card => {
      card.onclick = () => {
        radioCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (sideInput) {
          sideInput.value = card.dataset.value;
        }
      };
    });

    // Ẩn / Hiện chọn số người tham dự tùy thuộc vào câu trả lời "Có tham dự" hay "Không"
    if (attendingSelect && guestsGroup) {
      attendingSelect.onchange = (e) => {
        if (e.target.value === 'no') {
          guestsGroup.style.display = 'none';
        } else {
          guestsGroup.style.display = 'block';
        }
      };
    }

    // Xử lý gửi biểu mẫu RSVP
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById('rsvp-name')?.value.trim();
        const side = sideInput?.value || 'Nhà gái';
        const attending = attendingSelect?.value || 'yes';
        const guests = document.getElementById('rsvp-guests')?.value || '1';
        const message = document.getElementById('rsvp-message')?.value.trim() || '';

        if (!name) {
          alert('Vui lòng nhập họ và tên của bạn!');
          return;
        }

        const rsvpData = {
          name,
          side,
          attending,
          guests: attending === 'yes' ? guests : 0,
          message,
          timestamp: new Date().toISOString()
        };

        // Lưu vào localStorage
        try {
          const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
          savedRSVPs.push(rsvpData);
          localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));
        } catch (err) {
          console.warn('Storage blocked or unavailable:', err);
        }

        // Tự động thêm lời chúc vào sổ lưu bút nếu có viết lời nhắn
        if (message && window.WishesController) {
          window.WishesController.addWish(name, side === 'Nhà trai' ? 'Khách nhà trai' : 'Khách nhà gái', message);
        }

        // Kích hoạt pháo hoa Confetti ăn mừng
        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });
        }

        // Hiển thị thông báo Toast
        if (window.App && window.App.showToast) {
          window.App.showToast(`Cảm ơn ${name}! Xác nhận tham dự của bạn đã được gửi thành công. ❤️`);
        } else {
          alert(`Cảm ơn ${name}! Xác nhận tham dự của bạn đã được gửi thành công.`);
        }

        // Thay đổi nút submit thành trạng thái đã gửi
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = `<span>✓ Đã xác nhận tham dự</span>`;
          submitBtn.style.background = '#48bb78';
          submitBtn.disabled = true;
        }
      };
    }
  };

  return {
    init
  };
})();

window.RSVPController = RSVPController;

// Tự động khởi chạy an toàn
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RSVPController.init());
} else {
  RSVPController.init();
}
