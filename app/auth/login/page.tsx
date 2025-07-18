'use client';
import { useState } from 'react';

import { useAppDispatch } from '@/src/store/hooks';
import { login } from '@/src/store/slice/auth/authThunks';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { fetchUserInfo } from '@/src/store/slice/auth/userThunks';
import { ROUTES } from '@/src/types/routes';

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
};

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const dispatch = useAppDispatch();
    const { loading } = useAuth();
    const [errors, setErrors] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const resultAction = await dispatch(login({ email, password }));
            dispatch(fetchUserInfo());
            if (login.fulfilled.match(resultAction)) {
                // Handle successful login
                router.push(ROUTES.USER.DASHBOARD);
            } else if (login.rejected.match(resultAction)) {
                // Handle errors and validate the error message
                console.error('Login failed:', resultAction.payload || resultAction.error);
                setErrors('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrors('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex w-full h-screen">
                <div
                    className="flex flex-col w-1/2 bg-cover bg-center rounded-tr-[24px] mt-14"
                    style={{
                        backgroundImage: "url('/bg-condo.jpg')",
                    }}
                />
                <div className="flex flex-col w-1/2 p-[48px_80px] items-center justify-center gap-10">
                    <div className="flex flex-col items-center gap-2 p-[16px_0px]">
                        <h2 className="text-3xl font-semibold text-slate-700">Sign in</h2>
                        <p className="text-slate-700">Enter your details to sign in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-1">
                                <div className="gap-4 flex flex-col">
                                    <div className="gap-1 flex flex-col">
                                        <label
                                            htmlFor="email"
                                            className="block text-slate-700 w-1/2 text-xs font-medium"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                            className="w-full p-2 border rounded-md placeholder-slate-300"
                                            required
                                        />
                                    </div>

                                    <div className="gap-1 flex flex-col">
                                        <label htmlFor="password" className="block text-slate-700 text-xs font-medium">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="w-full p-2 border rounded-md  placeholder-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div
                                    className="text-right text-sm text-gray-500 cursor-pointer"
                                    onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
                                >
                                    Forgot password?
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className={`w-full bg-blue-900 hover:bg-blue-700 text-white p-3.5 rounded-lg ${
                                        loading ? 'opacity-70 pointer-events-none relative' : ''
                                    }`}
                                    onClick={() => handleLogin()}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <span className="opacity-0">Sign in</span>
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>

                                <p className="text-center text-slate-700">
                                    Don’t have an account?{' '}
                                    <span
                                        className="text-slate-700 font-bold cursor-pointer"
                                        onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                                    >
                                        Sign Up
                                    </span>
                                </p>
                            </div>
                        </div>
                    </form>
                    {errors && (
                        <div className="mb-4 text-red-500 text-center text-xs">
                            <p>{errors}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
