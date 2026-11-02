/**
 * ADMIN CONTROLLER - BÍCH DUYÊN & VIỆT TIẾN
 * Quản lý danh sách khách mời, tạo link cá nhân hóa & trạng thái đã gửi.
 */

const AdminApp = (() => {
  // Cấu hình mã PIN đăng nhập mặc định (hoặc 18122026)
  const VALID_PINS = ['1812', '18122026'];
  const STORAGE_KEY_AUTH = 'wedding_admin_authenticated';
  const STORAGE_KEY_GUESTS = 'wedding_admin_guests_v1';
  const STORAGE_KEY_TEMPLATE = 'wedding_admin_msg_template';
  const STORAGE_KEY_SHEET_URL = 'wedding_admin_sheet_url';
  const DEFAULT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyBdBB6x_9SwFdLJxtYzVdjm1URAPD2r32iDaC0mlhbwamKd9ljm43ZhX_MXV4LeTmgMw/exec';

  // Mẫu tin nhắn mời cưới mặc định
  const DEFAULT_MESSAGE_TEMPLATE = 
`Thân gửi {name},

Bích Duyên & Việt Tiến trân trọng kính mời {name} đến chung vui cùng gia đình chúng mình tại Lễ Thành Hôn vào ngày 18.12.2026.

Sự hiện diện của {name} là niềm vinh hạnh to lớn đối với chúng mình!
Bấm vào thiệp cưới điện tử bên dưới để xem thông tin chi tiết và gửi lời chúc mừng cho chúng mình nhé:
{link}`;

  // State ứng dụng
  let guests = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // Khởi tạo Base URL thiệp cưới
  const getBaseWeddingUrl = () => {
    const origin = window.location.origin;
    let pathname = window.location.pathname;
    // Bỏ đuôi admin.html nếu có
    pathname = pathname.replace(/\/admin\.html$/i, '/').replace(/\/admin$/i, '/');
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }
    return `${origin}${pathname}`;
  };

  // 1. Quản lý Đăng Nhập
  const checkAuth = () => {
    const isAuth = sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('admin-dashboard');

    if (isAuth) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (dashboard) dashboard.style.display = 'flex';
      loadData();
      render();
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (dashboard) dashboard.style.display = 'none';
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const pinInput = document.getElementById('pin-input');
    const errorEl = document.getElementById('login-error');
    const enteredPin = (pinInput ? pinInput.value : '').trim();

    if (VALID_PINS.includes(enteredPin)) {
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      if (errorEl) errorEl.textContent = '';
      checkAuth();
      showToast('Đăng nhập thành công! Chào mừng bạn.');
    } else {
      if (errorEl) errorEl.textContent = 'Mã PIN không chính xác. Vui lòng thử lại (1812)!';
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
      checkAuth();
    }
  };

  // 2. Tải & Lưu Dữ Liệu
  const loadData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUESTS);
      guests = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(guests)) guests = [];
    } catch (e) {
      console.error('Lỗi đọc dữ liệu khách:', e);
      guests = [];
    }

    // Tải template tin nhắn
    const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    const templateInput = document.getElementById('msg-template-input');
    if (templateInput) {
      templateInput.value = savedTemplate || DEFAULT_MESSAGE_TEMPLATE;
    }

    updateSheetSyncStatus();
    // Tự động đồng bộ với Google Sheets nếu đã cài URL
    const sheetUrl = localStorage.getItem(STORAGE_KEY_SHEET_URL);
    if (sheetUrl) {
      syncWithSheet(false);
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(guests));
      updateStats();
    } catch (e) {
      console.error('Lỗi lưu dữ liệu khách:', e);
    }
  };

  // ==================== GOOGLE SHEETS SYNC ====================
  const getSheetUrl = () => {
    return localStorage.getItem(STORAGE_KEY_SHEET_URL) || DEFAULT_SHEET_URL;
  };

  const updateSheetSyncStatus = () => {
    const sheetUrl = getSheetUrl();
    const dot = document.getElementById('sync-status-dot');
    const text = document.getElementById('sync-status-text');
    const btnSync = document.getElementById('btn-sync-now');

    if (sheetUrl) {
      if (dot) {
        dot.className = 'sync-status-dot connected';
      }
      if (text) {
        text.innerHTML = '🟢 <strong>Đã kết nối Google Sheet:</strong> Dữ liệu tự động đồng bộ thời gian thực.';
      }
      if (btnSync) btnSync.style.display = 'inline-flex';
    } else {
      if (dot) {
        dot.className = 'sync-status-dot disconnected';
      }
      if (text) {
        text.textContent = '⚪ Chưa kết nối Google Sheet (Đang lưu an toàn trên máy).';
      }
      if (btnSync) btnSync.style.display = 'none';
    }
  };

  const openSheetModal = () => {
    const modal = document.getElementById('sheet-modal');
    const input = document.getElementById('sheet-url-input');
    const currentUrl = getSheetUrl();
    if (input) input.value = currentUrl;
    if (modal) modal.classList.add('show');
  };

  const closeSheetModal = () => {
    const modal = document.getElementById('sheet-modal');
    if (modal) modal.classList.remove('show');
  };

  const saveSheetUrl = async () => {
    const input = document.getElementById('sheet-url-input');
    const url = input ? input.value.trim() : '';
    if (!url) {
      showToast('Vui lòng nhập Web App URL của Google Apps Script!');
      return;
    }
    if (!url.startsWith('https://script.google.com/')) {
      alert('Đường dẫn không hợp lệ. URL phải bắt đầu bằng https://script.google.com/macros/s/...');
      return;
    }

    localStorage.setItem(STORAGE_KEY_SHEET_URL, url);
    closeSheetModal();
    updateSheetSyncStatus();
    showToast('Đang kết nối & đồng bộ dữ liệu với Google Sheet...');
    await syncWithSheet(true);
  };

  const disconnectSheet = () => {
    if (confirm('Bạn có chắc muốn hủy kết nối với Google Sheet không? (Dữ liệu trên máy vẫn được giữ nguyên)')) {
      localStorage.removeItem(STORAGE_KEY_SHEET_URL);
      closeSheetModal();
      updateSheetSyncStatus();
      showToast('Đã hủy kết nối Google Sheet.');
    }
  };

  // Đồng bộ 2 chiều với Google Sheets
  const syncWithSheet = async (showNotice = false) => {
    const sheetUrl = getSheetUrl();
    if (!sheetUrl) return;

    try {
      const response = await fetch(`${sheetUrl}?action=get_all&t=${Date.now()}`);
      if (!response.ok) throw new Error('Không thể kết nối');
      const data = await response.json();

      if (Array.isArray(data)) {
        let updatedCount = 0;
        data.forEach(item => {
          if (!item.name) return;
          const cleanName = String(item.name).trim();
          const existing = guests.find(g => g.name.toLowerCase() === cleanName.toLowerCase());
          if (existing) {
            // Cập nhật trạng thái nếu trên Sheet đã đánh dấu gửi
            if (item.copied && !existing.copied) {
              existing.copied = true;
              existing.copiedAt = item.copiedAt || new Date().toLocaleString('vi-VN');
              updatedCount++;
            }
          } else {
            // Thêm khách mới từ Sheet vào danh sách
            guests.push({
              id: 'guest_' + (Date.now() + Math.floor(Math.random() * 10000)),
              name: cleanName,
              copied: !!item.copied,
              copiedAt: item.copiedAt || null,
              createdAt: new Date().toISOString()
            });
            updatedCount++;
          }
        });

        // Nếu trên web có khách chưa có trên Sheet, đẩy lên Sheet
        const missingOnSheet = guests.filter(g => 
          !data.some(d => String(d.name).toLowerCase().trim() === g.name.toLowerCase())
        );
        if (missingOnSheet.length > 0) {
          postToSheet({
            action: 'add_guests',
            guests: missingOnSheet.map(g => ({
              name: g.name,
              link: generateGuestLink(g.name),
              copied: g.copied,
              copiedAt: g.copiedAt
            }))
          });
        }

        saveData();
        render();
        if (showNotice) {
          showToast(`Đồng bộ thành công! (${guests.length} khách mời)`);
        }
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ Google Sheet:', err);
      if (showNotice) {
        showToast('Không thể kết nối đến Google Sheet. Vui lòng kiểm tra lại URL.');
      }
    }
  };

  // Gửi thay đổi lên Google Sheets (Chạy ngầm không làm đơ trang)
  const postToSheet = (payload) => {
    const sheetUrl = getSheetUrl();
    if (!sheetUrl) return;

    try {
      fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      }).catch(e => console.warn('Lỗi ghi Google Sheet:', e));
    } catch (e) {
      console.warn('postToSheet error:', e);
    }
  };

  // 3. Xử lý Import File Excel
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!json || json.length === 0) {
          showToast('File Excel trống!');
          return;
        }

        // Tìm cột chứa tên khách
        let nameColIndex = 0;
        let startRowIndex = 0;

        // Kiểm tra xem dòng đầu tiên có phải tiêu đề không
        const headerRow = json[0];
        if (Array.isArray(headerRow)) {
          const foundIdx = headerRow.findIndex(cell => {
            const str = String(cell || '').toLowerCase().trim();
            return str.includes('tên') || str.includes('khách') || str.includes('name');
          });
          if (foundIdx !== -1) {
            nameColIndex = foundIdx;
            startRowIndex = 1; // Bỏ qua hàng header
          }
        }

        let addedCount = 0;
        const now = Date.now();

        for (let i = startRowIndex; i < json.length; i++) {
          const row = json[i];
          if (!row) continue;
          const rawName = row[nameColIndex];
          if (rawName && String(rawName).trim()) {
            const name = String(rawName).trim();
            // Kiểm tra trùng
            const exists = guests.some(g => g.name.toLowerCase() === name.toLowerCase());
            if (!exists) {
              guests.push({
                id: 'guest_' + (now + Math.floor(Math.random() * 100000) + i),
                name: name,
                copied: false,
                copiedAt: null,
                createdAt: new Date().toISOString()
              });
              addedCount++;
            }
          }
        }

        saveData();
        render();
        showToast(`Đã thêm thành công ${addedCount} khách mời từ Excel!`);
        e.target.value = ''; // Reset input
      } catch (err) {
        console.error('Lỗi đọc file Excel:', err);
        alert('Không thể đọc file Excel này. Vui lòng kiểm tra lại định dạng file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 4. Nhập tay danh sách tên khách
  const handleManualAdd = (e) => {
    e.preventDefault();
    const textarea = document.getElementById('manual-names-input');
    if (!textarea) return;

    const text = textarea.value.trim();
    if (!text) {
      showToast('Vui lòng nhập ít nhất một tên khách mời!');
      return;
    }

    const lines = text.split('\n');
    let addedCount = 0;
    const now = Date.now();

    lines.forEach((line, idx) => {
      const cleanName = line.trim().replace(/^[-*•\d.]+\s*/, ''); // Bỏ số thứ tự nếu có
      if (cleanName) {
        const exists = guests.some(g => g.name.toLowerCase() === cleanName.toLowerCase());
        if (!exists) {
          guests.push({
            id: 'guest_' + (now + idx),
            name: cleanName,
            copied: false,
            copiedAt: null,
            createdAt: new Date().toISOString()
          });
          addedCount++;
        }
      }
    });

    textarea.value = '';
    saveData();
    render();
    showToast(`Đã thêm thành công ${addedCount} khách mời!`);
  };

  // 5. Cấu hình Mẫu Tin Nhắn
  const saveMessageTemplate = () => {
    const input = document.getElementById('msg-template-input');
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
      showToast('Nội dung mẫu tin nhắn không được để trống!');
      return;
    }
    localStorage.setItem(STORAGE_KEY_TEMPLATE, val);
    showToast('Đã lưu mẫu tin nhắn thành công!');
  };

  // 6. Tạo Link Thiệp & Sao Chép
  const generateGuestLink = (guestName) => {
    const base = getBaseWeddingUrl();
    return `${base}?guest=${encodeURIComponent(guestName)}`;
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback cho trình duyệt cũ
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  };

  // Sao chép link
  const copyGuestLink = async (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    const link = generateGuestLink(guest.name);
    try {
      await copyToClipboard(link);
      markAsCopied(guest);
      showToast(`Đã sao chép link của: ${guest.name}`);
    } catch (err) {
      console.error(err);
      prompt('Hãy sao chép link thủ công bên dưới:', link);
    }
  };

  // Sao chép tin nhắn kèm link
  const copyGuestMessage = async (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    const link = generateGuestLink(guest.name);
    const templateInput = document.getElementById('msg-template-input');
    const template = (templateInput && templateInput.value.trim()) || DEFAULT_MESSAGE_TEMPLATE;

    const fullMessage = template
      .replace(/{name}/g, guest.name)
      .replace(/{link}/g, link);

    try {
      await copyToClipboard(fullMessage);
      markAsCopied(guest);
      showToast(`Đã sao chép tin nhắn mời của: ${guest.name}`);
    } catch (err) {
      console.error(err);
      prompt('Hãy sao chép tin nhắn thủ công bên dưới:', fullMessage);
    }
  };

  // Đánh dấu trạng thái đã copy
  const markAsCopied = (guest) => {
    guest.copied = true;
    guest.copiedAt = new Date().toLocaleString('vi-VN');
    saveData();
    renderRow(guest.id);
    updateStats();

    // Gửi cập nhật trực tiếp lên Google Sheet
    postToSheet({
      action: 'mark_copied',
      name: guest.name,
      copiedAt: guest.copiedAt
    });
  };

  // Xóa 1 khách mời
  const deleteGuest = (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;
    if (confirm(`Bạn có chắc muốn xóa khách mời "${guest.name}" không?`)) {
      guests = guests.filter(g => g.id !== guestId);
      saveData();
      render();
      showToast('Đã xóa khách mời.');
    }
  };

  // Xóa toàn bộ
  const clearAllGuests = () => {
    if (guests.length === 0) return;
    if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ danh sách khách mời không? Thao tác này không thể hoàn tác!')) {
      guests = [];
      saveData();
      render();
      showToast('Đã xóa toàn bộ danh sách khách mời.');
    }
  };

  // 7. Xuất file Excel báo cáo
  const exportExcel = () => {
    if (guests.length === 0) {
      showToast('Danh sách khách đang trống, không có gì để xuất!');
      return;
    }

    const exportData = guests.map((g, idx) => ({
      'STT': idx + 1,
      'Tên Khách Mời': g.name,
      'Link Thiệp Cưới': generateGuestLink(g.name),
      'Trạng Thái': g.copied ? 'Đã copy gửi' : 'Chưa gửi',
      'Thời Gian Gửi': g.copiedAt || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachKhachMoi');
    XLSX.writeFile(wb, `Danh_Sach_Thiep_Cuoi_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Đã xuất file Excel thành công!');
  };

  // Tải file mẫu
  const downloadSampleExcel = () => {
    const sampleData = [
      { 'Tên Khách Mời': 'Gia đình Bác Hùng' },
      { 'Tên Khách Mời': 'Anh Tuấn & Bạn Gái' },
      { 'Tên Khách Mời': 'Bạn Phương Thảo' },
      { 'Tên Khách Mời': 'Đồng nghiệp team Marketing' }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MauKhachMoi');
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Khach_Moi.xlsx');
  };

  // 8. Tìm kiếm & Lọc
  const handleSearch = (e) => {
    searchQuery = (e.target.value || '').toLowerCase().trim();
    render();
  };

  const setFilter = (filter) => {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    render();
  };

  const switchTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => 
      b.getAttribute('onclick').includes(tabId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    const content = document.getElementById(`tab-${tabId}`);
    if (content) content.classList.add('active');
  };

  // 9. Cập Nhật Giao Diện
  const updateStats = () => {
    const total = guests.length;
    const copied = guests.filter(g => g.copied).length;
    const pending = total - copied;

    const elTotal = document.getElementById('stat-total');
    const elCopied = document.getElementById('stat-copied');
    const elPending = document.getElementById('stat-pending');

    if (elTotal) elTotal.textContent = total;
    if (elCopied) elCopied.textContent = copied;
    if (elPending) elPending.textContent = pending;
  };

  const getFilteredGuests = () => {
    return guests.filter(g => {
      // Lọc theo trạng thái
      if (currentFilter === 'pending' && g.copied) return false;
      if (currentFilter === 'copied' && !g.copied) return false;

      // Lọc theo tìm kiếm
      if (searchQuery && !g.name.toLowerCase().includes(searchQuery)) {
        return false;
      }
      return true;
    });
  };

  const renderRow = (guestId) => {
    const rowEl = document.getElementById(`row-${guestId}`);
    const guest = guests.find(g => g.id === guestId);
    if (!rowEl || !guest) return;

    // Cập nhật cell trạng thái
    const statusCell = rowEl.querySelector('.status-cell');
    if (statusCell) {
      statusCell.innerHTML = guest.copied
        ? `<span class="badge badge-copied" title="${guest.copiedAt || ''}">✅ Đã copy</span>`
        : `<span class="badge badge-pending">⏳ Chưa gửi</span>`;
    }
  };

  const render = () => {
    updateStats();
    const tbody = document.getElementById('guests-tbody');
    const emptyState = document.getElementById('empty-state');
    if (!tbody) return;

    const filtered = getFilteredGuests();

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map((g, index) => {
      const link = generateGuestLink(g.name);
      return `
        <tr id="row-${g.id}">
          <td style="color: var(--color-text-muted); font-weight: 500;">${index + 1}</td>
          <td class="guest-name-cell">${escapeHtml(g.name)}</td>
          <td class="guest-link-cell">
            <input type="text" class="guest-link-input" readonly value="${escapeHtml(link)}" onclick="this.select()" />
          </td>
          <td class="status-cell" style="text-align: center;">
            ${g.copied 
              ? `<span class="badge badge-copied" title="${g.copiedAt || ''}">✅ Đã copy</span>` 
              : `<span class="badge badge-pending">⏳ Chưa gửi</span>`}
          </td>
          <td style="text-align: right;">
            <div class="table-actions">
              <button type="button" class="btn btn-outline-gold btn-sm" onclick="AdminApp.copyGuestLink('${g.id}')" title="Sao chép đường link">
                🔗 Copy Link
              </button>
              <button type="button" class="btn btn-primary btn-sm" onclick="AdminApp.copyGuestMessage('${g.id}')" title="Sao chép toàn bộ tin nhắn mời">
                💬 Copy Tin Nhắn
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" onclick="AdminApp.deleteGuest('${g.id}')" title="Xóa">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  const escapeHtml = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Toast
  let toastTimer = null;
  const showToast = (msg) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Khởi chạy khi load trang
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
  });

  return {
    handleLogin,
    handleLogout,
    handleFileUpload,
    handleManualAdd,
    saveMessageTemplate,
    copyGuestLink,
    copyGuestMessage,
    deleteGuest,
    clearAllGuests,
    exportExcel,
    downloadSampleExcel,
    handleSearch,
    setFilter,
    switchTab,
    openSheetModal,
    closeSheetModal,
    saveSheetUrl,
    disconnectSheet,
    syncWithSheet
  };
})();

