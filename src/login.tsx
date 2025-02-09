'use client';

import { useState } from 'react';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // Prevent default form submission
}

export default function SignIn({ setPage }: { setPage: (page: string) => void }) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('bg-condo.jpg')" }} />
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Sign in</h2>
          <p className="text-gray-500 text-center mb-6">Enter your details to sign in to your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded text-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded text-gray-700"
                required
              />
            </div>

            <div className="text-right text-sm text-blue-500 cursor-pointer">Forgot password?</div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Sign in</button>

            <p className="text-center text-gray-600">
              Don’t have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setPage('signup')}>Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
