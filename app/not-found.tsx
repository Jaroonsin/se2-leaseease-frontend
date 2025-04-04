'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/types/routes';
import { useAuth } from '@/src/hooks/useAuth';

export default function NotFound() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(2000);
    const { user } = useAuth();
    const [path, setPath] = useState(ROUTES.AUTH.LOGIN);

    useEffect(() => {
        if (user) {
            setPath(ROUTES.USER.DASHBOARD);
        } else {
            setPath(ROUTES.AUTH.LOGIN);
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 10 ? prev - 10 : 0));
        }, 10);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            router.replace(path); // Redirect to login page
        }
    }, [timeLeft, router, path]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
            <h1 className="text-6xl font-bold text-gray-800 animate-pulse">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you are looking for does not exist or has been moved.</p>
            <p className="text-gray-500 mt-2">
                Redirecting to the homepage in{' '}
                <span className="font-semibold">{(timeLeft / 1000).toFixed(1)} seconds...</span>
            </p>
            <div className="mt-6">
                <button
                    onClick={() => router.replace(path)}
                    className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}
