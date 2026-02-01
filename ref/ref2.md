Roomy: AI 에이전트 실행 최적화형 심화 제품 요구사항 문서 (PRD)본 문서는 인공지능이 인간의 개입 없이도 시스템 설계, 데이터 스키마 구축, API 연동 및 UI 컴포넌트 생성을 완결할 수 있도록 설계된 **'실행형 명세서'**입니다.  단순 기능 나열을 넘어, AI의 인지 아키텍처가 논리적 이정표를 따라가도록 구성되었습니다. 1. 전략적 비전: Invisible Service & Anticipatory UIRoomy의 지향점은 '기술이 드러나지 않는 서비스'입니다. 게스트가 QR을 찍는 순간부터 퇴실까지, AI는 사용자의 의도를 선제적으로 파악하여 대응합니다.핵심 목표: 게스트의 'Wi-Fi 연결 시도'와 '숙소 매뉴얼 확인' 사이의 마찰력을 0으로 수렴시킴.AI의 역할: 단순 답변자가 아닌, 가이드 내의 정보를 기반으로 사용자의 위치와 상황(Context)에 맞는 UI를 동적으로 생성(GenUI)하는 제어 에이전트. 2. 데이터 아키텍처 및 관계형 명세 (Actionable Data Model)AI가 데이터베이스를 구축할 때 모호함을 느끼지 않도록 YAML 포맷으로 상세 관계를 정의합니다. YAMLdatabase_schema:
  tables:
    hosts:
      id: uuid (pk)
      email: string (unique)
      subscription_status: enum (STARTER, PRO, ENTERPRISE)
    accommodations:
      id: uuid (pk)
      host_id: uuid (fk hosts.id)
      name: string
      address: text
      wifi_ssid: string
      wifi_password: encrypted_string
    guides:
      id: uuid (pk)
      accommodation_id: uuid (fk accommodations.id)
      slug: string (unique, indexing for fast search)
      content_blocks: jsonb  # 계층 구조 보존을 위해 jsonb 사용
      vector_embeddings: vector(1536) # RAG 검색용 벡터 데이터 [5, 9]
    interactions:
      id: uuid (pk)
      guest_id: uuid (anonymous session)
      query: text
      ai_response: text
      feedback: boolean (helpful/not)

relationships:
  - host has_many accommodations
  - accommodation has_one guide
  - guide has_many interactions
3. 구현 단계별 상세 시퀀스 (Sequential Phases)AI 에이전트의 컨텍스트 윈도우 부하를 줄이기 위해 개발 공정을 6단계로 분할하여 실행하도록 지시합니다. Phase 1: 데이터 레이어 및 보안 설정Task: Supabase 기반의 DB 스키마 생성 및 RLS(Row Level Security) 정책 적용.Edge Case: 호스트가 삭제될 경우 연관된 가이드 및 이미지 에셋의 Cascading Delete 로직 구현. Phase 2: 블록 기반 가이드 빌더 (CMS)Task: Notion 스타일의 에디터 인터페이스 구현.Logic:TEXT 블록: 마크다운 렌더링 지원.WIFI 블록: SSID/PW 입력 시 QR 이미지 및 WIFI:S:;T:;P:;; 포맷의 인텐트 자동 생성. MAP 블록: 주소 입력 시 Google Maps 임베딩 API 연동.Phase 3: 게스트 뷰어 및 GenUI (Dynamic Rendering)Task: 게스트의 브라우저 언어 및 시간대에 따른 UI 최적화. Behavior: 밤 10시 이후 접속한 게스트에게는 '소음 주의(Quiet Hours)' 블록을 최상단에 배치하는 조건부 렌더링. Phase 4: RAG 시스템 및 AI 챗봇 엔진Task: LangChain을 활용한 가이드 기반 답변 로직 구축.Prompt Guardrail: "가이드 데이터에 없는 외부 정보(예: 주변 맛집 추천 등)는 호스트가 별도로 입력하지 않은 한 답변하지 말고 '호스트님께 문의해주세요'라고 정중히 거절할 것." Phase 5: QR 생성 및 인쇄용 에셋 엔진Task: 가이드 발행 시 인쇄용 PDF(A4, 포스트잇 사이즈) 자동 생성 모듈 개발.Phase 6: 관리자 대시보드 및 분석Task: 게스트 질문 로그 분석 및 '빈번한 질문(FAQ)' 자동 추천 기능.4. 예외 처리 명세 (Edge Cases & Error Handling)AI가 "행복한 경로(Happy Path)"만 설계하지 않도록 가드레일을 명시합니다. 네트워크 오류: 오프라인 환경에서도 가이드의 텍스트 정보를 확인할 수 있도록 서비스 워커(Service Worker)를 통한 PWA 캐싱 지원. Wi-Fi 연결 실패: 원터치 연결 실패 시, 비밀번호를 클립보드에 자동 복사하고 수동 연결 방법을 팝업으로 안내. AI 환각(Hallucination): RAG 검색 결과의 신뢰도 점수(Similarity Score)가 0.7 이하인 경우, 답변 대신 "정보를 찾을 수 없습니다" 메시지 출력 후 호스트 직접 연락처 노출. 5. 비기능 요구사항 (NFR) 및 성능 지표AI의 코드 품질을 평가하는 정량적 기준입니다. 응답성: 가이드 페이지의 LCP(Largest Contentful Paint)는 1.2초 이내여야 함. 정확도: AI 답변의 정답 유효성(Answer Relevancy) 점수 0.85 이상 유지(RAGAS 지표 기준). 가용성: 다음 공식을 통해 계산되는 가용성을 99.9% 이상 보장하도록 설계. $$Availability = \frac{MTBF}{MTBF + MTTR}$$6. AI 행동 강령 (Project Boundaries)에이전트가 코드 작성 시 반드시 준수해야 할 'Always/Ask/Never' 원칙입니다.구분지침 내용Always (✅)모든 API 엔드포인트에 대해 유효성 검사(Zod)를 수행하라. 커밋 전 반드시 유닛 테스트를 실행하라.Ask First (⚠️)새로운 외부 라이브러리 추가 시 보안 및 용량을 보고하고 승인을 받아라. DB 스키마 변경 시 마이그레이션 전략을 먼저 제시하라.Never (🚫)절대 클라이언트 사이드에 API Key를 노출하지 마라. 인라인 스타일을 사용하지 말고 반드시 Tailwind CSS 클래스로 작성하라. 향후 로드맵:MVP (1-4주): 핵심 빌더 및 QR 뷰어, Wi-Fi 원터치 기능.Beta (5-6주): 다국어 자동 번역 및 AI 챗봇 고도화.Launch (7주~): 호스트용 수익 통계 대시보드 및 엔터프라이즈 위탁 관리 기능.