'use client';

import { useAppDispatch } from '@/store/hooks';
import { resetPassword } from '@/store/authSlice';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [errors, setErrors] = useState<string>('');

    // Get search params only on the client side
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');

        if (emailParam && tokenParam) {
            setEmail(emailParam);
            setToken(tokenParam);
        }
    }, []);

    const validate = (): string => {
        let checkStrongPassword: string = '';

        if (!password) checkStrongPassword = 'Password is required';
        else if (password.length < 8) checkStrongPassword = 'Password is too short, Must be more than 8 characters';
        else if (!/[A-Z]/.test(password)) checkStrongPassword = 'Password required at least one uppercase letter';
        else if (!/[0-9]/.test(password)) checkStrongPassword = 'Password required digit';
        else if (password !== confirmPassword) checkStrongPassword = 'Passwords do not match';
        else if (email === '' || token === '') checkStrongPassword = 'Invalid email or token';
        else checkStrongPassword = '';
        return checkStrongPassword;
    };

    const handleResetPassword = async () => {
        const errors = validate();
        if (errors) {
            setErrors(errors);
            return;
        }
        try {
            await dispatch(resetPassword({ email, password, token })).unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Reset password failed:', error);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center rounded-md bg-[#E2E8F0]">
            <div className="flex w-[600px] p-12 px-16 flex-col justify-center items-center gap-10 flex-shrink-0 rounded-xl bg-white">
                <div className="flex flex-col justify-center items-center gap-2 self-stretch p-4 px-0">
                    <p className="text-[30px] font-semibold leading-[36px] text-[#334155]">Reset Your Password</p>
                    <p className="text-base font-normal leading-6 text-[#334155]">
                        Set a new password to access your account.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 self-stretch">
                    <div className="flex flex-col items-start gap-1 self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <p className="text-xs font-medium leading-4 text-[#334155]">New password</p>
                        </div>
                        <div
                            className={`flex items-center gap-[10px] self-stretch p-2 rounded-md border ${
                                errors ? 'border-red-500' : 'border-[#E2E8F0]'
                            }`}
                        >
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                className="text-base font-normal leading-6 text-[#334155] outline-none w-full"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors('');
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <p className="text-xs font-medium leading-4 text-[#334155]">Confirm new password</p>
                        </div>
                        <div
                            className={`flex items-center gap-[10px] self-stretch p-2 rounded-md border ${
                                errors ? 'border-red-500' : 'border-[#E2E8F0]'
                            }`}
                        >
                            <input
                                type="password"
                                placeholder="Confirm your new password"
                                className="text-base font-normal leading-6 text-[#334155] outline-none w-full"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors('');
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 self-stretch">
                    {errors && (
                        <div className="text-red-500">
                            <p>{errors}</p>
                        </div>
                    )}
                    <button
                        className="flex h-[52px] p-4 justify-center items-center gap-[10px] self-stretch rounded-lg bg-[#1E3A8A]"
                        onClick={handleResetPassword}
                    >
                        <p className="text-base font-normal leading-6 text-white">Reset Password</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
