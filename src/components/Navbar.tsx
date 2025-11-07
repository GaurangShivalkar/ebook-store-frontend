'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
const user = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);
const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
  <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home Link */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            E-Book Store
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-white/10 rounded-md transition"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-purple-300">
                  Credits: {user?.credits ?? 0}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-white/10 rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}