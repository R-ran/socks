import Layout from '@/components/Layout';

export default function ShippingPolicyPage() {
  return (
    <Layout>
      <div className="bg-[#e8e0ca] pt-12 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#543313] mb-8 text-center">Shipping policy</h1>
          
          <div>
            <p className="text-[#543313] leading-relaxed text-lg">
              We prepare and pack all orders within 48 hours to make sure your new cozy socks are on their way quickly. Every order comes with a tracking number, so you can follow your package from our warehouse to your doorstep. Standard delivery takes around 7-10 business days, depending on your location. We'll keep you updated along the way, so you always know where your order is.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
