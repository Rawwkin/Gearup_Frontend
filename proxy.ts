import { NextResponse, type NextRequest } from "next/server";

/**
 * Cheap first line of defence: send visitors without an auth cookie to /login.
 * Real authorisation (token validity, roles) is enforced by the backend, and the
 * dashboard layouts additionally guard by role once the user profile is loaded.
 */
export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (hasSession) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment-success"],
};
