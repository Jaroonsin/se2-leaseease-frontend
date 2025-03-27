import { useEffect, useState } from 'react';
ROUTES.AUTH.LOGIN;
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/src/store/auth/userThunks';
import { ROUTES } from '@/src/types/routes';

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
                if (!isAuthenticated && !currentPath.includes(ROUTES.AUTH.LOGIN)) {
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
            router.replace(ROUTES.DASHBOARD);
        }
    }, [isAuthenticated, authCheckComplete, loading, router, user?.role]);

    // Handle redirection after authentication check completes
    useEffect(() => {
        if (authCheckComplete && !loading && !isAuthenticated) {
            router.replace(ROUTES.AUTH.LOGIN);
        }
    }, [authCheckComplete, isAuthenticated, loading, router]);

    return { user, loading, isAuthenticated };
}
