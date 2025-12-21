import LeftSection from '@/layouts/user/paymentPage/LeftSection.tsx';
import RightSection from '@/layouts/user/paymentPage/RightSection.tsx';
import PaymentHeader from '@/layouts/user/payment/PaymentHeader.tsx';
import PaymentFooter from '@/layouts/user/payment/PaymentFooter.tsx';

export default function Payment() {
  return (
    <div className="bg-[#F5F5FA] min-h-screen">
      <PaymentHeader />
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-10 gap-6 mt-6">
        <div className="lg:col-span-7 space-y-4">
          <LeftSection />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <RightSection />
        </div>
      </div>
      <PaymentFooter />
    </div>
  );
}
