/**
 * Dữ liệu cấu hình thiệp cưới Bích Duyên & Việt Tiến
 * Có thể chỉnh sửa thông tin tại đây
 */
const WEDDING_DATA = {
  id: "4bf83da0-dbe5-4bf5-aaab-58a0d7110943",
  title: "Bích Duyên & Việt Tiến",
  slug: "tien-duyen",
  theme: "classic",
  
  // Thông tin ngày cưới
  weddingDate: "2026-12-18T09:00:00",
  displayDate: "18 . 12 . 2026",
  displayDateFull: "Thứ Sáu, ngày 18 tháng 12 năm 2026",
  city: "Phước Long, Đồng Nai",

  // Thông tin cặp đôi
  couple: {
    title: "Đôi Nét Về Chúng Tôi",
    groom: {
      holyName: "Antôn",
      fullName: "Antôn Lê Việt Tiến",
      name: "Việt Tiến",
      shortName: "Tiến",
      rank: "Thứ Nam",
      image: "image/avatar-groom.jpg",
      father: "Phêrô Lê Quốc Việt",
      mother: "Maria Lê Thị Bích Ngọc",
      address: "281 Quốc Lộ 57B, Lộc Thuận, Vĩnh Long",
      bio: "Một người luôn hướng về gia đình, trách nhiệm và dành trọn tình yêu thương cho người bạn đời."
    },
    bride: {
      holyName: "Isave",
      fullName: "Isave Nguyễn Thị Bích Duyên",
      name: "Bích Duyên",
      shortName: "Duyên",
      rank: "Trưởng Nữ",
      image: "image/avatar-bride.jpg",
      father: "Phêrô Nguyễn Tri Quân",
      mother: "Phan Thị Mỹ",
      address: "Tổ 2, Khu Phố 3, Long Thủy, Phước Long, Đồng Nai",
      bio: "Cô gái dịu dàng, yêu thương mọi người xung quanh và luôn là điểm tựa bình yên cho anh."
    }
  },

  // Câu chuyện tình yêu
  story: {
    title: "Hành Trình Tình Yêu",
    subtitle: "Câu chuyện của chúng tôi",
    coverImage: "image/wedding-03.jpg",
    milestones: [
      {
        year: "2023",
        title: "Lần Đầu Gặp Gỡ",
        desc: "Định mệnh đã đưa chúng mình gặp nhau vào một ngày thu đẹp trời. Ánh mắt đầu tiên ấy đã trở thành khởi đầu cho một hành trình kỳ diệu."
      },
      {
        year: "2025",
        title: "Lời Tỏ Tình",
        desc: "Sau những ngày tháng cùng sẻ chia bao niềm vui nỗi buồn, cái nắm tay ngập ngừng dưới ánh hoàng hôn đã gắn kết hai trái tim thành một."
      },
      {
        year: "2026",
        title: "Lời Cầu Hôn",
        desc: "Khoảnh khắc chiếc nhẫn trao tay cùng lời hứa đồng hành trọn đời. Chúng mình đã sẵn sàng cho chương mới tuyệt vời nhất."
      }
    ]
  },

  // Địa điểm & Lịch trình tổ chức
  venues: [
    {
      id: "vu-quy",
      title: "Lễ Vu Quy",
      time: "09:00 - 10:30",
      date: "18.12.2026",
      icon: "🏠",
      image: "image/wedding-04.jpg",
      area: "Tư gia Nhà Gái",
      address: "Tổ 2, Khu Phố 3, Long Thủy, Phước Long, Đồng Nai",
      mapUrl: "https://maps.google.com/?q=Long+Th%E1%BB%A7y%2C+Ph%C6%B0%E1%BB%9Bc+Long%2C+%C4%90%E1%BB%93ng+Nai"
    },
    {
      id: "tiec-cuoi",
      title: "Tiệc Cưới",
      time: "11:00 - 14:00",
      date: "18.12.2026",
      icon: "💒",
      image: "image/wedding-05.jpg",
      area: "Trung Tâm Tiệc Cưới",
      address: "Phước Long, Đồng Nai",
      mapUrl: "https://maps.google.com/?q=Ph%C6%B0%E1%BB%9Bc+Long%2C+%C4%90%E1%BB%93ng+Nai"
    }
  ],

  // Quy định trang phục
  dressCode: {
    title: "Dress Code",
    description: "Khách mời vui lòng mặc trang phục theo tông màu để bức ảnh kỷ niệm thêm phần hài hòa.",
    colors: [
      { name: "Trắng", hex: "#ffffff", border: true },
      { name: "Xanh lá Sage", hex: "#77DD77" },
      { name: "Be nhạt", hex: "#f3e8dc" }
    ]
  },

  // Thư viện ảnh cưới theo danh mục
  gallery: {
    title: "Album Ảnh Cưới",
    subtitle: "Khoảnh khắc ngọt ngào",
    categories: [
      { id: "all", label: "Tất cả" },
      { id: "portrait", label: "Chân dung" },
      { id: "editorial", label: "Phóng sự cưới" },
      { id: "landscape", label: "Ngoại cảnh" },
      { id: "loveFlowey", label: "Cảm xúc" }
    ],
    items: [
      // 6 ảnh lưới đầu tiên xen kẽ Ngoài trời & Trong studio
      { src: "image/wedding-05.jpg", category: "landscape", caption: "Cùng nhìn về tương lai (Ngoài trời)" },
      { src: "image/wedding-10.jpg", category: "portrait", caption: "Nụ cười rạng rỡ (Trong studio)" },
      { src: "image/wedding-03.jpg", category: "landscape", caption: "Tình yêu thuần khiết (Ngoài trời)" },
      { src: "image/wedding-09.jpg", category: "portrait", caption: "Sánh bước bên nhau (Trong studio)" },
      { src: "image/wedding-01.jpg", category: "landscape", caption: "Nụ cười hạnh phúc (Ngoài trời)" },
      { src: "image/wedding-14.jpg", category: "portrait", caption: "Trọn vẹn yêu thương (Trong studio)" },

      // Các ảnh tiếp theo trong album
      { src: "image/wedding-02.jpg", category: "landscape", caption: "Ánh mắt trao nhau" },
      { src: "image/wedding-04.jpg", category: "landscape", caption: "Bên nhau bình yên" },
      { src: "image/wedding-06.jpg", category: "landscape", caption: "Khoảnh khắc hạnh phúc" },
      { src: "image/wedding-07.jpg", category: "editorial", caption: "Câu chuyện lãng mạn" },
      { src: "image/wedding-08.jpg", category: "editorial", caption: "Phong cách thanh lịch" },
      { src: "image/wedding-11.jpg", category: "portrait", caption: "Hoàng hôn lãng mạn" },
      { src: "image/wedding-12.jpg", category: "portrait", caption: "Chặng đường chung bước" },
      { src: "image/wedding-13.jpg", category: "portrait", caption: "Ánh nắng ban mai" },
      { src: "image/wedding-15.jpg", category: "editorial", caption: "Cái ôm ấm áp" },
      { src: "image/wedding-16.jpg", category: "editorial", caption: "Mãi mãi bên nhau" }
    ]
  },

  // Video cưới
  video: {
    title: "Video Cưới",
    subtitle: "Thước phim kỷ niệm",
    url: "https://www.youtube-nocookie.com/embed/q0b5UrP-YuE?enablejsapi=1",
    desc: "Chúng tôi muốn gửi đến các bạn những lời yêu thương và cảm ơn chân thành nhất. Xin hãy cùng xem video này để hiểu thêm về hành trình tình yêu của chúng tôi."
  },

  // Danh sách bài hát cưới
  playlist: [
    {
      title: "Lễ đường",
      artist: "Hồ Phi Nal",
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
    }
  ],

  // Tài khoản mừng cưới
  bankAccounts: {
    bride: {
      role: "Cô Dâu",
      name: "NGUYEN THI BICH DUYEN",
      bankName: "VPBank (Ngân hàng TMCP Việt Nam Thịnh Vượng)",
      accountNumber: "0869256093",
      qr: "image/qr-bichduyen.jpg",
      avatar: "image/avatar-bride.jpg"
    }
  },

  // Ảnh nền các khu vực
  assets: {
    envelopeImage: "image/wedding-05.jpg",
    heroImage: "image/wedding-05.jpg",
    countdownImage: "image/countdown-bg.jpg",
    wishesCover: "image/wedding-07.jpg",
    thankYouImage: "image/wedding-14.jpg"
  },

  // Lời chúc mẫu ban đầu
  initialWishes: [
    {
      id: 1,
      name: "Minh Hiếu",
      relation: "Bạn thân",
      side: "Cả hai",
      message: "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long, sớm sinh quý tử nhé! Rất háo hức chờ đến ngày cưới!",
      time: "20:15 - 23/08/2026",
      likes: 12
    },
    {
      id: 2,
      name: "Thanh Trúc",
      relation: "Bạn cô dâu",
      side: "Cô dâu",
      message: "Chúc mừng cô dâu xinh đẹp nhất trần đời! Chúc hai vợ chồng luôn ngọt ngào và hạnh phúc như ngày đầu tiên!",
      time: "18:30 - 23/08/2026",
      likes: 8
    },
    {
      id: 3,
      name: "Tuấn Anh",
      relation: "Đồng nghiệp chú rể",
      side: "Chú rể",
      message: "Chúc mừng người anh em đã tìm được một nửa hoàn hảo. Chúc hai bạn một đời an yên và thịnh vượng!",
      time: "15:45 - 23/08/2026",
      likes: 15
    }
  ]
};

// Gán toàn cục vào window để các module luôn truy cập được
window.WEDDING_DATA = WEDDING_DATA;
