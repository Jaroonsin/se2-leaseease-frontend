'use client';

import { useEffect, useState } from 'react';
import LesseeDashboard from './lessee/index';
import LessorDashboard from './lessor/index';
import AdminDashboard from './admin/index';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';
import { useAppDispatch } from '@/src/store/hooks';
import { initializeWebSocket } from '@/src/store/slice/chatSlice';

export default function DashboardPage() {
    const { user } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    // Initialize WebSocket connection when the component mounts
    useEffect(() => {
        dispatch(initializeWebSocket());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setRole(user.role); // Example: 'lessee', 'lessor', 'admin'
        }
    }, [user]);

    if (!role) return <LoadPage></LoadPage>;

    switch (role) {
        case 'lessee':
            return <LesseeDashboard />;
        case 'lessor':
            return <LessorDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return <p>Unauthorized</p>;
    }
}
