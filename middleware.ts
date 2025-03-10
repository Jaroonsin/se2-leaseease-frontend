import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    //   Retrieve the 'token' cookie. Note: For Next.js 13+ the cookie value is accessed via .get('name')?.value.
    const token = req.cookies.get('auth_token')?.value;
    const { pathname } = req.nextUrl;

    // Redirect a logged-in user (with token) away from the login page to the homepage.
    if (pathname === '/login' && token) {
        const url = req.nextUrl.clone();
        url.pathname = '/property';
        return NextResponse.redirect(url);
    }

    // For protected routes, if no token is present, redirect the user to the login page.
    // You can define an array of protected routes as needed.
    const protectedRoutes = ['/dashboard', '/profile', '/property', '/lessee_center']; // Add other protected paths as required.
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // // Otherwise, allow the request to continue.
    return NextResponse.next();
}

// Configure the middleware to apply only on specific routes.
// Adjust the matcher paths to cover your protected routes and the login route.
export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/property/:path*', '/lessee_center/:path*'],
};
