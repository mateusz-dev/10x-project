import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

export const onRequest = defineMiddleware(async ({ cookies, request, url, locals, redirect }, next) => {
  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return next();
  }

  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Set supabase client in locals
  locals.supabase = supabase;

  if (!user && !PUBLIC_PATHS.includes(url.pathname)) {
    return redirect("/login");
  }

  if (user) {
    locals.user = {
      id: user.id,
      email: user.email ?? null,
    };
  }

  const response = await next();
  return response;
});
