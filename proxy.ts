import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  const claims = data?.claims ?? null;

  const pathname = request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !claims) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};