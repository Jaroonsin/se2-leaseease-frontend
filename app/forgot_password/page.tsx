'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { forgotPassword } from '@/store/auth/authThunks';
import { useState } from 'react';

export default function Page() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleForgotPassword = async () => {
        try {
            await dispatch(forgotPassword({ email })).unwrap();
            setShowModal(true);
        } catch (error) {
            console.error('Forgot password failed:', error);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center rounded-md bg-[#E2E8F0]">
            <div className="flex w-[600px] p-12 px-16 flex-col justify-center items-center gap-10 flex-shrink-0 rounded-xl bg-white">
                <div className="flex flex-col justify-center items-center gap-2 self-stretch p-4 px-0">
                    <p className="text-[30px] font-semibold leading-[36px] text-[#334155]">Forgot Password</p>
                    <p className="text-base font-normal leading-6 text-[#334155]">Reset your password via email.</p>
                </div>

                <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-start gap-[10px] self-stretch">
                        <p className="text-xs font-medium leading-4 text-[#334155]">Email</p>
                    </div>
                    <div className="flex items-center gap-[10px] self-stretch p-2 rounded-md border border-[#E2E8F0]">
                        <input
                            placeholder="Enter your email"
                            className="text-base font-normal leading-6 text-[#334155] outline-none w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 self-stretch">
                    <button
                        className="flex h-[52px] p-4 justify-center items-center gap-[10px] self-stretch rounded-lg bg-[#1E3A8A] hover:bg-blue-700"
                        onClick={handleForgotPassword}
                    >
                        <p className="text-base font-normal leading-6 text-white">Send Email Verification</p>
                    </button>
                    <button className="flex px-[19px] justify-center items-center gap-[10px] bg-transparent border-none mx-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            className="w-5 h-5"
                        >
                            <path
                                d="M10.5003 15.8333L4.66699 9.99996M4.66699 9.99996L10.5003 4.16663M4.66699 9.99996H16.3337"
                                stroke="#253B80"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p
                            className="text-base font-normal leading-6 text-[#334155]"
                            onClick={() => router.push('/login')}
                        >
                            Back to Login
                        </p>
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex w-[40rem] p-6 flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-lg">
                        <div className="flex w-[32rem] flex items-center justify-center">
                            <div className="flex items-center gap-[0.625rem] self-stretch text-center">
                                <p className="text-[1.125rem] font-semibold text-[#1E293B]">
                                    A link to reset your password has been sent to your email.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center self-stretch mt-4">
                            <button
                                className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#E4E4E7] bg-white"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <div className="flex flex-col items-start gap-[0.625rem] pl-2 ml-2">
                                <button
                                    className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md bg-blue-900 text-white hover:bg-blue-700"
                                    onClick={() => router.push('/login')}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
