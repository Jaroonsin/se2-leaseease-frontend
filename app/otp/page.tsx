'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { requestOTP, verifyOTP } from '@/store/auth/authThunks';
import LoadPage from '@/components/ui/loadpage';

export default function Page() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [inputError, setInputError] = useState<boolean>(false);

    const handleVerifyOTP = async () => {
        try {
            const response = await dispatch(verifyOTP(inputRefs.current.map((input) => input.value).join(''))).unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Verification failed:', error);
            setInputError(true);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('text');
        if (paste.length === 6 && /^\d+$/.test(paste)) {
            paste.split('').forEach((char, index) => {
                if (inputRefs.current[index]) {
                    inputRefs.current[index].value = char;
                }
            });
        }
        e.preventDefault();
    };

    const handleResendOTP = async () => {
        try {
            await dispatch(requestOTP());
        } catch (error) {
            console.error('Resend OTP failed:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !inputRefs.current[index]?.value) {
            inputRefs.current[index - 1].focus();
        }
    };

    return loading ? (
        <LoadPage />
    ) : (
        <div className="flex w-[100vw] h-[100vh] justify-center items-center rounded-md bg-slate-200">
            <div className="flex flex-col justify-center items-center gap-10 p-12 px-16 rounded-xl bg-white">
                <div className="flex flex-col justify-center items-center gap-2 p-4 px-0 self-stretch">
                    <p className="text-slate-700 text-3xl font-semibold leading-[2.25rem]">Enter Your OTP</p>
                    <p className="text-slate-700 text-base font-normal leading-6">OTP already sent to your email!</p>
                </div>
                <div className="flex justify-center items-start gap-4 self-stretch">
                    {[...Array(6)].map((_, index) => (
                        <input
                            key={index}
                            maxLength={1}
                            pattern="[0-9]"
                            className={`flex flex-col justify-center items-center w-16 h-20 gap-[0.625rem] rounded bg-slate-100 text-center text-black text-4xl font-normal outline-none leading-[2.5rem] ${
                                inputError ? 'border border-red-500' : ''
                            }`}
                            ref={(el) => {
                                inputRefs.current[index] = el!;
                            }}
                            onPaste={index === 0 ? handlePaste : undefined}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className="flex flex-col items-center gap-3 self-stretch">
                    <button
                        className="flex h-[3.25rem] p-[0.875rem] justify-center items-center gap-[0.625rem] self-stretch rounded-lg bg-blue-900"
                        onClick={handleVerifyOTP}
                    >
                        <p className="text-white text-base font-normal leading-6">Verify OTP</p>
                    </button>
                    <div className="flex flex-col justify-center items-center gap-[0.625rem] self-stretch px-5">
                        <div className="flex items-center gap-[0.625rem]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="w-5 h-5"
                            >
                                <path
                                    d="M2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C12.0967 2.50789 14.1092 3.32602 15.6167 4.78333L17.5 6.66667M17.5 6.66667V2.5M17.5 6.66667H13.3333M17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5C7.90329 17.4921 5.89081 16.674 4.38333 15.2167L2.5 13.3333M2.5 13.3333H6.66667M2.5 13.3333V17.5"
                                    stroke="#253B80"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <button>
                                <p className="text-slate-700 text-base font-normal leading-6" onClick={handleResendOTP}>
                                    Resend OTP
                                </p>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-[0.625rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" fill="none" className="w-5 h-5">
                            <path
                                d="M10.5003 15.8332L4.66699 9.99984M4.66699 9.99984L10.5003 4.1665M4.66699 9.99984H16.3337"
                                stroke="#253B80"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <button onClick={() => router.push('/login')}>
                            <p className="text-slate-700 text-base font-normal leading-6">Back to Login</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
