import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Get the current pathname
  const pathname = request.nextUrl.pathname;

  // Add custom header with pathname
  response.headers.set('x-pathname', pathname);
  
  // For dashboard paths, ensure we set a cookie as a fallback mechanism
  if (pathname.startsWith('/dashboard')) {
    // Set a cookie that can be read client-side
    response.cookies.set('is-dashboard-path', 'true', { 
      maxAge: 60 * 5, // 5 minutes
      path: '/' 
    });
  } else {
    // Clear the cookie when not on dashboard
    response.cookies.set('is-dashboard-path', '', { 
      maxAge: 0,
      path: '/' 
    });
  }

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 