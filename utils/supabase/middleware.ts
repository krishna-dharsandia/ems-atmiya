import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getDashboardPath } from "../functions/getDashboardPath";

export const PUBLIC_ROUTES = [
  "/",
  "/events",
  "/register",
  "/onboarding",
  "/login",
  "/reset-password",
  "/update-password",
  "/privacy-policy",
  "/terms-conditions",
  "/auth/confirm",
  "/auth/callback",
  "/auth/webhook",
];

function isPublicRoute(pathname: string) {
  return pathname.startsWith("/api/") || PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  if (isPublicRoute(request.nextUrl.pathname)) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirectTo("/login", request);

  const onboardingComplete = user.user_metadata.onboarding_complete;
  const currentPath = request.nextUrl.pathname;
  const dashboardPath = getDashboardPath(user.user_metadata.role);

  if (!onboardingComplete && currentPath !== "/onboarding") {
    return redirectTo("/onboarding", request);
  }

  if (!currentPath.startsWith(dashboardPath)) {
    return redirectTo(dashboardPath, request);
  }

  return response;
}
