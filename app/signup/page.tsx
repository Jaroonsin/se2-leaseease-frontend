'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { register, requestOTP } from '@/store/auth/authThunks';

const SignUp = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState('lessee');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();

    interface Errors {
        name?: string;
        surname?: string;
        dob?: string;
        email?: string;
        password?: string;
        general?: string;
    }
    const [errors, setErrors] = useState<Errors>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here (e.g., API call)
        console.log({ name, surname, dob, email, password, accountType });
    };

    const handleRegister = async () => {
        const errors = validate();
        if (Object.values(errors).some((value) => value.trim() !== '')) {
            setErrors(errors);
            return;
        }
        try {
            await dispatch(
                register({
                    user: {
                        id: '0',
                        role: accountType,
                        name,
                        email,
                        address: 'peace home',
                        image_url: 'https://www.gravatar.com/avatar/',
                    },
                    password,
                })
            );
            await dispatch(requestOTP());
            router.push('/otp');
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed');
        }
    };

    const validate = () => {
        const error: { [key: string]: string } = {};

        if (!email) error.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) error.email = 'Email not valid';
        else error.email = '';

        if (!password) error.password = 'Password is required';
        else if (password.length < 8) error.password = 'Password is too short, Must be more than 8 characters';
        else if (!/[A-Z]/.test(password)) error.password = 'Password required at least one uppercase letter';
        else if (!/[0-9]/.test(password)) error.password = 'Password required digit';
        else error.password = '';

        if (!name) error.name = 'Name is required';
        else error.name = '';

        if (!surname) error.surname = 'Surname is required';
        else error.surname = '';

        if (!dob) error.dob = 'Date of birth is required';
        else error.dob = '';

        return error;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex w-full h-screen">
                <div className="flex flex-col w-1/2 p-[48px_80px] items-center justify-center gap-10">
                    <div className="flex flex-col items-center gap-2 p-[16px_0px]">
                        <h2 className="text-3xl font-semibold text-slate-700">Sign up account</h2>
                        <p className="text-slate-700">Enter your details to sign up your account</p>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-start gap-5">
                                <div className="w-1/2 gap-1 flex flex-col">
                                    <label htmlFor="name" className="block text-slate-700 text-xs font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full p-2 border rounded-md placeholder-slate-300"
                                        value={name}
                                        placeholder="Name"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <div className=" text-red-500 text-xs">
                                            <p>{errors.name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/2 gap-1 flex flex-col">
                                    <label htmlFor="surname" className="block text-slate-700 text-xs font-medium">
                                        Surname
                                    </label>
                                    <input
                                        type="text"
                                        id="surname"
                                        className="w-full p-2 border rounded-md placeholder-slate-300"
                                        value={surname}
                                        placeholder="Surname"
                                        onChange={(e) => setSurname(e.target.value)}
                                        required
                                    />
                                    {errors.surname && (
                                        <div className=" text-red-500 text-xs">
                                            <p>{errors.surname}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="dob" className="block text-slate-700 text-xs font-medium">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    className="w-full p-2 border rounded-md placeholder-slate-300"
                                    placeholder="Date of Birth"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    required
                                />
                                {errors.dob && (
                                    <div className=" text-red-500 text-xs">
                                        <p>{errors.dob}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="block text-slate-700 text-xs font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-2 border rounded-md placeholder-slate-300"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className=" text-red-500 text-xs">
                                        <p>{errors.email}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="block text-gray-700 text-xs font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full p-2 border rounded-md placeholder-slate-300"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className=" text-red-500 text-xs">
                                        <p>{errors.password}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="block text-slate-700 text-xs font-medium">
                                    Choose your account type
                                </label>
                                <div className="flex flex-start gap-5">
                                    <div
                                        className={`border rounded-lg  p-3 w-1/2 cursor-pointer flex flex-col justify-center items-start${
                                            accountType === 'lessee'
                                                ? ' border-blue-900 bg-indigo-100'
                                                : 'border-slate-200'
                                        }`}
                                        onClick={() => setAccountType('lessee')}
                                    >
                                        <label className="flex flex-col items-start gap-1.5 cursor-pointer">
                                            <div className="flex flex-col">
                                                <img src="/user.svg" alt="Lessee Icon" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-medium text-blue-950">Lessee</h2>
                                                <p className="text-slate-500 text-xs">Want to rent the property</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div
                                        className={`border rounded-lg p-3 w-1/2 cursor-pointer flex flex-col justify-center items-start${
                                            accountType === 'lessor'
                                                ? ' border-blue-900 bg-indigo-100'
                                                : 'border-slate-200'
                                        }`}
                                        onClick={() => setAccountType('lessor')}
                                    >
                                        <label className="flex flex-col gap-1.5 cursor-pointer">
                                            <div className="flex">
                                                <img src="/building.svg" alt="Lessor Icon" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-medium text-blue-950">Lessor</h2>
                                                <p className="text-slate-500 text-xs">Want to lease out the property</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {error && (
                        <div className="mb-4 text-black text-center text-2xl font-semibold bg-red-500 p-4 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="w-full flex flex-col gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-900 text-white p-3.5 rounded-lg"
                            onClick={() => handleRegister()}
                        >
                            Sign up
                        </button>

                        <p className="text-center text-slate-700">
                            Already have an account?{' '}
                            <span
                                className="text-slate-700 font-bold cursor-pointer"
                                onClick={() => router.push('/login')}
                            >
                                Sign In
                            </span>
                        </p>
                    </div>
                </div>
                <div
                    className="flex flex-col w-1/2 bg-cover bg-center rounded-tl-[24px] mt-14"
                    style={{ backgroundImage: "url('bg-2.png')" }}
                />
            </div>
        </div>
    );
};

export default SignUp;
