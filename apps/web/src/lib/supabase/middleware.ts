import { createServerClient } from "@supabase/ssr";
import type { Database } from "@texo/shared";
import type { UserRole } from "@texo/shared";
import { NextResponse, type NextRequest } from "next/server";

/** Refresca sesión y valida rutas protegidas en middleware. */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!user) {
      return redirectToLogin(request);
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = (profileData as { role: UserRole } | null)?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/sell")) {
    if (!user) {
      return redirectToLogin(request);
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = (profileData as { role: UserRole } | null)?.role;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/profile")) {
    if (!user) {
      return redirectToLogin(request);
    }
  }

  return supabaseResponse;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}
