import { Template } from "@/types";

export const templates: Template[] = [
  // ============================================
  // 1. 펜션 / 독채 (Short Term Rental 기반)
  // ============================================
  {
    id: "pension",
    name: "펜션 / 독채",
    category: "숙박시설",
    description: "바비큐, 도어락, 주변 관광지, 퇴실 체크리스트까지",
    thumbnail: "/templates/pension.jpg",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    is_popular: true,
    is_available: true,
    showStory: true,
    blocks: [
      // Welcome - 환영 메시지
      {
        id: "welcome-1",
        type: "text",
        order: 0,
        data: {
          title: "환영합니다",
          content: "저희 숙소를 선택해 주셔서 감사합니다.\n\n이 가이드에서 숙소 이용에 필요한 모든 정보를 확인하실 수 있습니다. 궁금한 점은 언제든 연락 주세요!",
        },
      },
      // WiFi
      {
        id: "wifi-1",
        type: "wifi",
        order: 1,
        data: {
          ssid: "",
          password: "",
          networkType: "WPA2",
          note: "객실 내 어디서든 연결 가능합니다",
        },
      },
      // 체크인/아웃 & 규칙
      {
        id: "rules-1",
        type: "rules",
        order: 2,
        data: {
          checkIn: "15:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "실내 금연입니다", icon: "smoke_free", category: "notice" as const },
            { id: "rule-2", text: "밤 10시 이후 정숙 부탁드립니다", icon: "volume_off", category: "notice" as const },
            { id: "rule-3", text: "바비큐는 지정된 장소에서만 가능합니다", icon: "outdoor_grill", category: "guide" as const },
            { id: "rule-4", text: "쓰레기는 분리수거 해주세요", icon: "delete", category: "guide" as const },
            { id: "rule-5", text: "반려동물은 사전 문의 부탁드립니다", icon: "pets", category: "notice" as const },
          ],
        },
      },
      // 시설 안내
      {
        id: "devices-1",
        type: "devices",
        order: 3,
        data: {
          title: "시설 이용 안내",
          items: [
            {
              name: "보일러",
              description: "거실 벽면 온도조절기에서 온도 설정 (24~26도 권장)",
              imageUrl: "",
            },
            {
              name: "에어컨",
              description: "리모컨 위치: 거실 테이블 위",
              imageUrl: "",
            },
            {
              name: "TV",
              description: "넷플릭스, 유튜브 이용 가능 (홈 버튼 → 앱 선택)",
              imageUrl: "",
            },
            {
              name: "세탁기",
              description: "세제 구비되어 있음, 표준 코스 약 50분 소요",
              imageUrl: "",
            },
            {
              name: "바비큐 그릴",
              description: "숯 별도 구매 필요 (근처 마트 이용)",
              imageUrl: "",
            },
          ],
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 4,
        data: {
          name: "호스트",
          phone: "",
          kakaoId: "",
        },
      },
      // 주변 장소
      {
        id: "places-1",
        type: "places",
        order: 5,
        data: {
          items: [
            {
              name: "추천 맛집",
              category: "restaurant" as const,
              address: "",
              isHostPick: true,
            },
            {
              name: "근처 편의점",
              category: "etc" as const,
              address: "도보 5분",
              isHostPick: false,
            },
            {
              name: "근처 마트",
              category: "etc" as const,
              address: "차량 5분",
              isHostPick: false,
            },
          ],
        },
      },
      // 지도
      {
        id: "map-1",
        type: "map",
        order: 6,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
          address: "",
        },
      },
      // 퇴실 안내
      {
        id: "checkout-1",
        type: "text",
        order: 7,
        data: {
          title: "퇴실 안내",
          content: "퇴실 전 확인해주세요:\n\n• 에어컨/보일러 전원 OFF\n• 모든 창문 닫기\n• 사용한 식기 설거지\n• 쓰레기 분리수거\n• 현관문 잠금 확인\n\n편안한 여행 되셨길 바랍니다!",
        },
      },
    ],
  },

  // ============================================
  // 2. 에어비앤비 / 원룸 (Short Term Rental 기반)
  // ============================================
  {
    id: "airbnb",
    name: "에어비앤비",
    category: "숙박시설",
    description: "셀프 체크인, 도어락, 가전제품 사용법 안내",
    thumbnail: "/templates/airbnb.jpg",
    heroImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    is_popular: true,
    is_available: true,
    showStory: true,
    blocks: [
      // 셀프 체크인
      {
        id: "checkin-1",
        type: "text",
        order: 0,
        data: {
          title: "셀프 체크인 방법",
          content: "1. 건물 입구 도착\n2. 현관 도어락 비밀번호 입력\n3. 입실 후 편하게 이용해주세요\n\n도어락 비밀번호는 예약 확정 후 별도 안내드립니다.",
        },
      },
      // WiFi
      {
        id: "wifi-1",
        type: "wifi",
        order: 1,
        data: {
          ssid: "",
          password: "",
          networkType: "WPA2",
        },
      },
      // 규칙
      {
        id: "rules-1",
        type: "rules",
        order: 2,
        data: {
          checkIn: "16:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "파티 및 행사는 금지됩니다", icon: "cancel", category: "notice" as const },
            { id: "rule-2", text: "예약 인원만 숙박 가능합니다", icon: "group", category: "notice" as const },
            { id: "rule-3", text: "실내 전면 금연입니다", icon: "smoke_free", category: "notice" as const },
            { id: "rule-4", text: "22:00 이후 정숙 부탁드립니다", icon: "volume_off", category: "notice" as const },
            { id: "rule-5", text: "쓰레기는 분리수거 해주세요", icon: "delete", category: "guide" as const },
          ],
        },
      },
      // 시설 안내
      {
        id: "devices-1",
        type: "devices",
        order: 3,
        data: {
          title: "가전제품 사용법",
          items: [
            {
              name: "세탁기",
              description: "표준 세제 제공, 사용 후 문을 열어두세요",
              imageUrl: "",
            },
            {
              name: "에어컨/난방",
              description: "벽면 리모컨으로 조절",
              imageUrl: "",
            },
            {
              name: "인덕션",
              description: "전원 버튼 3초 누르기 → 화력 조절",
              imageUrl: "",
            },
            {
              name: "TV",
              description: "넷플릭스, 유튜브 이용 가능",
              imageUrl: "",
            },
          ],
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 4,
        data: {
          name: "호스트",
          phone: "",
          kakaoId: "",
        },
      },
      // 지도
      {
        id: "map-1",
        type: "map",
        order: 5,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
          address: "",
        },
      },
      // 주변 장소
      {
        id: "places-1",
        type: "places",
        order: 6,
        data: {
          items: [
            {
              name: "가까운 편의점",
              category: "etc" as const,
              address: "도보 3분",
              isHostPick: false,
            },
            {
              name: "지하철역",
              category: "etc" as const,
              address: "도보 5분",
              isHostPick: false,
            },
          ],
        },
      },
      // 퇴실
      {
        id: "checkout-1",
        type: "text",
        order: 7,
        data: {
          title: "퇴실 안내",
          content: "• 사용한 식기 설거지\n• 쓰레기 분리수거\n• 창문, 가스 확인\n• 현관문 자동 잠금 확인\n\n이용해주셔서 감사합니다!",
        },
      },
    ],
  },

  // ============================================
  // 3. 글램핑 / 캠핑장 (Glamping & Camping 기반)
  // ============================================
  {
    id: "glamping",
    name: "글램핑 / 캠핑",
    category: "숙박시설",
    description: "바베큐, 화로대, 안전 수칙, 자연 체험 안내",
    thumbnail: "/templates/glamping.jpg",
    heroImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    is_popular: true,
    is_available: true,
    showStory: true,
    blocks: [
      // 환영
      {
        id: "welcome-1",
        type: "text",
        order: 0,
        data: {
          title: "환영합니다",
          content: "자연 속에서의 특별한 하루를 준비했습니다.\n\n이 가이드에서 시설 이용 방법과 안전 수칙을 확인해주세요.",
        },
      },
      // WiFi
      {
        id: "wifi-1",
        type: "wifi",
        order: 1,
        data: {
          ssid: "",
          password: "",
          note: "관리동 근처에서 연결이 가장 잘 됩니다",
        },
      },
      // 규칙
      {
        id: "rules-1",
        type: "rules",
        order: 2,
        data: {
          checkIn: "15:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "밤 10시 이후 바베큐 종료", icon: "outdoor_grill", category: "notice" as const },
            { id: "rule-2", text: "밤 11시 화로대 종료", icon: "local_fire_department", category: "notice" as const },
            { id: "rule-3", text: "텐트 내 화기 사용 금지", icon: "warning", category: "notice" as const },
            { id: "rule-4", text: "쓰레기 분리수거", icon: "delete", category: "guide" as const },
            { id: "rule-5", text: "블루투스 스피커 22시까지", icon: "volume_off", category: "notice" as const },
          ],
        },
      },
      // 숙소 시설
      {
        id: "devices-1",
        type: "devices",
        order: 3,
        data: {
          title: "텐트/돔 내부 시설",
          items: [
            {
              name: "에어컨/히터",
              description: "리모컨 침대 옆 협탁 위",
              imageUrl: "",
            },
            {
              name: "콘센트",
              description: "침대 옆, 입구 옆 (최대 2,000W)",
              imageUrl: "",
            },
            {
              name: "조명",
              description: "메인등 + 무드등 (스위치 입구)",
              imageUrl: "",
            },
          ],
        },
      },
      // 바베큐/화로대
      {
        id: "bbq-1",
        type: "text",
        order: 4,
        data: {
          title: "바베큐 & 화로대",
          content: "🔥 바베큐 그릴\n• 숯 1봉 제공 (추가: 매점 5,000원)\n• 숯이 하얗게 변할 때까지 10~15분 대기\n• 사용 후 숯은 완전히 식힌 후 지정 장소에\n\n🪵 화로대 (불멍)\n• 장작 1다발 제공 (추가: 매점 10,000원)\n• 밤 11시까지 이용\n• 완전히 불 끄기 (물 뿌리기)",
        },
      },
      // 안전 수칙
      {
        id: "safety-1",
        type: "text",
        order: 5,
        data: {
          title: "안전 수칙",
          content: "🦟 벌레 대처\n• 모기향 텐트 입구 옆 비치\n• 저녁 시간대 긴 옷 착용 권장\n\n🌧️ 우천 시\n• 텐트 지퍼 완전히 닫기\n• 외부 물건 텐트 안으로\n• 강풍 시 관리동으로 대피\n\n🚨 긴급 연락처\n• 관리동: [연락처]\n• 경찰 112 / 소방 119",
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 6,
        data: {
          name: "관리동",
          phone: "",
        },
      },
      // 지도
      {
        id: "map-1",
        type: "map",
        order: 7,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 14,
          address: "",
        },
      },
      // 주변 자연
      {
        id: "nature-1",
        type: "text",
        order: 8,
        data: {
          title: "주변 즐길거리",
          content: "🌲 산책로\n• 숲속 산책로 (30분 코스)\n• 계곡 탐방로 (1시간 코스)\n\n🌌 별 보기\n• 밤 9시 이후 전망대에서\n• 별자리 앱 추천: Star Walk",
        },
      },
      // 퇴실
      {
        id: "checkout-1",
        type: "text",
        order: 9,
        data: {
          title: "퇴실 안내",
          content: "• 텐트 내부 정리\n• 바베큐/화로대 정리\n• 쓰레기 분리수거\n• 개인 물품 확인\n\n자연과 함께한 시간이 행복하셨길 바랍니다!",
        },
      },
    ],
  },

  // ============================================
  // 4. 호텔 / 리조트
  // ============================================
  {
    id: "hotel",
    name: "호텔",
    category: "숙박시설",
    description: "체크인/아웃, 룸서비스, 부대시설 안내",
    thumbnail: "/templates/hotel.jpg",
    heroImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    is_popular: false,
    is_available: true,
    showStory: true,
    blocks: [
      // 환영
      {
        id: "welcome-1",
        type: "text",
        order: 0,
        data: {
          title: "환영합니다",
          content: "저희 호텔을 선택해 주셔서 감사합니다.\n\n편안한 숙박을 위한 정보를 안내드립니다.",
        },
      },
      // WiFi
      {
        id: "wifi-1",
        type: "wifi",
        order: 1,
        data: {
          ssid: "",
          password: "",
          note: "객실 번호와 성함으로 로그인",
        },
      },
      // 규칙
      {
        id: "rules-1",
        type: "rules",
        order: 2,
        data: {
          checkIn: "15:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "객실 내 금연입니다", icon: "smoke_free", category: "notice" as const },
            { id: "rule-2", text: "반려동물 동반 불가", icon: "pets", category: "notice" as const },
            { id: "rule-3", text: "조용한 시간 22:00~07:00", icon: "schedule", category: "guide" as const },
          ],
        },
      },
      // 시설
      {
        id: "devices-1",
        type: "devices",
        order: 3,
        data: {
          title: "객실 시설",
          items: [
            {
              name: "에어컨",
              description: "벽면 패널에서 온도 조절",
              imageUrl: "",
            },
            {
              name: "TV",
              description: "객실 안내 채널에서 서비스 확인",
              imageUrl: "",
            },
            {
              name: "금고",
              description: "옷장 내부, 원하는 비밀번호 설정",
              imageUrl: "",
            },
            {
              name: "미니바",
              description: "이용 시 요금 자동 청구",
              imageUrl: "",
            },
          ],
        },
      },
      // 부대시설
      {
        id: "facilities-1",
        type: "text",
        order: 4,
        data: {
          title: "부대시설",
          content: "🏊 수영장: 06:00 - 22:00\n🏋️ 피트니스: 24시간\n🧖 사우나: 06:00 - 22:00\n🍽️ 레스토랑: 07:00 - 22:00\n\n이용 시 객실 카드키를 지참해주세요.",
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 5,
        data: {
          name: "프론트 데스크",
          phone: "",
        },
      },
      // 지도
      {
        id: "map-1",
        type: "map",
        order: 6,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
          address: "",
        },
      },
    ],
  },

  // ============================================
  // 5. 게스트하우스
  // ============================================
  {
    id: "guesthouse",
    name: "게스트하우스",
    category: "숙박시설",
    description: "공용 공간, 커뮤니티 규칙, 교통 정보",
    thumbnail: "/templates/guesthouse.jpg",
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    is_popular: false,
    is_available: true,
    showStory: false,
    blocks: [
      // 환영
      {
        id: "welcome-1",
        type: "text",
        order: 0,
        data: {
          title: "환영합니다",
          content: "게스트하우스에 오신 것을 환영합니다!\n\n다양한 여행자들과 함께하는 특별한 경험을 즐겨보세요.",
        },
      },
      // WiFi
      {
        id: "wifi-1",
        type: "wifi",
        order: 1,
        data: {
          ssid: "",
          password: "",
        },
      },
      // 규칙
      {
        id: "rules-1",
        type: "rules",
        order: 2,
        data: {
          checkIn: "14:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "공용 공간 정리정돈 부탁드립니다", icon: "cleaning_services", category: "guide" as const },
            { id: "rule-2", text: "냉장고 음식물은 이름 표기", icon: "kitchen", category: "guide" as const },
            { id: "rule-3", text: "조용한 시간 23:00~07:00", icon: "schedule", category: "notice" as const },
            { id: "rule-4", text: "귀중품 관리에 유의해주세요", icon: "lock", category: "notice" as const },
          ],
        },
      },
      // 시설
      {
        id: "devices-1",
        type: "devices",
        order: 3,
        data: {
          title: "공용 시설",
          items: [
            {
              name: "공용 주방",
              description: "조리 후 설거지 및 정리 필수",
              imageUrl: "",
            },
            {
              name: "세탁실",
              description: "세탁기 1회 2,000원",
              imageUrl: "",
            },
            {
              name: "공용 라운지",
              description: "24시간 이용 가능",
              imageUrl: "",
            },
          ],
        },
      },
      // 교통
      {
        id: "transport-1",
        type: "text",
        order: 4,
        data: {
          title: "교통 안내",
          content: "🚇 가까운 지하철역: 도보 5분\n🚌 공항버스 정류장: 도보 10분\n🚕 택시 호출: 카카오택시 이용 가능",
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 5,
        data: {
          name: "프론트",
          phone: "",
        },
      },
      // 지도
      {
        id: "map-1",
        type: "map",
        order: 6,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
          address: "",
        },
      },
    ],
  },

  // ============================================
  // 6. 웨딩/행사 (Wedding 기반) - 스몰웨딩용
  // ============================================
  {
    id: "wedding",
    name: "웨딩 / 행사",
    category: "행사",
    description: "일정, 장소, 축의금, 갤러리 안내",
    thumbnail: "/templates/wedding.jpg",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    is_popular: false,
    is_available: true,
    showStory: true,
    blocks: [
      // 청첩
      {
        id: "welcome-1",
        type: "text",
        order: 0,
        data: {
          title: "결혼합니다",
          content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n귀한 걸음 하시어 축복해 주시면\n더 없는 기쁨으로 간직하겠습니다.",
        },
      },
      // 일정
      {
        id: "schedule-1",
        type: "text",
        order: 1,
        data: {
          title: "일시 및 장소",
          content: "📅 일시\n2024년 00월 00일 토요일 오후 0시\n\n📍 장소\n[웨딩홀 이름]\n[주소]",
        },
      },
      // 식순
      {
        id: "timeline-1",
        type: "text",
        order: 2,
        data: {
          title: "식순",
          content: "• 13:30 - 하객 입장\n• 13:50 - 양가 어머니 촛불 점화\n• 14:00 - 신랑 입장\n• 14:05 - 신부 입장\n• 14:10 - 성혼 선언\n• 14:15 - 축가\n• 14:20 - 신랑신부 인사\n• 14:30 - 식사",
        },
      },
      // 오시는 길
      {
        id: "map-1",
        type: "map",
        order: 3,
        data: {
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
          address: "",
        },
      },
      // 교통/주차
      {
        id: "transport-1",
        type: "text",
        order: 4,
        data: {
          title: "오시는 길",
          content: "🚇 지하철\n[역명] 0번 출구 도보 0분\n\n🚌 셔틀버스\n[출발지] → [웨딩홀]\n출발 시간: 12:30 / 13:00 / 13:30\n\n🅿️ 주차\n지하 주차장 2시간 무료\n(안내데스크에서 도장)",
        },
      },
      // 축의금 (연락처 활용)
      {
        id: "account-1",
        type: "text",
        order: 5,
        data: {
          title: "마음 전하실 곳",
          content: "참석이 어려우신 분들을 위해\n계좌번호를 안내드립니다.\n\n💐 신랑측\n[은행] [계좌번호]\n예금주: [이름]\n\n💐 신부측\n[은행] [계좌번호]\n예금주: [이름]",
        },
      },
      // 갤러리
      {
        id: "gallery-1",
        type: "gallery",
        order: 6,
        data: {
          images: [],
          layout: "grid",
        },
      },
      // 연락처
      {
        id: "contact-1",
        type: "contact",
        order: 7,
        data: {
          name: "신랑",
          phone: "",
        },
      },
    ],
  },
];

// 빈 템플릿 (빈 페이지로 시작하기)
export const blankTemplate: Template = {
  id: "blank",
  name: "빈 페이지",
  category: "기타",
  description: "처음부터 직접 만들기",
  thumbnail: "",
  is_available: true,
  showStory: false,
  blocks: [],
};
