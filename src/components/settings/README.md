# Settings Components

사용자 설정 페이지 관련 컴포넌트 모음

## 컴포넌트 목록

### SettingsSidebar
사이드바 네비게이션 컴포넌트

**Props:**
- `user: User` - 현재 사용자 정보
- `activeMenu: string` - 활성화된 메뉴 ID
- `onMenuChange: (menu: string) => void` - 메뉴 변경 핸들러
- `onLogout: () => void` - 로그아웃 핸들러

**Features:**
- 프로필 미리보기 (아바타, 이름, 이메일)
- 메뉴 네비게이션 (프로필, 연락처, 비밀번호, 요금제)
- 로그아웃 버튼

### ProfileForm
프로필 정보 수정 폼

**Props:**
- `user: User` - 현재 사용자 정보
- `onUpdate: (data: Partial<User>) => Promise<void>` - 프로필 업데이트 핸들러

**Features:**
- 프로필 사진 업로드 (미구현)
- 이름 수정
- 이메일 표시 (읽기 전용)
- 저장 버튼
- 로딩 상태 관리
- 에러 처리

### ContactForm
연락처 설정 폼

**Props:**
- `user: User` - 현재 사용자 정보
- `onUpdate: (data: Partial<User>) => Promise<void>` - 연락처 업데이트 핸들러

**Features:**
- 전화번호 입력
- Helper text (가이드 하단 표시 안내)
- 저장 버튼
- 로딩 상태 관리
- 에러 처리

### PlanCard
요금제 정보 카드

**Props:**
- `onUpgrade: () => void` - 업그레이드 버튼 핸들러

**Features:**
- 현재 요금제 표시
- 요금제 기능 리스트
- Pro 업그레이드 버튼

## 사용 예시

```tsx
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ContactForm } from "@/components/settings/ContactForm";
import { PlanCard } from "@/components/settings/PlanCard";

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [user, setUser] = useState<User>(currentUser);

  const handleUpdateProfile = async (data: Partial<User>) => {
    // API call
    await updateUserProfile(data);
    setUser({ ...user, ...data });
  };

  return (
    <div className="flex">
      <SettingsSidebar
        user={user}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

      <main>
        {activeMenu === "profile" && (
          <ProfileForm user={user} onUpdate={handleUpdateProfile} />
        )}

        {activeMenu === "contact" && (
          <ContactForm user={user} onUpdate={handleUpdateProfile} />
        )}

        {activeMenu === "plan" && (
          <PlanCard onUpgrade={handleUpgrade} />
        )}
      </main>
    </div>
  );
}
```

## TODO

- [ ] 프로필 사진 업로드 기능 구현
- [ ] 비밀번호 변경 기능 구현
- [ ] 실제 Supabase API 연동
- [ ] Toast 알림 시스템 추가
- [ ] 폼 유효성 검사 강화
- [ ] 전화번호 포맷팅 추가
