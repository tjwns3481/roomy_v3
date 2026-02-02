import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
}

/**
 * API 라우트에서 현재 인증된 사용자 정보를 가져옵니다.
 * Clerk 인증 → Supabase users 테이블 조회
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Clerk에서 사용자 정보 가져오기
  const user = await currentUser();
  if (!user) {
    return null;
  }

  // Supabase에서 사용자 조회 또는 생성
  const supabase = await createClient();

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id, clerk_id, email")
    .eq("clerk_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("User fetch error:", fetchError);
    return null;
  }

  if (existingUser) {
    return {
      id: existingUser.id,
      clerkId: existingUser.clerk_id,
      email: existingUser.email,
    };
  }

  // 새 사용자 생성
  const email = user.emailAddresses[0]?.emailAddress || "";
  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert({
      clerk_id: userId,
      email,
      name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : null,
      avatar_url: user.imageUrl || null,
    })
    .select("id, clerk_id, email")
    .single();

  if (createError) {
    console.error("User create error:", createError);
    return null;
  }

  return {
    id: newUser.id,
    clerkId: newUser.clerk_id,
    email: newUser.email,
  };
}

/**
 * 단순히 Clerk userId만 가져옵니다 (Supabase 조회 없이)
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
