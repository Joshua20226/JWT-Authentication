import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
console.log('API_URL:', API_URL)
console.log('API_URL process:', process.env.NEXT_PUBLIC_API_URL)
axios.defaults.baseURL = API_URL;
async function verifyToken(accessToken: string, refreshToken: string) {
    try {
        const response = await axios.get('/api/auth/check_token', { 
            headers: {
                Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`
            }
         });
        if (response.status == 200) {
            console.log('okay2')
            return true;
        };
    } catch (err) {
        console.log('error', err);
    }
    return false;
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // console.log('Middleware - pathname:', path, request.nextUrl, request.url)
    const publicRoutes = ['/auth/login', '/auth/register', '/'];
    
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    console.log('middleware cookies: ', request.headers.get('cookie'));
    console.log('cookies: ', request.cookies)
    console.log('path: ', path)
    console.log('accessToken: ', accessToken)
    console.log('refreshToken: ', refreshToken)

    
    if (path == '/auth/login' || path == '/auth/register') {
        console.log('auth routes')
        if (!accessToken && !refreshToken) {
          const response = NextResponse.next();
          addSecurityHeaders(response);
          console.log('auth route no token continue')
          return response;
        }

        const verified = await verifyToken(accessToken || '', refreshToken || '');
        if (verified) {
          const response = NextResponse.redirect(new URL('/dashboard', request.url))
          addSecurityHeaders(response);
          console.log('auth route got token continue')
          return response;
        }

        const response = NextResponse.next();
        addSecurityHeaders(response);
        console.log('auth route continue')
        return response;
    }

    if (!publicRoutes.includes(path)) {
      console.log('path2: ',path);
      if (!accessToken || !refreshToken) {
          const response = NextResponse.redirect(new URL('/auth/login', request.url))
          addSecurityHeaders(response);
          return response;
        }

      const verified = await verifyToken(accessToken || '', refreshToken || '');
      if (!verified) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        addSecurityHeaders(response);
        return response;
      }

      const response = NextResponse.next();
      addSecurityHeaders(response);
      return response;
    }
    // redirect to login if not authorised
    // if (!publicRoutes.includes(path)) {
    //     console.log('middleware: public route', accessToken, refreshToken);

    //     if (!accessToken && !refreshToken) {
    //       const response = NextResponse.redirect(new URL('/auth/login', request.url))
    //       addSecurityHeaders(response);
    //       return response;
    //     }


    //     const verifyResponse = await verifyToken(accessToken || '', refreshToken || '');
    //     if (!verifyResponse) {
    //       const response = NextResponse.next();
    //       addSecurityHeaders(response);
    //       return response;
    //     }


    //     console.log('middleware: redirecting to login')
    //     // redirect to login
    //     const response = NextResponse.redirect(new URL('/auth/login', request.url))
    //     addSecurityHeaders(response);
    //     return response;
    // }

    // // e.g. login page
    // if (path === '/auth/login' || path === '/auth/register') {
    //     // Validate Access Token
    //     if ((accessToken || refreshToken) && await verifyToken(accessToken || '', refreshToken || '')){
    //       const response = NextResponse.redirect(new URL('/dashboard', request.url));
    //       addSecurityHeaders(response);
    //       return response;
    //     }

    //     // Try refresh next
    //     // if (refreshToken && await verifyToken()) {
    //     //   const response = NextResponse.redirect(new URL('/dashboard', request.url));
    //     //   addSecurityHeaders(response);
    //     //   return response;
    //     // }

    //     const response = NextResponse.next();
    //     addSecurityHeaders(response);
    //     return response;
    // }

    const response = NextResponse.next();
    addSecurityHeaders(response);
    console.log('passing through')
    return response;
    
}

function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    `connect-src 'self' ${API_URL}`,
    "frame-ancestors 'none'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // // Other security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
}

// middleware ignore requests to these resources
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}

