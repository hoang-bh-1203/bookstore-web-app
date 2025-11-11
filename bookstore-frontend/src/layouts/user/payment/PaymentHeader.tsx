import logo from '@/assets/logo.svg';
import { Link } from 'react-router-dom';

const PaymentHeader = ({ isConfirm = false }: { isConfirm?: boolean }) => {
  return (
    <header className="flex w-full overflow-hidden bg-background py-4 px-4 md:px-6 shadow-sm border-b">
      <div className="container mx-auto flex items-center">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-auto md:h-12" />
        </Link>
        <div className="flex items-center ml-4 md:ml-6">
          {!isConfirm && (
            <div className="border-l-2 border-primary pl-4 text-2xl text-primary font-medium">
              Thanh Toán
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PaymentHeader;
