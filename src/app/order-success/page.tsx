import { Suspense } from 'react';
import OrderSuccessPageContent from './page-content';

export default function OrderSuccessPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#e8e0ca] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d41872]"></div>
      </div>
    }>
      <OrderSuccessPageContent />
    </Suspense>
  );
}