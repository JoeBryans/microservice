import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const { pathname } = request.nextUrl;

    const publicRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
    ];

    const isPublicRoute = publicRoutes.includes(pathname);

    console.log("isPublic: ", isPublicRoute);
    

    // User is authenticated
    const isAuthenticated =  !!refreshToken;

    // Visiting public routes
    if (isPublicRoute) {
        if (isAuthenticated) {
            return NextResponse.redirect(
                new URL('/dashboard', request.url)
            );
        }
        return NextResponse.next();
    }

    // Visiting protected routes
    if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(
            new URL('/auth/login', request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
    ],
};
