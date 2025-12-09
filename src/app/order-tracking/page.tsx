'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function OrderTrackingPage() {
  const [activeTab, setActiveTab] = useState('order-number');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrack = () => {
    // 这里可以添加实际的追踪逻辑
    console.log('Tracking:', { orderNumber, email, trackingNumber });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#543313] text-center mb-12">
            Track Your Order
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex border-b-2 border-[#543313]">
              <button
                onClick={() => setActiveTab('order-number')}
                className={`px-8 py-3 font-semibold transition-colors ${
                  activeTab === 'order-number'
                    ? 'text-[#543313] border-b-2 border-[#543313] -mb-[2px]'
                    : 'text-[#543313]/60 hover:text-[#543313]'
                }`}
              >
                Order Number
              </button>
              <button
                onClick={() => setActiveTab('tracking-number')}
                className={`px-8 py-3 font-semibold transition-colors ${
                  activeTab === 'tracking-number'
                    ? 'text-[#543313] border-b-2 border-[#543313] -mb-[2px]'
                    : 'text-[#543313]/60 hover:text-[#543313]'
                }`}
              >
                Tracking Number
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#e8e0ca]">
            {activeTab === 'order-number' ? (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Order Number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg border-2 border-[#543313] bg-[#e8e0ca] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg border-2 border-[#543313] bg-[#e8e0ca] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg border-2 border-[#543313] bg-[#e8e0ca] text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                />
              </div>
            )}

            <button
              onClick={handleTrack}
              className="w-full mt-8 bg-[#d41872] hover:bg-[#b01560] text-white py-4 rounded-lg font-bold text-lg transition-colors uppercase tracking-wide"
            >
              TRACK
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
