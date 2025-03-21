import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/store/auth/userThunks';

export function useAuth() {
    const router = useRouter();
    const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [authCheckComplete, setAuthCheckComplete] = useState(false);

    // Check authentication status once on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentPath = window.location.pathname;
                if (!isAuthenticated && !currentPath.includes('/login')) {
                    await dispatch(fetchUserInfo());
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
            } finally {
                setAuthCheckComplete(true);
            }
        };

        checkAuth();
    }, [dispatch, isAuthenticated]);

    // Role-based access control and redirect when authenticated
    useEffect(() => {
        // Only proceed if authenticated and auth check is complete
        if (isAuthenticated && authCheckComplete && !loading) {
            // Current path
            const currentPath = window.location.pathname;

            // Redirect based on role
            if (user?.role === 'lessor') {
                // Redirect to property if on login page or in lessee area
                if (currentPath === '/login' || currentPath.includes('/lessee_center')) {
                    router.replace('/property');
                }
            } else if (user?.role === 'lessee') {
                // Redirect to lessee center if on login page or in property area
                if (currentPath === '/login' || currentPath.includes('/property')) {
                    router.replace('/lessee_center');
                }
            }
        }
    }, [isAuthenticated, authCheckComplete, loading, router, user?.role]);

    // Handle redirection after authentication check completes
    useEffect(() => {
        if (authCheckComplete && !loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [authCheckComplete, isAuthenticated, loading, router]);

    return { user, loading, isAuthenticated };
}
