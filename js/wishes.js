/**
 * Wedding Invitation - Wishes & RSVP Controller (Nhắn Gửi Yêu Thương)
 * Xử lý biểu mẫu gửi lời chúc, chèn emoji, chọn ảnh khách của ai và danh sách lưu bút
 * Toàn bộ dữ liệu ban đầu được nạp động từ window.WEDDING_DATA trong data.js
 */

const WishesController = (() => {
  let wishes = [];

  // Hàm chuyển đổi Date object thành chuỗi định dạng HH:mm - DD/MM/YYYY
  const formatDateTime = (dateObj) => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  // Hàm định dạng ngày giờ thực tế chuẩn xác và linh hoạt theo dữ liệu
  const formatWishTime = (wish) => {
    if (!wish) return formatDateTime(new Date());

    // Nếu time đã là chuỗi ngày giờ hợp lệ
    if (typeof wish.time === 'string' && wish.time.includes('/') && wish.time.includes(':')) {
      return wish.time;
    }

    // Nếu có trường timestamp (ISO string hoặc timestamp)
    if (wish.timestamp) {
      const formatted = formatDateTime(wish.timestamp);
      if (formatted) return formatted;
    }

    // Nếu id là timestamp số nguyên (Date.now())
    if (typeof wish.id === 'number' && wish.id > 1000000000000) {
      const formatted = formatDateTime(wish.id);
      if (formatted) return formatted;
    }

    // Nếu wish.time là một chuỗi ngày giờ parse được
    if (typeof wish.time === 'string' && !isNaN(Date.parse(wish.time))) {
      const formatted = formatDateTime(wish.time);
      if (formatted) return formatted;
    }

    // Trường hợp mặc định lấy giờ hiện tại
    return formatDateTime(new Date());
  };

  // Tải danh sách lời chúc từ data.js và localStorage
  const loadWishes = () => {
    const initial = (window.WEDDING_DATA && window.WEDDING_DATA.initialWishes) || [];

    try {
      const stored = JSON.parse(localStorage.getItem('wedding_custom_wishes') || '[]');
      const formattedStored = stored.map(item => ({
        ...item,
        time: formatWishTime(item)
      }));
      wishes = [...formattedStored, ...initial];
    } catch (e) {
      wishes = [...initial];
    }
  };

  // Render danh sách lời chúc ra giao diện
  const renderWishes = () => {
    const feed = document.getElementById('wishes-feed');
    if (!feed) return;

    feed.innerHTML = '';

    wishes.forEach(wish => {
      const firstChar = (wish.name && wish.name.trim().charAt(0).toUpperCase()) || '❤';
      const card = document.createElement('div');
      card.className = 'wish-card reveal-item is-revealed';
      
      const sideText = wish.side ? ` • ${wish.side}` : '';
      const relationText = (wish.relation || 'Khách quý') + sideText;
      const displayTime = formatWishTime(wish);

      card.innerHTML = `
        <div class="wish-header">
          <div class="wish-author-info">
            <div class="wish-avatar">${firstChar}</div>
            <div>
              <div class="wish-author-name">${wish.name}</div>
              <div class="wish-relation">${relationText}</div>
            </div>
          </div>
          <div class="wish-time">${displayTime}</div>
        </div>
        <div class="wish-text">${wish.message}</div>
        <div class="wish-actions">
          <button class="btn-like-wish" data-id="${wish.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="like-count">${wish.likes || 1}</span>
          </button>
        </div>
      `;

      // Xử lý nút like tim
      const likeBtn = card.querySelector('.btn-like-wish');
      if (likeBtn) {
        likeBtn.onclick = () => {
          likeBtn.classList.toggle('liked');
          const countSpan = likeBtn.querySelector('.like-count');
          let currentLikes = parseInt(countSpan.textContent) || 0;
          if (likeBtn.classList.contains('liked')) {
            countSpan.textContent = currentLikes + 1;
          } else {
            countSpan.textContent = Math.max(0, currentLikes - 1);
          }
        };
      }

      feed.appendChild(card);
    });
  };

  // Thêm lời chúc mới và lưu đồng bộ
  const addWish = (name, relation, side, message, attending = 'yes', guests = '1') => {
    if (!name || !message) return;

    const now = new Date();
    const formattedTime = formatDateTime(now);

    const newWish = {
      id: now.getTime(),
      name: name.trim(),
      relation: relation || 'Khách mời',
      side: side || 'Cả hai',
      message: message.trim(),
      time: formattedTime,
      timestamp: now.toISOString(),
      likes: 1
    };

    wishes.unshift(newWish);

    // Lưu vào localStorage
    try {
      const storedWishes = JSON.parse(localStorage.getItem('wedding_custom_wishes') || '[]');
      storedWishes.unshift(newWish);
      localStorage.setItem('wedding_custom_wishes', JSON.stringify(storedWishes));

      // Đồng thời lưu xác nhận RSVP
      const rsvpData = {
        name: name.trim(),
        relation: relation || '',
        side: side || 'Cả hai',
        attending,
        guests,
        message: message.trim(),
        time: formattedTime,
        timestamp: now.toISOString()
      };
      const storedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      storedRSVPs.push(rsvpData);
      localStorage.setItem('wedding_rsvps', JSON.stringify(storedRSVPs));
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }

    renderWishes();
  };

  // Khởi tạo tính năng Emoji Drawer
  const initEmojiPicker = () => {
    const emojiBtn = document.getElementById('emoji-picker-btn');
    const popover = document.getElementById('emoji-popover');
    const textarea = document.getElementById('wish-message');

    if (!emojiBtn || !popover || !textarea) return;

    emojiBtn.onclick = (e) => {
      e.stopPropagation();
      const isActive = popover.classList.toggle('active');
      emojiBtn.classList.toggle('active', isActive);
    };

    const emojiItems = popover.querySelectorAll('.emoji-item');
    emojiItems.forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const emoji = item.textContent.trim();
        insertAtCursor(textarea, emoji);
      };
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !emojiBtn.contains(e.target)) {
        popover.classList.remove('active');
        emojiBtn.classList.remove('active');
      }
    });
  };

  const insertAtCursor = (textarea, text) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + text + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  };

  // Khởi tạo chọn 3 ảnh (Cô dâu / Chú rể / Cả hai)
  const initGuestSideCards = () => {
    const cards = document.querySelectorAll('.guest-side-card');
    const sideInput = document.getElementById('wish-side');

    cards.forEach(card => {
      card.onclick = () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (sideInput) {
          sideInput.value = card.dataset.value;
        }
      };
    });
  };

  const init = () => {
    loadWishes();
    renderWishes();
    initEmojiPicker();
    initGuestSideCards();

    const form = document.getElementById('wish-form');
    if (form) {
      const guestName = (window.EnvelopeController && window.EnvelopeController.getGuestName()) || '';
      const nameInput = document.getElementById('wish-name');
      if (nameInput && guestName && guestName !== 'Quý Khách') {
        nameInput.value = guestName;
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('wish-name')?.value.trim();
        const relation = document.getElementById('wish-relation')?.value.trim() || 'Bạn bè';
        const message = document.getElementById('wish-message')?.value.trim();
        const side = document.getElementById('wish-side')?.value || 'Cả hai';
        const attending = document.getElementById('wish-attending')?.value || 'yes';
        const guests = document.getElementById('wish-guests')?.value || '1';

        if (!message) {
          alert('Vui lòng nhập nội dung lời chúc!');
          document.getElementById('wish-message')?.focus();
          return;
        }
        if (!name) {
          alert('Vui lòng nhập tên của bạn!');
          document.getElementById('wish-name')?.focus();
          return;
        }

        addWish(name, relation, side, message, attending, guests);

        const messageInput = document.getElementById('wish-message');
        if (messageInput) messageInput.value = '';

        // Hiển thị Toast thông báo
        if (window.App && window.App.showToast) {
          window.App.showToast(`Cảm ơn ${name}! Lời chúc của bạn đã được gửi thành công. ❤️`);
        } else {
          alert(`Cảm ơn ${name}! Lời chúc của bạn đã được gửi thành công.`);
        }

        // Bắn pháo hoa Confetti ăn mừng
        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      };
    }
  };

  return {
    init,
    addWish,
    formatWishTime
  };
})();

window.WishesController = WishesController;

// Tự động khởi chạy an toàn
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WishesController.init());
} else {
  WishesController.init();
}
