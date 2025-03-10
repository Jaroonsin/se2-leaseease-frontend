'use client';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MiddlePage from './components/MiddlePage';
import { useAuth } from '@/hooks/useAuth';

import LoadPage from '@/components/ui/loadpage';

export default function PropertyPage() {
    const { loading } = useAuth();

    return loading ? (
        <LoadPage />
    ) : (
        <div className="flex w-full h-full flex-col items-center rounded-[0.375rem] bg-slate-200">
            <Header />
            <div className="flex justify-center items-center flex-1 self-stretch">
                <Sidebar />
                {/* KNOTT */}
                <div className="flex p-[2rem] flex-col items-start gap-[0.625rem] flex-1 self-stretch bg-white">
                    <MiddlePage />
                </div>
                {/* KNOTT */}
            </div>
            {/* <Slider_Request /> */}
        </div>
    );
}
