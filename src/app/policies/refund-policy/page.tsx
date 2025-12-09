import Layout from '@/components/Layout';

export default function RefundPolicyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#543313] mb-8 text-center">Refund policy</h1>
          
          <div className="space-y-8">
            <section>
              <p className="text-[#543313] leading-relaxed">
                We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. <br /><br />
                To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase. <br /><br />
                To start a return, you can contact us at <a href="mailto:info@animalsocks.co" className="text-[#d41872] underline hover:opacity-70">info@animalsocks.co</a>. <br /><br />
                If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted. <br /><br />
                You can always contact us for any return question at <a href="mailto:info@animalsocks.co" className="text-[#d41872] underline hover:opacity-70">info@animalsocks.co</a>.
              </p>
            </section>

            <section>
              <p className="text-[#543313] leading-relaxed">
                <strong>Damages and issues</strong> <br />
                Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
              </p>
            </section>

            <section>
              <p className="text-[#543313] leading-relaxed">
                <strong>Exceptions / non-returnable items</strong> <br />
                Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item. <br /><br />
                Unfortunately, we cannot accept returns on sale items or gift cards.
              </p>
            </section>

            <section>
              <p className="text-[#543313] leading-relaxed">
                <strong>Exchanges</strong> <br />
                The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
              </p>
            </section>

            <section>
              <p className="text-[#543313] leading-relaxed">
                <strong>European Union 14 day cooling off period</strong> <br />
                Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
              </p>
            </section>

            <section>
              <p className="text-[#543313] leading-relaxed">
                <strong>Refunds</strong> <br />
                We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too. <br />
                If more than 15 business days have passed since we've approved your return, please contact us at <a href="mailto:info@animalsocks.co" className="text-[#d41872] underline hover:opacity-70">info@animalsocks.co</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
