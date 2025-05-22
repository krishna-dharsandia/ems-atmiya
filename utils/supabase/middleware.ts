import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/', '/login', '/register', "/privacy-policy", "/terms-conditions", '/onboarding', "/auth/confirm"
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(publicPath + '/')
  );
}

export async function updateSession(request: NextRequest) {
  console.log("Pathname:", request.nextUrl.pathname);
  console.log("Is public route:", isPublicRoute(request.nextUrl.pathname));

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: DO NOT REMOVE auth.getUser()

  // Allow public routes without authentication
  if (isPublicRoute(request.nextUrl.pathname)) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login (except for public routes)
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Onboarding logic
  const onboardingComplete = user.user_metadata.onboarding_complete;
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');

  if (!onboardingComplete && !isOnboardingPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }
  if (onboardingComplete && isOnboardingPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  const role = user.user_metadata.role;
  const pathname = request.nextUrl.pathname;

  if (role === 'STUDENT' && !pathname.startsWith('/student')) {
    const url = request.nextUrl.clone();
    url.pathname = '/student';
    return NextResponse.redirect(url);
  }

  if (role === 'ADMIN' && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  if (role === 'MASTER' && !pathname.startsWith('/master')) {
    const url = request.nextUrl.clone();
    url.pathname = '/master';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
