'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

// Define the shape of our dashboard data
interface DashboardData {
  referralLink: string;
  totalReferredUsers: number;
  convertedUsers: number;
  totalCreditsEarned: number;
  currentCreditBalance: number;
}

export default function DashboardPage() {
  const router = useRouter();


  const [isMounted, setIsMounted] = useState(false);

  // 1. Get user and logout function from Zustand

const user = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);
const logout = useAuthStore((state) => state.logout);


  // 2. State for our fetched data
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    setIsMounted(true);
  }, []); 

  // 3. Fetch data when the component loads
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard'); // Our protected route!
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data.');
        logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  
  }, [isMounted, token, router, logout]); 

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  // 5. Handle Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 6. The Actual UI
  return (
   <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Main Content*/}
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Welcome, {user?.email?.split("@")[0] || "User"}
          </h1>
          <p className="text-purple-200">
            You currently have <span className="font-semibold">{user?.credits ?? 0}</span> credits.
          </p>
        </div>

        {/* Referral Link Card */}
        <div className="p-6 mb-10 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10">
          <h2 className="mb-4 text-xl font-semibold text-purple-300">
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 bg-white/5 p-4 rounded-lg border border-white/10">
            <input
              type="text"
              readOnly
              value={data?.referralLink || ""}
              className="flex-1 w-full px-3 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
              placeholder="Your referral link..."
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(data?.referralLink || "")
              }
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:from-purple-700 hover:to-indigo-700 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <StatCard title="Total Referred Users" value={data?.totalReferredUsers} />
          <StatCard title="Converted Users" value={data?.convertedUsers} />
          <StatCard title="Total Credits Earned" value={data?.totalCreditsEarned} />
        </div>
      </main>
    </div>
  );
};

// Glassmorphic Stat Card
// @ts-nocheck
function StatCard({ title, value }) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-md hover:scale-[1.03] hover:shadow-purple-700/30 transition duration-300">
      <h3 className="text-sm font-medium text-purple-200 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">
        {value !== undefined ? value : "..."}
      </p>
    </div>
  );
}