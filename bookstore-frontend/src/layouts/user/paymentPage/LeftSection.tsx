import PaymentMethod from './PaymentMethod';
import DeliveryMethod from '@/layouts/user/paymentPage/DeliveryMethod';

export default function LeftSection() {
  return (
    <>
      <DeliveryMethod />
      <PaymentMethod />
    </>
  );
}
