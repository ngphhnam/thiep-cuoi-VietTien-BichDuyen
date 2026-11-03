/**
 * Wedding Invitation - Music Player Controller
 * Quản lý phát nhạc nền cưới, danh sách phát và đĩa quay vinyl
 */

const MusicPlayer = (() => {
  let audio = null;
  let isPlaying = false;
  let currentIndex = 0;
  let playlist = [];

  const init = () => {
    playlist = (window.WEDDING_DATA && window.WEDDING_DATA.playlist) || [
      {
        title: "Lễ đường",
        artist: "Kai Đinh",
        src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/songs/le-duong-b33db5e2.mp3"
      },
      {
        title: "Ta là của nhau",
        artist: "Đông Nhi ft. Ông Cao Thắng",
        src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/songs/ta-la-cua-nhau-b0957dcf.mp3"
      },
      {
        title: "Một đời",
        artist: "14 Casper & Bon",
        src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/songs/mot-doi-ed2a6f03.mp3"
      },
      {
        title: "I Do",
        artist: "911 Band",
        src: "https://cdn.jsdelivr.net/gh/quangtuan2201/wedding-invitation@master/mp3/IDo.mp3"
      },
      {
        title: "Beautiful In White",
        artist: "Shane Filan",
        src: "https://raw.githubusercontent.com/DungMihn/DungMihnWedding/master/beautifulinwhite.mp3"
      }
    ];

    if (!audio) {
      audio = new Audio();
      audio.src = playlist[currentIndex].src;
      audio.volume = 0.65;
      audio.preload = 'auto';

      // Tự động chuyển bài khi hết nhạc
      audio.addEventListener('ended', () => {
        nextTrack();
        play();
      });

      // Cập nhật trạng thái đĩa quay và nút dừng phát
      audio.addEventListener('play', () => {
        isPlaying = true;
        const vinylDisc = document.getElementById('vinyl-disc');
        if (vinylDisc) vinylDisc.classList.remove('animate-spin-paused');
        renderPlaylistUI();
        updateToggleUI();
      });

      audio.addEventListener('pause', () => {
        isPlaying = false;
        const vinylDisc = document.getElementById('vinyl-disc');
        if (vinylDisc) vinylDisc.classList.add('animate-spin-paused');
        renderPlaylistUI();
        updateToggleUI();
      });
    }

    const musicBtn = document.getElementById('floating-music-btn');
    const musicDrawer = document.getElementById('music-drawer');
    const playlistContainer = document.getElementById('playlist-items');

    // Tạo danh sách các bài hát trong menu popup
    if (playlistContainer) {
      playlistContainer.innerHTML = '';
      playlist.forEach((song, idx) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${idx === currentIndex ? 'active' : ''}`;
        li.innerHTML = `
          <span>${idx + 1}. ${song.title}</span>
          <span class="text-muted" style="font-size: 0.75rem;">${song.artist || ''}</span>
        `;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          if (idx === currentIndex) {
            toggle();
          } else {
            changeTrack(idx);
            play();
          }
        });
        playlistContainer.appendChild(li);
      });
    }

    // Toggle mở/đóng popup danh sách nhạc
    if (musicBtn) {
      musicBtn.onclick = (e) => {
        e.stopPropagation();
        if (musicDrawer) {
          musicDrawer.classList.toggle('active');
        }
      };
    }

    // Đóng drawer khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (musicDrawer && !musicDrawer.contains(e.target) && e.target !== musicBtn && !musicBtn?.contains(e.target)) {
        musicDrawer.classList.remove('active');
      }
    });

    updateToggleUI();
  };

  const updateToggleUI = () => {
    const toggleLabel = document.getElementById('music-toggle-label');
    const toggleBtn = document.getElementById('music-toggle-btn');
    if (toggleLabel) {
      toggleLabel.textContent = isPlaying ? '⏸️ Dừng phát' : '▶️ Phát nhạc';
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('is-paused', !isPlaying);
      toggleBtn.title = isPlaying ? 'Bấm để tạm dừng nhạc' : 'Bấm để tiếp tục phát nhạc';
    }
  };

  const renderPlaylistUI = () => {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  const play = () => {
    if (!audio) {
      init();
    }
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      const vinylDisc = document.getElementById('vinyl-disc');
      if (vinylDisc) vinylDisc.classList.remove('animate-spin-paused');
    }).catch(err => {
      console.log('Audio autoplay waiting for user tap:', err);
    });
  };

  const pause = () => {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
  };

  const toggle = () => {
    if (isPlaying) pause();
    else play();
  };

  const changeTrack = (index) => {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    if (audio) {
      audio.src = playlist[currentIndex].src;
    }
    renderPlaylistUI();
  };

  const nextTrack = () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    changeTrack(nextIdx);
  };

  return {
    init,
    play,
    pause,
    toggle,
    nextTrack,
    changeTrack
  };
})();

window.MusicPlayer = MusicPlayer;

// Tự động khởi chạy an toàn
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());
} else {
  MusicPlayer.init();
}
