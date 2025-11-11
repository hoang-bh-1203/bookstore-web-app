import ShippingAddress from "./ShippingAddress";
import VoucherSection from "./VoucherSection";
import OrderSummary from "./OrderSummary";

export default function RightSection() {
    return (
        <>
            <ShippingAddress />
            <VoucherSection />
            <OrderSummary />
        </>
    );
}
