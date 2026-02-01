import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 보호된 라우트 정의
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/editor(.*)",
  "/templates(.*)",
  "/settings(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 보호된 라우트 접근 시 인증 확인
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
