'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import AccountOption from './AccountOption';
import { ROUTES } from '@/src/types/routes';
import { FaSearch, FaExchangeAlt, FaBuilding, FaEnvelope } from 'react-icons/fa';
import '@/app/globals.css';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

export default function PropertyHeader() {
    const [isAccountOptionVisible, setIsAccountOptionVisible] = useState(false);
    const accountOptionRef = useRef<HTMLDivElement>(null);
    const Router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const totalUnreadCount = useAppSelector((state) => state.chat.totalUnreadCount);

    const toggleAccountOption = () => {
        setIsAccountOptionVisible(!isAccountOptionVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountOptionRef.current && !accountOptionRef.current.contains(event.target as Node)) {
                setIsAccountOptionVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (route: string) => pathname.includes(route);

    return (
        <div className="flex w-full h-16 px-6 justify-between items-center border-b border-gray-300 bg-white shadow-md">
            {/* Logo & Page Indicator */}
            <div className="flex items-center gap-6">
                <p className="text-black font-bold text-2xl cursor-pointer" onClick={() => Router.push('/')}>
                    LEASEEASE
                </p>
                <span className="text-sm text-gray-700 font-medium bg-gray-200 px-4 py-1 rounded-md">
                    {user?.role === 'lessee' ? 'Lessee Center' : 'Lessor Center'}
                </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-6">
                {user?.role === 'lessee' && (
                    <>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                                isActive(ROUTES.TRANSACTIONS)
                                    ? 'bg-blue-500 hover:bg-blue-900 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                            disabled={isActive(ROUTES.TRANSACTIONS)}
                            onClick={() => Router.push(ROUTES.TRANSACTIONS)}
                        >
                            <FaExchangeAlt /> Transaction
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                                isActive(ROUTES.USER.DASHBOARD)
                                    ? 'bg-blue-500 hover:bg-blue-900 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                            disabled={isActive(ROUTES.USER.DASHBOARD)}
                            onClick={() => Router.push(ROUTES.USER.DASHBOARD)}
                        >
                            <FaSearch /> Search Property
                        </button>
                    </>
                )}
                {user?.role === 'lessor' && (
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                            isActive(ROUTES.USER.DASHBOARD)
                                ? 'bg-blue-500 hover:bg-blue-900 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        disabled={isActive(ROUTES.USER.DASHBOARD)}
                        onClick={() => Router.push(ROUTES.USER.DASHBOARD)}
                    >
                        <FaBuilding /> Manage Property
                    </button>
                )}
                {/* <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                        isActive(ROUTES.MESSAGES(''))
                            ? 'bg-blue-500 hover:bg-blue-900 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    disabled={isActive(ROUTES.MESSAGES(''))}
                    onClick={() => Router.push(ROUTES.MESSAGES(''))}
                >
                    <FaEnvelope /> Messages
                </button> */}
                <div className="relative inline-block">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                            isActive(ROUTES.MESSAGES(''))
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        disabled={isActive(ROUTES.MESSAGES(''))}
                        onClick={() => Router.push(ROUTES.MESSAGES(''))}
                    >
                        <FaEnvelope /> Messages
                    </button>

                    {totalUnreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                            {totalUnreadCount}
                        </div>
                    )}
                </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 font-medium">
                    {user?.name}
                </div>
                <div
                    className="w-10 h-10 rounded-full bg-cover bg-center cursor-pointer border border-gray-300"
                    style={{ backgroundImage: `url(${user?.image_url})` }}
                    onClick={toggleAccountOption}
                ></div>
            </div>

            <AccountOption ref={accountOptionRef} isAccountOptionVisible={isAccountOptionVisible} />
        </div>
    );
}
