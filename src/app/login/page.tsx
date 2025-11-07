'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function LoginPage() {
  // 1. Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Hooks
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // 3. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 4. Call the LOGIN endpoint
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // 5. Success!
      const { token, ...user } = response.data;
      login(token, user); // Save to Zustand
      router.push('/dashboard'); // Redirect

    } catch (err: any) {
      // 6. Handle Errors
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message); // e.g., "Invalid email or password"
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-purple-200 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border border-purple-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-purple-200 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-transparent border border-purple-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300"
            >
              Sign In
            </button>
          </div>

          {/* Register Link */}
          <p className="text-sm text-center text-purple-200 mt-4">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}