'use client';
import { useRouter, usePathname } from 'next/navigation';
import '@/app/globals.css';
import { Dispatch, SetStateAction } from 'react';

type HeaderProps = {
    setReview: Dispatch<SetStateAction<boolean>>;
};
export default function Header({ setReview }: HeaderProps) {
    const Router = useRouter();

    return (
        <div className="flex w-full h-16 px-6 justify-between items-center border-b border-gray-300 bg-white shadow-md">
            {/* Logo & Page Indicator */}
            <div className="flex items-center gap-6">
                <p className="text-black font-bold text-2xl cursor-pointer" onClick={() => Router.push('/')}>
                    LEASEEASE
                </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
                <div className="text-slate-400 cursor-pointer" onClick={() => setReview(true)}>
                    Review
                </div>
                <div className="text-slate-400 cursor-pointer" onClick={() => setReview(false)}>
                    User
                </div>
            </div>
        </div>
    );
}
