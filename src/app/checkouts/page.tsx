import { Suspense } from 'react';
import CheckoutPageContent from './page-content';

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d41872]"></div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}