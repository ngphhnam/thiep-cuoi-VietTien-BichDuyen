/**
 * ADMIN CONTROLLER - BÍCH DUYÊN & VIỆT TIẾN
 * Quản lý danh sách khách mời, tạo link cá nhân hóa & trạng thái đã gửi.
 */

const AdminApp = (() => {
  // Cấu hình mã PIN đăng nhập (1998)
  const VALID_PINS = ['1998'];
  const STORAGE_KEY_AUTH = 'wedding_admin_authenticated';
  const STORAGE_KEY_GUESTS = 'wedding_admin_guests_v1';
  const STORAGE_KEY_TEMPLATE = 'wedding_admin_msg_template';
  const STORAGE_KEY_SHEET_URL = 'wedding_admin_sheet_url';
  const STORAGE_KEY_WISHES = 'wedding_custom_wishes';
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
  let wishes = [];
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

    // Tải danh sách lời chúc
    loadWishes();

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

  // 6. Tạo Link Thiệp & Sao Chép (Định dạng tiếng Việt rõ ràng, gọn gàng, không bị mã hóa %)
  const generateGuestLink = (guestName) => {
    const base = getBaseWeddingUrl();
    const cleanName = (guestName || '')
      .trim()
      .replace(/\+/g, '&')
      .replace(/\s+/g, '_');
    return `${base}?u=${cleanName}`;
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
    renderWishes();
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

  // 9. Quản Lý Lời Chúc (Sổ Lưu Bút)
  const loadWishes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WISHES);
      wishes = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(wishes)) wishes = [];
    } catch (e) {
      console.error('Lỗi nạp lời chúc:', e);
      wishes = [];
    }
  };

  const saveWishes = () => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
    } catch (e) {
      console.error('Lỗi lưu lời chúc:', e);
    }
  };

  const renderWishes = () => {
    const tbody = document.getElementById('wishes-tbody');
    const emptyState = document.getElementById('wishes-empty-state');
    if (!tbody) return;

    if (wishes.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = wishes.map((w, index) => {
      const senderName = escapeHtml(w.name || 'Khách');
      const relation = escapeHtml(w.relation || 'Khách mời');
      const side = escapeHtml(w.side || 'Cả hai');
      const message = escapeHtml(w.message || '');
      const time = escapeHtml(w.time || (w.timestamp ? new Date(w.timestamp).toLocaleString('vi-VN') : 'Mới gửi'));
      const id = w.id || index;

      return `
        <tr>
          <td style="color: var(--color-text-muted); font-weight: 500;">${index + 1}</td>
          <td style="font-weight: 600; color: var(--color-text-primary);">${senderName}</td>
          <td><span class="badge" style="background: rgba(184, 150, 90, 0.15); color: #855c1b;">${relation}</span></td>
          <td><span class="badge" style="background: rgba(33, 150, 243, 0.12); color: #0c63c9;">${side}</span></td>
          <td style="max-width: 320px; white-space: pre-wrap; font-size: 0.9rem; line-height: 1.4;">${message}</td>
          <td style="font-size: 0.82rem; color: var(--color-text-secondary);">${time}</td>
          <td style="text-align: right;">
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="AdminApp.deleteWish('${id}')" title="Xóa lời chúc này">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const deleteWish = (id) => {
    if (!confirm('Bạn có chắc muốn xóa lời chúc này không?')) return;
    wishes = wishes.filter(w => String(w.id) !== String(id));
    saveWishes();
    renderWishes();
    showToast('Đã xóa lời chúc thành công!');
  };

  const clearAllWishes = () => {
    if (wishes.length === 0) {
      showToast('Danh sách lời chúc đang trống!');
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa TẤT CẢ ${wishes.length} lời chúc không? Hãy nhớ tải file backup trước nhé!`)) return;
    wishes = [];
    saveWishes();
    renderWishes();
    showToast('Đã xóa toàn bộ lời chúc!');
  };

  // Tải file JSON
  const downloadWishesJSON = () => {
    if (wishes.length === 0) {
      showToast('Chưa có lời chúc nào để tải về!');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wishes, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    dlAnchorElem.setAttribute("download", `loi_chuc_dam_cuoi_${dateStr}.json`);
    dlAnchorElem.click();
    showToast(`Đã xuất ${wishes.length} lời chúc thành file JSON!`);
  };

  // Tải file Excel
  const downloadWishesExcel = () => {
    if (typeof XLSX === 'undefined') {
      alert('Thư viện Excel chưa sẵn sàng. Vui lòng thử lại sau giây lát!');
      return;
    }
    if (wishes.length === 0) {
      showToast('Chưa có lời chúc nào để xuất Excel!');
      return;
    }

    const rows = wishes.map((w, index) => ({
      'STT': index + 1,
      'Người Gửi': w.name || '',
      'Mối Quan Hệ': w.relation || 'Khách mời',
      'Khách Của': w.side || 'Cả hai',
      'Lời Chúc': w.message || '',
      'Thời Gian': w.time || (w.timestamp ? new Date(w.timestamp).toLocaleString('vi-VN') : ''),
      'ID': w.id || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lưu Bút Cưới');

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 50 },
      { wch: 22 },
      { wch: 16 }
    ];

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `danh_sach_loi_chuc_${dateStr}.xlsx`);
    showToast(`Đã xuất ${wishes.length} lời chúc thành file Excel!`);
  };

  // Nạp lời chúc từ file JSON hoặc Excel đã tải về
  const handleImportWishes = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) {
            alert('File JSON không đúng định dạng mảng danh sách lời chúc!');
            return;
          }
          mergeWishes(imported);
        } catch (err) {
          alert('Không thể đọc file JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      if (typeof XLSX === 'undefined') {
        alert('Thư viện đọc Excel chưa sẵn sàng!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(sheet);

          if (!rawRows || rawRows.length === 0) {
            alert('File Excel không có dữ liệu!');
            return;
          }

          const imported = rawRows.map((r, i) => {
            const name = r['Người Gửi'] || r['Ten'] || r['Tên'] || r['Name'] || '';
            const msg = r['Lời Chúc'] || r['Noi Dung'] || r['Nội Dung'] || r['Message'] || r['Loi Chuc'] || '';
            const relation = r['Mối Quan Hệ'] || r['Quan He'] || r['Relation'] || 'Khách mời';
            const side = r['Khách Của'] || r['Side'] || 'Cả hai';
            const time = r['Thời Gian'] || r['Time'] || '';
            const id = r['ID'] || (Date.now() + i);

            return {
              id: id,
              name: String(name).trim(),
              relation: String(relation).trim(),
              side: String(side).trim(),
              message: String(msg).trim(),
              time: time,
              timestamp: new Date().toISOString(),
              likes: 1
            };
          }).filter(w => w.name && w.message);

          if (imported.length === 0) {
            alert('Không tìm thấy cột "Người Gửi" và "Lời Chúc" trong file Excel!');
            return;
          }

          mergeWishes(imported);
        } catch (err) {
          alert('Lỗi đọc file Excel: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Vui lòng chọn file .json hoặc .xlsx!');
    }

    event.target.value = '';
  };

  // Hợp nhất lời chúc và lọc trùng lặp
  const mergeWishes = (importedList) => {
    let addedCount = 0;
    loadWishes();

    importedList.forEach(item => {
      if (!item || !item.name || !item.message) return;
      // Kiểm tra trùng theo ID hoặc theo cặp (Tên + Nội dung)
      const isExist = wishes.some(w => 
        (item.id && String(w.id) === String(item.id)) ||
        (w.name.trim() === item.name.trim() && w.message.trim() === item.message.trim())
      );

      if (!isExist) {
        wishes.unshift({
          id: item.id || Date.now() + Math.floor(Math.random() * 1000),
          name: String(item.name).trim(),
          relation: item.relation || 'Khách quý',
          side: item.side || 'Cả hai',
          message: String(item.message).trim(),
          time: item.time || '',
          timestamp: item.timestamp || new Date().toISOString(),
          likes: item.likes || 1
        });
        addedCount++;
      }
    });

    saveWishes();
    renderWishes();
    showToast(`Đã nạp thành công! Thêm mới ${addedCount} lời chúc.`);
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
    syncWithSheet,
    downloadWishesJSON,
    downloadWishesExcel,
    handleImportWishes,
    deleteWish,
    clearAllWishes
  };
})();

