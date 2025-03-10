import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/store/authSlice';

export function useAuth() {
    const router = useRouter();
    const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [hasFetched, setHasFetched] = useState(false); // Track if dispatch has finished

    useEffect(() => {
        const fetchAndCheckAuth = async () => {
            await dispatch(fetchUserInfo());
        };
        if (!isAuthenticated) fetchAndCheckAuth();
        setHasFetched(true);
    }, [dispatch]);

    useEffect(() => {
        if (hasFetched && !loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return { user, loading, isAuthenticated };
}
