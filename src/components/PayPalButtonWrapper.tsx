'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';

// 扩展 Window 接口
declare global {
  interface Window {
    paypal?: {
      Buttons?: any;
    };
  }
}

interface PayPalButtonWrapperProps {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError: (error: any) => void;
}

export default function PayPalButtonWrapper({
  createOrder,
  onApprove,
  onError,
}: PayPalButtonWrapperProps) {
  const [scriptState, dispatch] = usePayPalScriptReducer();
  const { isResolved, isPending, isRejected, loadingStatus } = scriptState;
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 检查 Client ID 是否有效
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    // 详细的调试信息（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 PayPalButtonWrapper - Full Debug Info:', {
        clientId: {
          exists: !!clientId,
          isTest: clientId === 'test',
          isEmpty: !clientId || clientId.trim() === '',
          length: clientId?.length || 0,
          preview: clientId ? `${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 10)}` : 'undefined'
        },
        scriptState: {
          isPending,
          isResolved,
          isRejected,
          loadingStatus,
        },
        windowPaypal: typeof window !== 'undefined' ? {
          exists: !!window.paypal,
          type: typeof window.paypal,
          keys: window.paypal ? Object.keys(window.paypal).slice(0, 10) : []
        } : 'server-side'
      });
    }
    
    if (!clientId || clientId === 'test' || clientId.trim() === '') {
      setErrorMessage('PayPal Client ID is not configured. Please check your .env.local file and restart the server.');
      return;
    }

    // 监听 PayPal SDK 加载状态
    if (isRejected) {
      console.error('❌ PayPal SDK rejected:', loadingStatus);
      setErrorMessage(
        `PayPal SDK failed to load. Status: ${loadingStatus || 'unknown'}. ` +
        `Please check your Client ID is correct and your internet connection.`
      );
      return;
    }

    // 当脚本状态解析后，检查 PayPal SDK
    if (isResolved && typeof window !== 'undefined') {
      let checkCount = 0;
      const maxChecks = 150; // 最多检查150次（15秒）
      
      // 检查 window.paypal.Buttons 是否存在
      const checkPayPal = () => {
        const globalWindow = window as Window & { paypal?: any };
        const paypal = globalWindow.paypal;
        
        // 验证这是真正的 PayPal SDK 对象（不应该有 React 属性）
        if (paypal && typeof paypal === 'object') {
          const keys = Object.keys(paypal);
          // 如果包含 React 内部属性，说明这不是真正的 PayPal SDK
          const hasReactProps = keys.some(key => key.startsWith('_react') || key === 'checked' || key === '_valueTracker');
          
          if (hasReactProps) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ window.paypal is not the PayPal SDK object (detected React properties)');
            }
            return false;
          }
          
          // 打印调试信息（每20次检查打印一次，避免日志过多）
          if (process.env.NODE_ENV === 'development' && checkCount % 20 === 0 && checkCount > 0) {
            console.log('🔍 Checking PayPal SDK object:', {
              exists: !!paypal,
              keysCount: keys.length,
              firstKeys: keys.slice(0, 5),
              hasButtons: !!paypal.Buttons,
              paypalType: typeof paypal,
              constructor: paypal.constructor?.name,
              checkCount
            });
          }
          
          // 检查 Buttons 是否存在
          if (paypal.Buttons && typeof paypal.Buttons === 'function') {
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ PayPal Buttons found!');
            }
            setIsPayPalReady(true);
            return true;
          }
          
          // 检查是否有其他可用的组件
          if (process.env.NODE_ENV === 'development' && keys.length > 0 && keys.length < 20) {
            console.warn('⚠️ PayPal SDK loaded but Buttons component not found. Available properties:', keys);
          }
        } else if (typeof window !== 'undefined') {
          // 检查 PayPal SDK 脚本是否已加载到页面
          const paypalScript = document.querySelector('script[src*="paypal"]');
          if (paypalScript && process.env.NODE_ENV === 'development' && checkCount % 20 === 0 && checkCount > 0) {
            console.log('📜 PayPal script tag found in DOM:', {
              src: (paypalScript as HTMLScriptElement).src,
              loaded: paypalScript.hasAttribute('data-loaded')
            });
          }
        }
        return false;
      };

      // 立即检查一次
      checkCount++;
      if (checkPayPal()) {
        return;
      }

      // 等待一小段时间让 SDK 完全初始化
      const initialDelay = setTimeout(() => {
        checkCount++;
        if (checkPayPal()) {
          return;
        }

        // 定期检查
        const interval = setInterval(() => {
          checkCount++;
          if (checkPayPal()) {
            clearInterval(interval);
          } else if (checkCount >= maxChecks) {
            clearInterval(interval);
            const globalWindow = window as Window & { paypal?: any };
            const paypal = globalWindow.paypal;
            const keys = paypal ? Object.keys(paypal) : [];
            const hasReactProps = keys.some(key => key.startsWith('_react') || key === 'checked' || key === '_valueTracker');
            
            // 检查脚本标签
            const paypalScript = document.querySelector('script[src*="paypal"]');
            
            const paypalInfo = {
              windowPaypal: !!paypal,
              windowPaypalKeys: keys,
              hasReactProps: hasReactProps,
              windowPaypalButtons: !!(paypal && paypal.Buttons),
              checkCount,
              paypalType: paypal ? typeof paypal : 'undefined',
              scriptInDOM: !!paypalScript,
              scriptSrc: paypalScript ? (paypalScript as HTMLScriptElement).src : null,
              loadingStatus
            };
            console.error('❌ PayPal SDK timeout:', paypalInfo);
            
            if (!paypalScript) {
              setErrorMessage(
                `PayPal SDK script failed to load. The script tag was not found in the DOM. ` +
                `This might indicate a network issue or invalid Client ID. ` +
                `Please check your browser's Network tab for errors loading PayPal scripts.`
              );
            } else if (hasReactProps) {
              setErrorMessage(
                `PayPal SDK failed to load. window.paypal is pointing to a DOM element instead of PayPal SDK. ` +
                `This might be caused by an element with id="paypal" on the page. ` +
                `Please check your PayPal Client ID and ensure PayPal SDK script loaded correctly.`
              );
            } else if (!paypal) {
              setErrorMessage(
                `PayPal SDK script loaded but window.paypal is undefined. ` +
                `Script status: ${loadingStatus || 'unknown'}. ` +
                `This might indicate an issue with the Client ID or PayPal server. ` +
                `Please verify your Client ID in PayPal Developer Dashboard.`
              );
            } else {
              setErrorMessage(
                `PayPal Buttons component failed to load after 15 seconds. ` +
                `Available properties: ${keys.length > 0 ? keys.join(', ') : 'none'}. ` +
                `Please verify your Client ID in PayPal Developer Dashboard.`
              );
            }
          }
        }, 100);

        return () => {
          clearInterval(interval);
        };
      }, 1000);

      return () => {
        clearTimeout(initialDelay);
      };
    }
  }, [isResolved, isRejected, isPending, loadingStatus]);

  if (errorMessage) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg py-4 px-4">
        <p className="text-red-700 text-sm mb-2">{errorMessage}</p>
        <p className="text-red-600 text-xs">
          Make sure NEXT_PUBLIC_PAYPAL_CLIENT_ID is set in your .env.local file with a valid PayPal Client ID.
        </p>
      </div>
    );
  }

  if (isPending || (isResolved && !isPayPalReady)) {
    return (
      <div className="w-full bg-gray-100 rounded-lg py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070ba] mb-2"></div>
          <p className="text-[#543313] text-sm">Loading PayPal...</p>
          {isResolved && !isPayPalReady && (
            <p className="text-[#543313] text-xs mt-2">Waiting for PayPal SDK...</p>
          )}
        </div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg py-4 px-4">
        <p className="text-red-700 text-sm mb-2">Failed to load PayPal. Please check:</p>
        <ul className="text-red-600 text-xs list-disc list-inside space-y-1">
          <li>Your PayPal Client ID is valid</li>
          <li>Your internet connection is working</li>
          <li>Try refreshing the page</li>
        </ul>
      </div>
    );
  }

  if (!isPayPalReady || typeof window === 'undefined' || !window.paypal || !window.paypal.Buttons) {
    return (
      <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg py-4 flex items-center justify-center">
        <p className="text-yellow-700 text-sm">PayPal is initializing. Please wait...</p>
      </div>
    );
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
      }}
      fundingSource="paypal"
    />
  );
}

