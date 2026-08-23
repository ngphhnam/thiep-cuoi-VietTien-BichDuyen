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
  weddingDate: "2026-10-26T09:00:00",
  displayDate: "26 . 10 . 2026",
  displayDateFull: "Thứ Hai, ngày 26 tháng 10 năm 2026",
  city: "Đà Nẵng, Việt Nam",

  // Thông tin cặp đôi
  couple: {
    title: "Đôi Nét Về Chúng Tôi",
    groom: {
      name: "Việt Tiến",
      shortName: "Tiến",
      rank: "Út nam",
      image: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/ec8c5b78-d10f-4727-9dd8-e9ffdabc430d.webp",
      father: "Nguyễn Văn A",
      mother: "Nguyễn Văn B",
      bio: "Một người luôn hướng về gia đình, đam mê công nghệ và dành trọn tình yêu thương cho người bạn đời."
    },
    bride: {
      name: "Bích Duyên",
      shortName: "Duyên",
      rank: "Trưởng nữ",
      image: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/11132995-0dc0-4c9c-bb67-1a08b431ad40.webp",
      father: "Nguyễn Văn A",
      mother: "Nguyễn Văn B",
      bio: "Cô gái dịu dàng, yêu thương mọi người xung quanh và luôn là điểm tựa bình yên cho anh."
    }
  },

  // Câu chuyện tình yêu
  story: {
    title: "Hành Trình Tình Yêu",
    subtitle: "Câu chuyện của chúng tôi",
    coverImage: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/1aa0e974-31f6-4df8-9c60-5fa1bb2528dc.webp",
    milestones: [
      {
        year: "2021",
        title: "Lần Đầu Gặp Gỡ",
        desc: "Định mệnh đã đưa chúng mình gặp nhau vào một ngày thu đẹp trời. Ánh mắt đầu tiên ấy đã trở thành khởi đầu cho một hành trình kỳ diệu."
      },
      {
        year: "2023",
        title: "Lời Tỏ Tình",
        desc: "Sau những ngày tháng cùng sẻ chia bao niềm vui nỗi buồn, cái nắm tay ngập ngừng dưới ánh hoàng hôn đã gắn kết hai trái tim thành một."
      },
      {
        year: "2025",
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
      date: "26.10.2026",
      icon: "🏠",
      image: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/2a6888e9-c7b6-4051-9906-6d92bb24845a.webp",
      area: "Nhà Gái - Quận Thanh Khê, Đà Nẵng",
      address: "Số 12, Đường Phan Đình Phùng, TP. Đà Nẵng",
      mapUrl: "https://maps.app.goo.gl/3LYqUiMHEDbiQ541A"
    },
    {
      id: "tiec-cuoi",
      title: "Tiệc Cưới",
      time: "11:00 - 14:00",
      date: "26.10.2026",
      icon: "💒",
      image: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/59cee9b8-26a7-4a11-8021-fafa15c07696.webp",
      area: "Trung Tâm Tiệc Cưới White Palace",
      address: "Trung Tâm Tiệc Cưới White Palace, TP. Đà Nẵng",
      mapUrl: "https://maps.app.goo.gl/3LYqUiMHEDbiQ541A"
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
      // Chân dung (Portrait)
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/6c92178d-89a4-4346-8206-14c54e377317.webp", category: "portrait", caption: "Nụ cười rạng rỡ" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/3d8aabaf-137f-413c-a4b3-1f5c04583b4d.webp", category: "portrait", caption: "Ánh mắt trao nhau" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/746c8e52-9032-4bb6-ab94-2b970b4f19ef.webp", category: "portrait", caption: "Tình yêu thuần khiết" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/7356871e-ead5-4dbf-85de-e16c0648b1bd.webp", category: "portrait", caption: "Bên nhau bình yên" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/c569a3ac-2578-4646-8a7b-948db137fb5e.webp", category: "portrait", caption: "Cùng nhìn về tương lai" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/89b05199-d844-4185-b46d-6f1e12dd1f8c.webp", category: "portrait", caption: "Khoảnh khắc hạnh phúc" },

      // Phóng sự cưới (Editorial)
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/a89a1ff3-91c3-40d8-8889-02b46d34d6f5.webp", category: "editorial", caption: "Câu chuyện lãng mạn" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/95af3d2a-3e20-4f85-b2a4-77f936d68e9f.webp", category: "editorial", caption: "Phong cách thanh lịch" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/87b528e2-314d-41d0-b602-166029eadcde.webp", category: "editorial", caption: "Nắm tay qua năm tháng" },

      // Ngoại cảnh (Landscape)
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/d10d2ba1-9a7c-470b-b3d0-e5f4afde3751.webp", category: "landscape", caption: "Giữa thiên nhiên rực rỡ" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/cd8e72a2-c4cd-4679-aa86-7681c955f9aa.webp", category: "landscape", caption: "Hoàng hôn lãng mạn" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/e6c8b06b-c5ac-4c79-848c-65e15752687c.webp", category: "landscape", caption: "Chặng đường chung bước" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/c9082def-53f1-41e6-b99d-10c5072da081.webp", category: "landscape", caption: "Biển xanh và em" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/4c949d23-d6c1-4be6-9759-ad02928d5733.webp", category: "landscape", caption: "Ánh nắng ban mai" },

      // Cảm xúc (Love Flowey)
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/d73ec6d3-6e5d-4891-aa50-37976abe5ea8.webp", category: "loveFlowey", caption: "Trao nhau lời thề ước" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/260f6b0d-32b8-4134-a166-0a0058c94998.webp", category: "loveFlowey", caption: "Cái ôm ấm áp" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/29fe23c3-1f83-4097-a733-f2fcdd8f79dd.webp", category: "loveFlowey", caption: "Chân thành và sâu lắng" },
      { src: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/075033e1-2cc0-4eb6-8062-ea2c50e83b89.webp", category: "loveFlowey", caption: "Mãi mãi bên nhau" }
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
    groom: {
      role: "Chú Rể",
      name: "NGUYEN VIET TIEN",
      bankName: "Vietcombank (VCB)",
      accountNumber: "1018999888",
      qr: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/bdb74793-d395-4802-977b-70ba0a02f935.webp",
      avatar: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/ec8c5b78-d10f-4727-9dd8-e9ffdabc430d.webp"
    },
    bride: {
      role: "Cô Dâu",
      name: "DO THI BICH DUYEN",
      bankName: "Vietcombank (VCB)",
      accountNumber: "1028777666",
      qr: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/e2864c9b-8f31-433d-bd5e-6c7a38161409.webp",
      avatar: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/11132995-0dc0-4c9c-bb67-1a08b431ad40.webp"
    }
  },

  // Ảnh nền các khu vực
  assets: {
    envelopeImage: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/envelop/Screenshot_2026-05-14_194831_mqb3b6.png",
    heroImage: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/3d8aabaf-137f-413c-a4b3-1f5c04583b4d.webp",
    countdownImage: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/c776dd26-133b-4431-81cc-71911bdb1912.webp",
    wishesCover: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/b75a1ccf-723f-44a4-a3b3-f09d061be285.webp",
    thankYouImage: "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/prod/vuong-ha/b43808d8-4642-4c87-9133-7e29991e0197.webp"
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
