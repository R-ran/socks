'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Lock, Search, HelpCircle } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import dynamic from 'next/dynamic';

const PayPalButtonWrapper = dynamic(
  () => import('@/components/PayPalButtonWrapper'),
  { ssr: false }
);

// PayPal types
interface PayPalCreateOrderData {
  orderID?: string;
  [key: string]: unknown;
}

interface PayPalActions {
  order: {
    create: (orderData: { purchase_units: Array<{ amount: { currency_code: string; value: string } }> }) => Promise<string>;
    capture: () => Promise<PayPalOrderCaptureResponse>;
  };
}

interface PayPalOrderCaptureResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

// Initialize Stripe - will be loaded when component mounts
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getSubtotal, addFreeStickers, removeFreeStickers, hasFreeStickers, hasOtherItems, updateQuantity } = useCart();
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Germany');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [expressPayment, setExpressPayment] = useState<string | null>(null);

  // 从URL参数读取支付方式
  useEffect(() => {
    const paymentParam = searchParams?.get('payment');
    if (paymentParam === 'paypal') {
      setPaymentMethod('paypal');
      setExpressPayment('paypal');
    }
  }, [searchParams]);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberFirstName, setRememberFirstName] = useState('');
  const [rememberPhone, setRememberPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const totalSavings = 5.00; // Free stickers discount
  const total = subtotal;
  
  // Check if cart is empty
  const isCartEmpty = items.length === 0;

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          metadata: {
            items: JSON.stringify(items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            }))),
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  // Create payment intent when component mounts or total changes
  useEffect(() => {
    if (items.length > 0 && total > 0) {
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, total]);

  const handleStripePayment = async () => {
    if (!clientSecret) {
      setPaymentError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      // In a real implementation, you would use Stripe Elements here
      // For now, we'll simulate the payment flow
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split('_secret_')[0],
        }),
      });

      const result = await response.json();
      
      if (result.status === 'succeeded') {
        router.push(`/order-success?amount=${total}`);
      } else {
        setPaymentError('Payment failed. Please try again.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async (data: PayPalCreateOrderData, actions: PayPalActions) => {
    try {
      // 重新计算总价，确保使用最新的值
      const currentTotal = getSubtotal();
      
      // 验证金额是否有效
      if (!currentTotal || currentTotal <= 0) {
        const errorMsg = `Invalid order amount: ${currentTotal}. Please ensure your cart has items.`;
        console.error('PayPal order creation error:', errorMsg);
        setPaymentError(errorMsg);
        throw new Error(errorMsg);
      }

      // 验证购物车是否有商品
      if (!items || items.length === 0) {
        const errorMsg = 'Your cart is empty. Please add items before checkout.';
        console.error('PayPal order creation error:', errorMsg);
        setPaymentError(errorMsg);
        throw new Error(errorMsg);
      }

      const orderAmount = currentTotal.toFixed(2);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating PayPal order:', {
          amount: orderAmount,
          itemsCount: items.length,
          items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }))
        });
      }

      const order = await actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: orderAmount,
            },
          },
        ],
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('PayPal order created successfully:', order);
      }
      
      return order;
    } catch (error: unknown) {
      console.error('PayPal order creation failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create PayPal order. Please try again.';
      setPaymentError(errorMsg);
      throw error;
    }
  };

  const handlePayPalApprove = async (data: PayPalCreateOrderData, actions: PayPalActions): Promise<void> => {
    try {
      await actions.order.capture();
      router.push(`/order-success?amount=${total}&paymentMethod=paypal`);
    } catch (error: unknown) {
      setPaymentError('PayPal payment failed. Please try again.');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Section */}
      <div className="border-b-2 border-[#543313] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo1.png"
                  alt="animalsox"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>

              {/* Brand Name and Icons */}
              <div className="flex-1 text-center">
                
                <h1 className="text-2xl md:text-3xl font-bold text-[#543313]">Pawsox</h1>
                <p className="text-xs text-[#543313] mt-1">50,000+ HAPPY CUSTOMERS</p>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[#543313]">
                  <span>🚚 FAST Shipping</span>
                  <span>✅ 30-Day-Guarantee</span>
                  <span>🔒 Secure Checkout</span>
                </div>
              </div>

            {/* Right spacer for balance */}
            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-1">
              {/* Express Checkout */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#543313] mb-4">Express checkout</h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setExpressPayment('visa');
                      setPaymentMethod('credit-card');
                    }}
                    className={`border border-[#543313] text-white py-4 rounded-lg font-bold text-lg transition-colors ${
                      expressPayment === 'visa' 
                        ? 'bg-[#b9a8c4]' 
                        : 'bg-[#c9b8d4] hover:bg-[#b9a8c4]'
                    }`}
                  >
                    Visa
                  </button>
                  <button
                    onClick={() => {
                      setExpressPayment('paypal');
                      setPaymentMethod('paypal');
                    }}
                    className={`border border-[#543313] text-[#0070ba] py-4 rounded-lg font-bold text-lg transition-colors ${
                      expressPayment === 'paypal' 
                        ? 'bg-[#ffb800]' 
                        : 'bg-[#ffc439] hover:bg-[#ffb800]'
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    onClick={() => {
                      setExpressPayment('google');
                      setPaymentMethod('credit-card');
                    }}
                    className={`border border-[#543313] text-white py-4 rounded-lg font-bold text-lg transition-colors ${
                      expressPayment === 'google' 
                        ? 'bg-gray-700' 
                        : 'bg-black hover:bg-gray-800'
                    }`}
                  >
                    Google Pay
                  </button>
                </div>
                <div className="text-center my-4">
                  <span className="text-[#543313] font-semibold">OR</span>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#543313]">Contact</h2>
                  <Link href="#" className="text-[#543313] underline hover:text-[#d41872] transition-colors">
                    Sign in
                  </Link>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or mobile phone number"
                  className="w-full px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                />
              </div>

              {/* Delivery */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#543313] mb-4">Delivery</h2>
                <div className="space-y-4">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  >
                    <option value="Germany">Germany</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name (optional)"
                      className="px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#543313]" />
                  </div>

                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal code"
                      className="px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping method */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#543313] mb-4">Shipping method</h2>
                <input
                  type="text"
                  disabled
                  placeholder="Enter your shipping address to view available shipping methods."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Payment */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#543313] mb-2">Payment</h2>
                <p className="text-sm text-[#543313] mb-4">All transactions are secure and encrypted.</p>
                
                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setExpressPayment(null);
                      }}
                      className="mt-1 w-5 h-5"
                    />
                    <label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-[#543313] font-semibold">Credit card</span>
                        <div className="flex gap-2">
                          <span className="text-xs">VISA</span>
                          <span className="text-xs">Mastercard</span>
                          <span className="text-xs">Amex</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* PayPal Option */}
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="payment-paypal"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setExpressPayment('paypal');
                      }}
                      className="mt-1 w-5 h-5"
                    />
                    <label htmlFor="payment-paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-[#543313] font-semibold">PayPal</span>
                        <span className="text-xs text-[#0070ba]">PayPal</span>
                      </div>
                    </label>
                  </div>

                  {/* PayPal Info Box */}
                  {paymentMethod === 'paypal' && (
                    <div className="ml-8 space-y-4 pt-4">
                      <div 
                        onClick={() => {
                          // 滚动到 PayPal 按钮位置并触发点击
                          setTimeout(() => {
                            const paypalButton = document.querySelector('[data-paypal-button] button');
                            if (paypalButton) {
                              paypalButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              // 尝试触发 PayPal 按钮的点击
                              setTimeout(() => {
                                (paypalButton as HTMLElement).click();
                              }, 500);
                            }
                          }, 100);
                        }}
                        className="bg-gray-100 border-2 border-[#0070ba] rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/paypal.png"
                              alt="PayPal"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                            <span className="text-[#0070ba] font-bold text-lg">PayPal</span>
                          </div>
                          <svg className="w-6 h-6 text-[#0070ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-[#543313] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-[#543313]">
                            After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {paymentMethod === 'credit-card' && (
                    <div className="ml-8 space-y-4 pt-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card number"
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#543313]" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="Expiration date (MM / YY)"
                          className="px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                        />
                        <div className="relative">
                          <input
                            type="text"
                            value={securityCode}
                            onChange={(e) => setSecurityCode(e.target.value)}
                            placeholder="Security code"
                            className="w-full px-4 py-3 pr-10 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                          />
                          <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#543313]" />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="use-shipping"
                          checked={useShippingAsBilling}
                          onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="use-shipping" className="text-sm text-[#543313] cursor-pointer">
                          Use shipping address as billing address
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Remember me */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#543313] mb-4">Remember me</h2>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <label htmlFor="remember-me" className="flex-1 cursor-pointer">
                    <span className="text-[#543313]">Save my information for a faster checkout with a Shop account</span>
                    {rememberMe && (
                      <div className="mt-4 space-y-3 ml-6">
                        <input
                          type="text"
                          placeholder="First name"
                          value={rememberFirstName}
                          onChange={(e) => setRememberFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                        />
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Mobile phone number"
                            value={rememberPhone}
                            onChange={(e) => setRememberPhone(e.target.value)}
                            className="w-full px-4 py-3 pl-12 rounded-lg border border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#543313]">+49</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#543313]">
                          <Lock className="w-4 h-4" />
                          <span>Secure and encrypted</span>
                          <span className="ml-auto text-xs bg-[#c9b8d4] px-2 py-1 rounded text-white">shop</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="mb-8">
                {isCartEmpty && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    <p className="font-semibold mb-1">Cart is empty</p>
                    <p>Your cart is empty, cannot checkout. Please add items to your cart.</p>
                    <Link href="/" className="text-[#0070ba] underline mt-2 inline-block">
                      Return to home page to continue shopping
                    </Link>
                  </div>
                )}
                
                {paymentError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {paymentError}
                  </div>
                )}
                
                {(expressPayment === 'paypal' || paymentMethod === 'paypal') ? (
                  isCartEmpty ? (
                    <div className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-bold text-lg text-center cursor-not-allowed">
                      Cart is empty, cannot pay！
                    </div>
                  ) : (
                  <div data-paypal-button>
                    {(() => {
                      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
                      // 在开发环境中显示调试信息
                      if (process.env.NODE_ENV === 'development') {
                        console.log('🔍 PayPal Client ID Debug:', {
                          clientId: clientId ? `${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 10)}` : 'undefined',
                          length: clientId?.length || 0,
                          isTest: clientId === 'test',
                          isEmpty: !clientId || clientId.trim() === ''
                        });
                      }
                      return null;
                    })()}
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
                        currency: 'USD',
                        intent: 'capture',
                        components: 'buttons',
                        disableFunding: 'card,paylater,venmo',
                      }}
                      deferLoading={false}
                    >
                      <PayPalButtonWrapper
                        createOrder={handlePayPalPayment}
                        onApprove={handlePayPalApprove}
                        onError={(error: Error) => {
                          console.error('PayPal error:', error);
                          setPaymentError('PayPal payment failed. Please try again.');
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                  )
                ) : (
                  isCartEmpty ? (
                    <div className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-bold text-lg text-center cursor-not-allowed">
                      Cart is empty, cannot pay！
                    </div>
                  ) : (
                    <button
                      onClick={handleStripePayment}
                      disabled={isProcessing || !clientSecret || isCartEmpty}
                      className="w-full bg-[#0070ba] hover:bg-[#005a94] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 'Pay now'}
                    </button>
                  )
                )}
                
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Your info will be saved to a Shop account. By continuing, you agree to{' '}
                  <Link href="#" className="underline">Shop's Terms of Service</Link>
                  {' '}and acknowledge the{' '}
                  <Link href="/policies/privacy-policy" className="underline">Privacy Policy</Link>.
                </p>
              </div>

              {/* Footer Links */}
              <div className="flex gap-4 text-sm text-[#543313] pb-8">
                <Link href="/policies/refund-policy" className="underline hover:text-[#d41872] transition-colors">
                  Refund policy
                </Link>
                <Link href="/policies/shipping-policy" className="underline hover:text-[#d41872] transition-colors">
                  Shipping
                </Link>
                <Link href="/policies/privacy-policy" className="underline hover:text-[#d41872] transition-colors">
                  Privacy policy
                </Link>
              </div>
            </div>

            {/* Right Column - Order Summary (Fixed) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-white border border-[#543313] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#543313] mb-6">Order summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.filter(item => !item.isFreeStickers).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#543313] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-[#543313] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#543313] truncate">{item.name}</p>
                        <p className="text-xs text-[#543313]">{item.animal}</p>
                        <p className="text-sm font-bold text-[#543313] mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Free Stickers */}
                  {hasFreeStickers() && (
                    items.filter(item => item.isFreeStickers).map((stickerItem) => {
                      // First sticker is free, subsequent stickers cost $5 each
                      // Display price: $0.00 if quantity is 1, $5.00 if quantity > 1
                      const displayPrice = stickerItem.quantity === 1 ? 0 : stickerItem.price;
                      return (
                        <div key={stickerItem.id} className="bg-white border border-[#543313] rounded-lg p-4">
                          <div className="flex gap-3 items-start">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl mb-0.5">🎨</div>
                                <p className="text-[6px] font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#543313] mb-1">Cute Stickers</p>
                              <p className="text-xs text-[#543313] mb-2">1 PAIR (-$5.00)</p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-gray-500 line-through text-xs">$5.00</span>
                                <span className="text-sm font-bold text-[#543313]">
                                  {displayPrice === 0 ? '$0.00' : `$${displayPrice.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[#543313]">🏷️</span>
                                <span className="text-xs font-semibold text-[#543313]">Free Gift</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 border border-[#543313] rounded-full px-3 py-1 bg-white">
                                  <button
                                    onClick={() => updateQuantity(stickerItem.id, stickerItem.quantity - 1)}
                                    className="text-[#543313] font-bold text-lg hover:text-[#d41872] transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="text-[#543313] font-bold min-w-[20px] text-center text-sm">
                                    {stickerItem.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(stickerItem.id, stickerItem.quantity + 1)}
                                    className="text-[#543313] font-bold text-lg hover:text-[#d41872] transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFreeStickers()}
                                  className="text-[#543313] underline hover:text-[#d41872] transition-colors font-semibold text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add Free Stickers */}
                  {!hasFreeStickers() && (
                    <div className="bg-white border border-[#543313] rounded-lg p-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl mb-0.5">🎨</div>
                            <p className="text-[6px] font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#543313] mb-1">Cute Stickers</p>
                          <p className="text-xs text-[#543313] mb-2">1 PAIR (-$5.00)</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-gray-500 line-through text-xs">$5.00</span>
                            <span className="text-sm font-bold text-[#543313]">$0.00</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#543313]">🏷️</span>
                            <span className="text-xs font-semibold text-[#543313]">Free Gift</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-[#543313] rounded-full px-3 py-1 bg-white">
                              <button
                                onClick={addFreeStickers}
                                className="text-[#543313] font-bold text-lg hover:text-[#d41872] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={addFreeStickers}
                              className="text-[#543313] underline hover:text-[#d41872] transition-colors font-semibold text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-[#543313]">
                    <span>Subtotal</span>
                    <span>{items.length} items - ${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#543313]">
                    <span>Shipping</span>
                    <span className="text-gray-500">Enter shipping address</span>
                  </div>
                  <div className="pt-3 border-t-2 border-[#543313]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-[#543313]">Total</span>
                      <span className="text-xl font-bold text-[#543313]">USD ${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#543313] text-right">TOTAL SAVINGS ${totalSavings.toFixed(2)}</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <CartSidebar />
    </div>
  );
}

