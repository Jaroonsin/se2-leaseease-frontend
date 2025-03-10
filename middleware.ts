import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // // Retrieve the 'auth_token' cookie value.
    // const token = req.cookies.get('auth_token')?.value;
    // const { pathname } = req.nextUrl;

    // // Log token for debugging
    // console.log('auth token:', token);

    // // Redirect a logged-in user (with token) away from the login page to the homepage.
    // if (pathname === '/login' && token) {
    //     const url = req.nextUrl.clone();
    //     url.pathname = '/property'; // Redirect to the main page or dashboard if already logged in
    //     return NextResponse.redirect(url);
    // }

    // // Define protected routes where authentication is required.
    // const protectedRoutes = ['/dashboard', '/profile']; // Add other protected paths as required.

    // // For protected routes, if no token is present, redirect to the login page.
    // if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    //     const url = req.nextUrl.clone();
    //     url.pathname = '/login'; // Redirect to the login page if the user is not authenticated
    //     return NextResponse.redirect(url);
    // }

    // // Otherwise, continue with the request if no redirects are needed.
    return NextResponse.next();
}

// Configure the middleware to apply to specific routes.
export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/login'],
};
