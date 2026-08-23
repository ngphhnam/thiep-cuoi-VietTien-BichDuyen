/**
 * Wedding Invitation - Realtime Live Countdown Timer
 * Đếm ngược thời gian chính xác theo thời gian thực tới ngày cưới
 */

const CountdownTimer = (() => {
  let timerInterval = null;

  const init = () => {
    const targetDateStr = (window.WEDDING_DATA && window.WEDDING_DATA.weddingDate) || "2026-10-26T09:00:00";
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        if (timerInterval) clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
      if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    updateTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  };

  return {
    init
  };
})();

window.CountdownTimer = CountdownTimer;

// Tự động khởi chạy an toàn
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CountdownTimer.init());
} else {
  CountdownTimer.init();
}
