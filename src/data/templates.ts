import { Template } from "@/types";

export const templates: Template[] = [
  {
    id: "hotel",
    name: "호텔",
    category: "숙박시설",
    description: "체크인/아웃 시간, 룸서비스, 부대시설 안내",
    thumbnail: "/templates/hotel.jpg",
    is_popular: true,
    is_available: true,
    blocks: [
      {
        id: "1",
        type: "wifi",
        order: 0,
        data: {
          ssid: "Hotel_WiFi",
          password: "",
          note: "체크인 시 안내 받은 비밀번호를 입력하세요",
        },
      },
      {
        id: "2",
        type: "rules",
        order: 1,
        data: {
          checkIn: "15:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "객실 내 금연입니다", icon: "no_smoking", category: "notice" as const },
            { id: "rule-2", text: "반려동물 동반은 불가합니다", icon: "pets", category: "notice" as const },
            { id: "rule-3", text: "조용한 시간은 22:00~07:00입니다", icon: "schedule", category: "guide" as const },
          ],
        },
      },
      {
        id: "3",
        type: "text",
        order: 2,
        data: {
          title: "부대시설 안내",
          content: "피트니스 센터, 수영장, 사우나, 레스토랑 이용 가능합니다.",
        },
      },
    ],
  },
  {
    id: "pension",
    name: "펜션",
    category: "숙박시설",
    description: "바비큐, 주변 관광지, 계절별 액티비티 안내",
    thumbnail: "/templates/pension.jpg",
    is_popular: true,
    is_available: true,
    blocks: [
      {
        id: "1",
        type: "wifi",
        order: 0,
        data: {
          ssid: "Pension_WiFi",
          password: "",
        },
      },
      {
        id: "2",
        type: "rules",
        order: 1,
        data: {
          checkIn: "15:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "바비큐는 지정된 장소에서만 가능합니다", icon: "restaurant", category: "guide" as const },
            { id: "rule-2", text: "쓰레기는 분리수거 해주세요", icon: "cleaning_services", category: "guide" as const },
            { id: "rule-3", text: "야간 소음에 주의해주세요", icon: "volume_off", category: "notice" as const },
          ],
        },
      },
      {
        id: "3",
        type: "devices",
        order: 2,
        data: {
          items: [
            {
              name: "바비큐 그릴",
              description: "숯은 별도 구매 필요",
            },
            {
              name: "취사도구",
              description: "주방에 기본 조리도구 구비",
            },
          ],
        },
      },
      {
        id: "4",
        type: "places",
        order: 3,
        data: {
          items: [
            {
              name: "근처 해수욕장",
              category: "attraction",
              address: "차량 10분 거리",
              isHostPick: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "airbnb",
    name: "에어비앤비",
    category: "숙박시설",
    description: "셀프 체크인, 하우스 룰, 가전제품 사용법",
    thumbnail: "/templates/airbnb.jpg",
    is_popular: true,
    is_available: true,
    blocks: [
      {
        id: "1",
        type: "text",
        order: 0,
        data: {
          title: "셀프 체크인 방법",
          content: "현관 도어락 비밀번호는 예약 확정 후 메시지로 전송됩니다.",
        },
      },
      {
        id: "2",
        type: "wifi",
        order: 1,
        data: {
          ssid: "MyPlace_5G",
          password: "",
        },
      },
      {
        id: "3",
        type: "rules",
        order: 2,
        data: {
          checkIn: "16:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "파티 및 행사는 금지됩니다", icon: "cancel", category: "notice" as const },
            { id: "rule-2", text: "최대 인원을 초과할 수 없습니다", icon: "warning", category: "notice" as const },
            { id: "rule-3", text: "쓰레기는 분리수거 해주세요", icon: "cleaning_services", category: "guide" as const },
          ],
        },
      },
      {
        id: "4",
        type: "devices",
        order: 3,
        data: {
          items: [
            {
              name: "세탁기",
              description: "표준 세제 제공, 사용 후 문을 열어두세요",
            },
            {
              name: "에어컨",
              description: "리모컨 위치: 거실 테이블",
            },
          ],
        },
      },
    ],
  },
  {
    id: "guesthouse",
    name: "게스트하우스",
    category: "숙박시설",
    description: "공용 공간, 커뮤니티 규칙, 교통 정보",
    thumbnail: "/templates/guesthouse.jpg",
    is_available: true,
    blocks: [
      {
        id: "1",
        type: "wifi",
        order: 0,
        data: {
          ssid: "Guesthouse_Free",
          password: "",
        },
      },
      {
        id: "2",
        type: "rules",
        order: 1,
        data: {
          checkIn: "14:00",
          checkOut: "11:00",
          items: [
            { id: "rule-1", text: "공용 공간은 정리정돈 해주세요", icon: "cleaning_services", category: "guide" as const },
            { id: "rule-2", text: "냉장고 음식물은 이름 표기 부탁드립니다", icon: "info", category: "guide" as const },
            { id: "rule-3", text: "조용한 시간: 23:00~07:00", icon: "schedule", category: "guide" as const },
          ],
        },
      },
      {
        id: "3",
        type: "text",
        order: 2,
        data: {
          title: "대중교통 안내",
          content: "가장 가까운 지하철역: 도보 5분\n공항버스 정류장: 도보 10분",
        },
      },
    ],
  },
  {
    id: "resort",
    name: "리조트",
    category: "숙박시설",
    description: "프로그램 안내, 부대시설, 예약 서비스",
    thumbnail: "/templates/resort.jpg",
    is_available: false,
    blocks: [],
  },
  {
    id: "camping",
    name: "캠핑장",
    category: "숙박시설",
    description: "캠핑 규칙, 안전 수칙, 편의시설 위치",
    thumbnail: "/templates/camping.jpg",
    is_available: false,
    blocks: [],
  },
];
