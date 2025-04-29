import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./utils/token.utils";

export async function middleware(req: NextRequest) {
  const token = getToken();

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  //localStorage.setItem('token', token)

  return NextResponse.next();
}

// Указываем, к каким путям применять middleware
export const config = {
  matcher: [
    "/Dashboard/:path*", // все пути, начинающиеся с /dashboard
  ],
};
