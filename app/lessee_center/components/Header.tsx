// finished

'use client';
import { useState, useEffect, useRef } from 'react';
import AccountOption from '@/app/property/components/AccountOption';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
export default function PropertyHeader() {
    const [isAccountOptionVisible, setIsAccountOptionVisible] = useState<boolean>(false);
    const accountOptionRef = useRef<HTMLDivElement>(null);
    const Router = useRouter();
    const { user } = useAuth();

    const toggleAccountOption = (): void => {
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

    return (
        <div className="flex w-full h-16 px-5 justify-between items-center border-b border-slate-300 bg-slate-50">
            <div className="flex items-center gap-7">
                <p className="text-black font-lexend text-2xl font-normal leading-[36px]">LEASEEASE</p>
                <p
                    className="text-black font-lexend text-base font-normal leading-[36px] cursor-pointer"
                    onClick={() => {
                        Router.push('/lessee_center');
                    }}
                >
                    Lessee center
                </p>
            </div>

            <div className="flex p-2.5 justify-center items-center gap-3">
                <div
                    className="font-medium cursor-pointer "
                    onClick={() => {
                        Router.push('/history');
                    }}
                >
                    History
                </div>
                <p className="text-slate-900 text-sm font-medium leading-5 p-4">{user?.name}</p>
                <div
                    className="w-[40px] h-[40px] rounded-full bg-cover bg-center cursor-pointer"
                    style={{
                        backgroundImage: `url(${user?.image_url})`,
                    }}
                    onClick={toggleAccountOption}
                ></div>
            </div>
            <AccountOption ref={accountOptionRef} isAccountOptionVisible={isAccountOptionVisible} />
        </div>
    );
}
