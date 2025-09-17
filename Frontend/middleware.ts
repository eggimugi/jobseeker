import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect dari root ke dashboard berdasarkan token yang ada
  if (pathname === '/dashboard') {
    const token = request.cookies.get('jobseeker_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Dalam implementasi real, Anda bisa decode JWT untuk mendapatkan role
    // Untuk sementara, ini akan redirect ke society dashboard
    return NextResponse.redirect(new URL('/society/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/hrd/:path*', '/society/:path*'],
};

