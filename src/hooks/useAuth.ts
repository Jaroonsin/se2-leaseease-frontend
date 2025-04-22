import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { fetchUserInfo } from '@/src/store/slice/auth/userThunks';
import { ROUTES } from '@/src/types/routes';

export function useAuth() {
    const router = useRouter();
    const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const [authCheckInitiated, setAuthCheckInitiated] = useState(false);
    const checkAuth = async () => {
        if (!isAuthenticated) {
            await dispatch(fetchUserInfo());
        }
        setAuthCheckInitiated(true);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!loading && authCheckInitiated) {
            // Ensure initial check has run
            if (pathname === ROUTES.AUTH.LOGIN) {
                if (isAuthenticated) {
                    router.push(ROUTES.USER.DASHBOARD);
                }
            } else {
                if (!isAuthenticated) {
                    router.push(ROUTES.AUTH.LOGIN);
                }
            }
        }
    }, [isAuthenticated, loading, pathname, authCheckInitiated]);

    return { user, loading, isAuthenticated };
}
