import { cookies } from "next/headers";

// The backend sets `accessToken` / `refreshToken` as httpOnly cookies and has no
// logout endpoint. Because the browser reaches the backend through this app's
// /api rewrite, those cookies belong to this origin and can be cleared here.
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return Response.json({ success: true, message: "Logged out" });
}
