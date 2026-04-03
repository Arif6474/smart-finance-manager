import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protected paths
    const protectedPaths = ['/dashboard', '/accounts', '/transactions', '/payables', '/reports'];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    // Auth paths (login/register)
    const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/signup');

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/accounts/:path*',
        '/transactions/:path*',
        '/payables/:path*',
        '/reports/:path*',
        '/login',
        '/signup',
    ],
};
