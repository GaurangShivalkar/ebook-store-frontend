'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Shape of a product
interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // For success/error messages
  
  // Get auth state
  const token = useAuthStore((state) => state.token);

  // 1. Fetch products from our backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // This is the public endpoint we made
        const response = await api.get('/purchase/products');
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Runs once on component mount

  // 2. The "Buy" button handler
  const handlePurchase = async (productId: string) => {
    // Check if user is logged in
    if (!token) {
      setMessage('You must be logged in to purchase!');
      return;
    }

    setMessage('Processing purchase...');
    try {
      // This is the protected endpoint that contains all our logic
      const response = await api.post('/purchase', {
        productId: productId,
      });

      // 3. Success!
      setMessage(`Purchase successful! Your new credit balance is: ${response.data.credits}`);
      // Note: The Navbar won't update credits automatically yet.
      // A simple page refresh would fix it.
      // Or we'd need to update the user in the Zustand store. Let's keep it simple for now.

    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Purchase failed.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <h1 className="mb-10 text-4xl font-bold text-center text-purple-300 tracking-wide">
          Explore Our E-Books
        </h1>

        {/* Messages */}
        {message && (
          <div className="p-4 mb-8 text-purple-100 bg-purple-700/30 border border-purple-500/40 rounded-lg text-center backdrop-blur-md">
            {message}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10 hover:scale-[1.03] hover:shadow-purple-700/30 transition duration-300"
            >
              {/* Book Image (optional placeholder if none) */}
              <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center">
                <span className="text-5xl font-bold text-white/60">
                  📘
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-purple-300 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-300 mb-4">
                ${product.price.toFixed(2)}
              </p>

              {/* Dummy Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-yellow-400 ${
                      i < 4 ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-400">4.0/5</span>
              </div>

              <button
                onClick={() => handlePurchase(product._id)}
                className="w-full px-4 py-2 mt-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-md"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}