"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RazorpayCheckout() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    // MOCK RAZORPAY FLOW
    // 1. In a real app, you'd call your backend to create a Razorpay order/subscription
    // 2. You'd load the Razorpay script
    // 3. Open the modal
    
    console.log("Initializing Razorpay for:", user.email);

    // Simulate Network Delay
    setTimeout(() => {
      // Simulate Success Response from Razorpay
      const mockUpdatedUser = {
        ...user,
        subscriptionTier: 'PRO' as const
      };

      // Update local context and storage
      login(mockUpdatedUser, localStorage.getItem('authToken') || '');
      
      alert("Subscription Successful! You are now a PRO member.");
      router.push('/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <button 
      onClick={handleSubscription}
      disabled={loading}
      className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Initialize Pro Access"}
    </button>
  );
}
